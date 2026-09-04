import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';
import { load as parseYaml } from 'js-yaml';
import { loadModelData } from '../utils/dataLoader';
import { ClassCollection, EnumCollection, SlotCollection, VariableCollection } from '../models/Element';
import type { ClassInput } from '../input_types';

/**
 * Data Completeness Test
 *
 * This test verifies that all information from source files makes it through
 * the data pipeline:
 * 1. bdchm.yaml → bdchm.processed.json (Python preprocessing)
 * 2. bdchm.processed.json + variable-specs-S1.tsv → ModelData (TypeScript loadModelData)
 *
 * Reports missing fields but does NOT fail the test - this is for visibility only.
 */

interface CompletenessReport {
  yamlToProcessed: {
    topLevelFields: string[];
    prefixes: boolean;
    imports: boolean;
  };
  metadataToModelData: {
    missingClasses: string[];
    missingEnums: string[];
    missingSlots: string[];
  };
  variableSpecs: {
    unmappedVariables: string[];
    totalVariables: number;
    mappedVariables: number;
  };
}

describe('Data Completeness', () => {
  test('should report completeness of data pipeline', async () => {
    const report: CompletenessReport = {
      yamlToProcessed: {
        topLevelFields: [],
        prefixes: false,
        imports: false,
      },
      metadataToModelData: {
        missingClasses: [],
        missingEnums: [],
        missingSlots: [],
      },
      variableSpecs: {
        unmappedVariables: [],
        totalVariables: 0,
        mappedVariables: 0,
      },
    };

    // Load source data
    const yamlContent = readFileSync('public/source_data/HM/bdchm.yaml', 'utf-8');
    const yamlData = parseYaml(yamlContent) as Record<string, unknown>;

    const processedContent = readFileSync('public/source_data/HM/bdchm.processed.json', 'utf-8');
    const processedJson = JSON.parse(processedContent) as {
      classes: Record<string, unknown>;
      enums: Record<string, unknown>;
      slots: Record<string, unknown>;
    };

    const tsvContent = readFileSync('public/source_data/HV/variable-specs-S1.tsv', 'utf-8');
    const tsvLines = tsvContent.trim().split('\n');
    const tsvHeaders = tsvLines[0].split('\t');

    const modelData = await loadModelData();

    // Extract collections
    const classCollection = modelData.collections.get('class') as ClassCollection;
    const enumCollection = modelData.collections.get('enum') as EnumCollection;
    const slotCollection = modelData.collections.get('slot') as SlotCollection;
    const variableCollection = modelData.collections.get('variable') as VariableCollection;

    const classHierarchy = classCollection.getRootElements();
    const enums = enumCollection.getAllElements();
    const slots = new Map(slotCollection.getSlots());
    const variables = variableCollection.getAllElements();

    // 1. Check YAML → Processed JSON
    const yamlTopLevelFields = ['id', 'name', 'title', 'description', 'license',
                                 'see_also', 'prefixes', 'imports', 'default_prefix',
                                 'default_range'];
    const missingTopLevelFields = yamlTopLevelFields.filter(
      field => field in yamlData && !(field in processedJson)
    );
    report.yamlToProcessed.topLevelFields = missingTopLevelFields;
    report.yamlToProcessed.prefixes = 'prefixes' in yamlData && !('prefixes' in processedJson);
    report.yamlToProcessed.imports = 'imports' in yamlData && !('imports' in processedJson);

    // 2. Check Processed JSON → ModelData
    const metadataClassNames = Object.keys(processedJson.classes || {});
    const collectClassNames = (classes: ClassInput[]): Set<string> => {
      const names = new Set<string>();
      for (const cls of classes) {
        names.add(cls.name);
        if (cls.children) {
          for (const child of cls.children) {
            names.add(child.name);
            collectClassNames(child.children || []).forEach(n => names.add(n));
          }
        }
      }
      return names;
    };
    const modelDataClassNames = collectClassNames(classHierarchy);
    report.metadataToModelData.missingClasses = metadataClassNames.filter(
      name => !modelDataClassNames.has(name)
    );

    const metadataEnumNames = Object.keys(processedJson.enums || {});
    const modelDataEnumNames = new Set(enums.map(e => e.name));
    report.metadataToModelData.missingEnums = metadataEnumNames.filter(
      name => !modelDataEnumNames.has(name)
    );

    // `_comment` is documentation embedded in the slots section, not a slot;
    // dataLoader skips underscore-prefixed keys, so it is not "missing".
    const metadataSlotNames = Object.keys(processedJson.slots || {}).filter(
      name => !name.startsWith('_'),
    );
    const modelDataSlotNames = new Set(slots.keys());
    report.metadataToModelData.missingSlots = metadataSlotNames.filter(
      name => !modelDataSlotNames.has(name)
    );

    // 3. Check Variable Specs
    // The column is 'BDCHM Element'. This looked for 'Class', found -1, and
    // silently skipped the whole section -- reporting "0 variables" against a
    // 154-row TSV, so a mapping failure could never have shown up here.
    const classColumnIdx = tsvHeaders.indexOf('BDCHM Element');
    if (classColumnIdx !== -1) {
      const tsvVariables = tsvLines.slice(1).map(line => {
        const cols = line.split('\t');
        return cols[classColumnIdx] || '';
      });

      report.variableSpecs.totalVariables = tsvVariables.length;
      report.variableSpecs.mappedVariables = variables.length;

      // Check if any variables didn't make it through
      const modelVariableSet = new Set(
        variables.map(v => `${v.Class}_${v.Variable}`)
      );

      // Note: This is a simplified check - actual mapping might be more complex
      report.variableSpecs.unmappedVariables = tsvVariables
        .filter(className => className && !modelDataClassNames.has(className))
        .slice(0, 10); // Limit to first 10 for readability
    }

    // Print report (not fail)
    // TSV rows upstream marked status=ignore. Section 3 subtracts these, and
    // the assertion below uses the same number.
    const statusIdx = tsvHeaders.indexOf('status');
    const ignoredRows = tsvLines.slice(1).filter(
      line => statusIdx !== -1 && (line.split('\t')[statusIdx] || '').trim() === 'ignore',
    ).length;

    console.log('\n=== DATA COMPLETENESS REPORT ===\n');

    console.log('1. bdchm.yaml -> bdchm.processed.json:');
    if (report.yamlToProcessed.topLevelFields.length > 0) {
      console.log(`   ℹ️  Schema-level fields not carried into processed.json (by design --`);
      console.log(`      the app reads classes/slots/enums/types, not schema metadata):`);
      console.log(`      ${report.yamlToProcessed.topLevelFields.join(', ')}`);
    } else {
      console.log('   ✓ All top-level fields present');
    }
    // prefixes IS carried into processed.json; imports is not, because the
    // transform resolves `linkml:types` rather than passing it along. Both are
    // expected, so neither gets a warning -- only a change would matter, and
    // the field list above already reports that.
    if (!report.yamlToProcessed.prefixes) {
      console.log('   ✓ prefixes carried through');
    } else {
      console.log('   ⚠️  prefixes no longer carried into processed.json');
    }

    console.log('\n2. bdchm.processed.json -> ModelData:');
    if (report.metadataToModelData.missingClasses.length > 0) {
      console.log(`   ⚠️  Missing classes: ${report.metadataToModelData.missingClasses.join(', ')}`);
    } else {
      console.log(`   ✓ All ${metadataClassNames.length} classes loaded`);
    }
    if (report.metadataToModelData.missingEnums.length > 0) {
      console.log(`   ⚠️  Missing enums: ${report.metadataToModelData.missingEnums.join(', ')}`);
    } else {
      console.log(`   ✓ All ${metadataEnumNames.length} enums loaded`);
    }
    if (report.metadataToModelData.missingSlots.length > 0) {
      console.log(`   ⚠️  Missing slots: ${report.metadataToModelData.missingSlots.join(', ')}`);
    } else {
      console.log(`   ✓ All ${metadataSlotNames.length} slots loaded`);
    }

    console.log('\n3. Variable Specs:');
    console.log(`   Rows in TSV:            ${report.variableSpecs.totalVariables}`);
    console.log(`   Marked status=ignore:  -${ignoredRows}`);
    console.log(`   Expected in ModelData:  ${report.variableSpecs.totalVariables - ignoredRows}`);
    console.log(`   Actually in ModelData:  ${report.variableSpecs.mappedVariables}`);
    if (report.variableSpecs.mappedVariables === report.variableSpecs.totalVariables - ignoredRows) {
      console.log('   ✓ Accounted for (the gap is the ignored rows, not a mapping failure)');
    }
    if (report.variableSpecs.unmappedVariables.length > 0) {
      console.log(`   ⚠️  Sample unmapped variables (first 10): ${report.variableSpecs.unmappedVariables.join(', ')}`);
    }

    console.log('\n=== END REPORT ===\n');

    // Section 2 assertions. These were `expect(true).toBe(true)` with a note
    // saying the test was informational -- so a class silently vanishing from
    // ModelData produced a console warning inside a green run, which is how
    // nobody would ever see it. The three lists are empty today, so asserting
    // costs nothing and turns a silent regression into a failure.
    expect(
      report.metadataToModelData.missingClasses,
      'Classes in processed.json that never reached ModelData',
    ).toEqual([]);
    expect(
      report.metadataToModelData.missingEnums,
      'Enums in processed.json that never reached ModelData',
    ).toEqual([]);
    expect(
      report.metadataToModelData.missingSlots,
      'Slots in processed.json that never reached ModelData',
    ).toEqual([]);

    // Section 3: every TSV row should become a variable unless it is marked
    // status=ignore. Asserting on the raw count would be wrong -- 6 rows are
    // deliberately ignored upstream (all "Spirometry metadata"), which is
    // exactly the 155 vs 149 gap.
    expect(
      report.variableSpecs.mappedVariables,
      `Expected ${report.variableSpecs.totalVariables} TSV rows minus ${ignoredRows} ` +
        'marked status=ignore to reach ModelData',
    ).toBe(report.variableSpecs.totalVariables - ignoredRows);

    // Section 1 stays informational: those top-level fields are genuinely not
    // carried into processed.json by design, and asserting would just freeze
    // the current shape of the transform.
  });
});
