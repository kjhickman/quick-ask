import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Import/Export rules
      'no-unused-vars': 'off', // Turn off base rule as it conflicts with TypeScript version
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }], // Allow certain console methods
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // Browser extension specific
      'no-undef': 'off', // TypeScript handles this
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  }
);
