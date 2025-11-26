import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },

  },
  // Architectural enforcement: Components must only use abstract Element class
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['**/types', '../types', '../../types'],
            importNames: ['ClassDTO', 'EnumDTO', 'SlotDTO', 'SelectedElement'],
            message: 'Components must not import DTOs. Use Element classes from models/Element instead. See docs/CLAUDE.md for architectural principles.',
          },
          {
            group: ['**/models/Element', '../models/Element', '../../models/Element'],
            importNames: ['ClassElement', 'EnumElement', 'SlotElement', 'VariableElement'],
            message: 'Components must only import abstract Element class, not concrete subclasses. Use polymorphic methods instead. See docs/CLAUDE.md for architectural principles.',
          },
        ],
      }],
    },
  },
  // Architectural enforcement: DTOs can only be used in dataLoader
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/utils/dataLoader.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['**/types', '../types', '../../types', './types'],
            importNames: ['ClassDTO', 'EnumDTO', 'SlotDTO'],
            message: 'DTOs (ClassDTO, EnumDTO, SlotDTO) can only be used in dataLoader.ts. Use Element classes instead. See PHASE_6.4_PLAN.md for details.',
          },
        ],
      }],
    },
  },
])
