/**
 * Schema validation script - analyzes unexpected fields in source data
 * Run this before commits to catch schema changes
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Expected fields for each DTO type (must match dataLoader.ts)
const EXPECTED_FIELDS = {
  slot: ['range', 'description', 'slot_uri', 'identifier', 'required', 'multivalued'],
  enum: ['description', 'permissible_values'],
  class: ['name', 'description', 'parent', 'abstract', 'attributes', 'slots', 'slot_usage'],
};

interface UnexpectedFieldReport {
  field: string;
  count: number;
  examples: string[]; // Entity names that have this field
}

interface NameMismatch {
  key: string;
  name: string;
}

interface ValidationResults {
  slots: UnexpectedFieldReport[];
  enums: UnexpectedFieldReport[];
  classes: UnexpectedFieldReport[];
  nameMismatches: {
    enums: NameMismatch[];
    classes: NameMismatch[];
    slots: NameMismatch[];
  };
}

function analyzeUnexpectedFields(
  entities: Record<string, any>,
  expectedFields: string[],
  maxExamples = 5,
  entityKeysAreName = false // If true, exclude 'name' field from unexpected if it matches key
): UnexpectedFieldReport[] {
  const fieldCounts = new Map<string, { count: number; examples: string[] }>();

  for (const [key, entity] of Object.entries(entities)) {
    const actualFields = Object.keys(entity);
    const expectedSet = new Set(expectedFields);

    // Filter out 'name' field if it matches the key (canonical name comes from key)
    const unexpected = actualFields.filter(f => {
      if (!expectedSet.has(f)) {
        if (entityKeysAreName && f === 'name' && entity.name === key) {
          return false; // Name matches key - not unexpected, just redundant
        }
        return true;
      }
      return false;
    });

    for (const field of unexpected) {
      if (!fieldCounts.has(field)) {
        fieldCounts.set(field, { count: 0, examples: [] });
      }
      const entry = fieldCounts.get(field)!;
      entry.count++;
      if (entry.examples.length < maxExamples) {
        entry.examples.push(key);
      }
    }
  }

  return Array.from(fieldCounts.entries())
    .map(([field, data]) => ({
      field,
      count: data.count,
      examples: data.examples,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
}

function checkNameMismatches(entities: Record<string, any>): NameMismatch[] {
  const mismatches: NameMismatch[] = [];

  for (const [key, entity] of Object.entries(entities)) {
    if (entity.name && entity.name !== key) {
      mismatches.push({ key, name: entity.name });
    }
  }

  return mismatches;
}

function main() {
  console.log('📊 Schema Validation Report\n');
  console.log('Analyzing unexpected fields in source data...\n');

  // Load metadata
  const metadataPath = join(process.cwd(), 'public/source_data/HM/bdchm.metadata.json');
  const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));

  const results: ValidationResults = {
    // For enums, classes, and slots - keys ARE the canonical names
    // So 'name' field matching key is redundant but not unexpected
    slots: analyzeUnexpectedFields(metadata.slots || {}, EXPECTED_FIELDS.slot, 5, true),
    enums: analyzeUnexpectedFields(metadata.enums || {}, EXPECTED_FIELDS.enum, 5, true),
    classes: analyzeUnexpectedFields(metadata.classes || {}, EXPECTED_FIELDS.class, 5, true),
    nameMismatches: {
      enums: checkNameMismatches(metadata.enums || {}),
      classes: checkNameMismatches(metadata.classes || {}),
      slots: checkNameMismatches(metadata.slots || {}),
    },
  };

  // Print results
  let hasIssues = false;

  // Check for name mismatches first
  const allMismatches = [
    ...results.nameMismatches.enums,
    ...results.nameMismatches.classes,
    ...results.nameMismatches.slots,
  ];

  if (allMismatches.length > 0) {
    hasIssues = true;
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚨 NAME MISMATCHES: ${allMismatches.length} error(s)\n`);
    console.log('Keys are the canonical names - explicit name fields must match!\n');

    for (const mismatch of allMismatches) {
      console.log(`  Key: "${mismatch.key}"`);
      console.log(`  Name field: "${mismatch.name}" ❌`);
      console.log();
    }
  }

  // Check for unexpected fields
  for (const [category, reports] of Object.entries(results)) {
    if (category === 'nameMismatches') continue; // Already handled above

    if (reports.length > 0) {
      hasIssues = true;
      console.log(`\n${'='.repeat(60)}`);
      console.log(`${category.toUpperCase()}: ${reports.length} unexpected field(s)\n`);

      for (const report of reports) {
        console.log(`  Field: "${report.field}"`);
        console.log(`  Count: ${report.count} occurrence(s)`);
        console.log(`  Examples: ${report.examples.join(', ')}`);
        console.log();
      }
    }
  }

  if (!hasIssues) {
    console.log('✅ No unexpected fields or mismatches found!\n');
    process.exit(0);
  } else {
    console.log(`${'='.repeat(60)}\n`);
    console.log('⚠️  Issues detected!');
    console.log('These fields exist in the schema but are not in the TypeScript interfaces.\n');
    console.log('Next steps:');
    console.log('1. Review the fields above');
    console.log('2. Fix any name mismatches (key should match name field)');
    console.log('3. Add needed fields to TypeScript interfaces in src/types.ts');
    console.log('4. Update EXPECTED_FIELDS in scripts/validate-schema.ts');
    console.log('5. Or document why these fields should be ignored\n');
    console.log('Note: Redundant name fields matching keys are filtered out as harmless.\n');
    process.exit(1); // Exit with error code to fail CI/pre-commit hooks
  }
}

main();
