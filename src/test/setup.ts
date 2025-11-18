import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { readFileSync } from 'fs';
import { join } from 'path';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock fetch to read from file system
global.fetch = vi.fn((url: string | URL) => {
  const urlStr = url.toString();

  // Extract file path from URL
  let filePath: string;
  if (urlStr.includes('bdchm.metadata.json')) {
    filePath = 'public/source_data/HM/bdchm.metadata.json';
  } else if (urlStr.includes('bdchm.expanded.yaml')) {
    filePath = 'public/source_data/HM/bdchm.expanded.yaml';
  } else if (urlStr.includes('variable-specs-S1.tsv')) {
    filePath = 'public/source_data/HV/variable-specs-S1.tsv';
  } else {
    return Promise.reject(new Error(`Unmocked fetch URL: ${urlStr}`));
  }

  try {
    const content = readFileSync(join(process.cwd(), filePath), 'utf-8');
    return Promise.resolve({
      ok: true,
      status: 200,
      text: () => Promise.resolve(content),
      json: () => Promise.resolve(JSON.parse(content)),
    } as Response);
  } catch (error) {
    return Promise.resolve({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response);
  }
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
