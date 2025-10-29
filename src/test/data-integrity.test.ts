import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';
import { load as parseYaml } from 'js-yaml';
import { loadModelData } from '../utils/dataLoader';
import { ClassCollection, EnumCollection, SlotCollection, VariableCollection } from '../models/Element';
import type { ClassNode } from '../types';

/**
 * Data Completeness Test
 *
 * This test verifies that all information from source files makes it through
 * the data pipeline:
 * 1. bdchm.yaml → bdchm.metadata.json (Python preprocessing)
 * 2. bdchm.metadata.json + variable-specs-S1.tsv → ModelData (TypeScript loadModelData)
 *
 * Reports missing fields but does NOT fail the test - this is for visibility only.
 */

interface CompletenessReport {
  yamlToMetadata: {
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
      yamlToMetadata: {
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

    const metadataContent = readFileSync('public/source_data/HM/bdchm.metadata.json', 'utf-8');
    const metadataJson = JSON.parse(metadataContent) as {
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

    // 1. Check YAML → Metadata
    const yamlTopLevelFields = ['id', 'name', 'title', 'description', 'license',
                                 'see_also', 'prefixes', 'imports', 'default_prefix',
                                 'default_range'];
    const missingTopLevelFields = yamlTopLevelFields.filter(
      field => field in yamlData && !(field in metadataJson)
    );
    report.yamlToMetadata.topLevelFields = missingTopLevelFields;
    report.yamlToMetadata.prefixes = 'prefixes' in yamlData && !('prefixes' in metadataJson);
    report.yamlToMetadata.imports = 'imports' in yamlData && !('imports' in metadataJson);

    // 2. Check Metadata → ModelData
    const metadataClassNames = Object.keys(metadataJson.classes || {});
    const collectClassNames = (classes: ClassNode[]): Set<string> => {
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

    const metadataEnumNames = Object.keys(metadataJson.enums || {});
    const modelDataEnumNames = new Set(enums.map(e => e.name));
    report.metadataToModelData.missingEnums = metadataEnumNames.filter(
      name => !modelDataEnumNames.has(name)
    );

    const metadataSlotNames = Object.keys(metadataJson.slots || {});
    const modelDataSlotNames = new Set(slots.keys());
    report.metadataToModelData.missingSlots = metadataSlotNames.filter(
      name => !modelDataSlotNames.has(name)
    );

    // 3. Check Variable Specs
    const classColumnIdx = tsvHeaders.indexOf('Class');  // Use capital C to match TSV
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
    console.log('\n=== DATA COMPLETENESS REPORT ===\n');

    console.log('1. YAML → Metadata.json:');
    if (report.yamlToMetadata.topLevelFields.length > 0) {
      console.log(`   ⚠️  Missing top-level fields: ${report.yamlToMetadata.topLevelFields.join(', ')}`);
    } else {
      console.log('   ✓ All top-level fields present');
    }
    if (report.yamlToMetadata.prefixes) {
      console.log('   ⚠️  Prefixes missing from metadata.json');
    }
    if (report.yamlToMetadata.imports) {
      console.log('   ⚠️  Imports missing from metadata.json');
    }

    console.log('\n2. Metadata.json → ModelData:');
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
    console.log(`   Total variables in TSV: ${report.variableSpecs.totalVariables}`);
    console.log(`   Variables in ModelData: ${report.variableSpecs.mappedVariables}`);
    if (report.variableSpecs.unmappedVariables.length > 0) {
      console.log(`   ⚠️  Sample unmapped variables (first 10): ${report.variableSpecs.unmappedVariables.join(', ')}`);
    }

    console.log('\n=== END REPORT ===\n');

    // Always pass - this is informational only
    expect(true).toBe(true);
  });
});
