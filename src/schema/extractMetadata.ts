// Extract metadata from the TypeScript schema file
// This reads the schema file as text and parses interface declarations
// to extract class names, descriptions, parent classes, and properties

import * as fs from 'fs';
import * as path from 'path';

interface ClassMetadata {
  name: string;
  description: string;
  parent?: string;
  properties: Record<string, { type: string; description: string; optional: boolean }>;
}

function extractMetadata(schemaFilePath: string): Map<string, ClassMetadata> {
  const content = fs.readFileSync(schemaFilePath, 'utf-8');
  const classes = new Map<string, ClassMetadata>();

  // Match: /** description */ followed by export interface ClassName [extends Parent] { ... }
  const interfacePattern = /\/\*\*\s*\n\s*\*\s*([^\n]+)\s*\n\s*\*\/\s*\n\s*export interface (\w+)(?:\s+extends\s+(\w+))?\s*\{([^}]+)\}/g;

  let match;
  while ((match = interfacePattern.exec(content)) !== null) {
    const [, description, name, parent, body] = match;

    // Extract properties from the interface body
    const properties: Record<string, { type: string; description: string; optional: boolean }> = {};

    // Match: /** prop description */ followed by propName?: type,
    const propPattern = /\/\*\*\s*([^*]+?)\s*\*\/\s*\n\s*(\w+)(\?)?:\s*([^,\n]+)/g;
    let propMatch;

    while ((propMatch = propPattern.exec(body)) !== null) {
      const [, propDesc, propName, optional, propType] = propMatch;
      properties[propName] = {
        type: propType.trim(),
        description: propDesc.trim(),
        optional: !!optional
      };
    }

    classes.set(name, {
      name,
      description: description.trim(),
      parent: parent || undefined,
      properties
    });
  }

  return classes;
}

// Generate the metadata JSON file
const schemaPath = path.join(__dirname, 'bdchm.schema.ts');
const metadata = extractMetadata(schemaPath);

// Convert Map to object for JSON serialization
const metadataObj: Record<string, ClassMetadata> = {};
metadata.forEach((value, key) => {
  metadataObj[key] = value;
});

// Write to JSON file
const outputPath = path.join(__dirname, 'bdchm.metadata.json');
fs.writeFileSync(outputPath, JSON.stringify(metadataObj, null, 2));

console.log(`Extracted metadata for ${metadata.size} classes to ${outputPath}`);
