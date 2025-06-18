import eslintPluginTs from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs
    },
    rules: {
      quotes: ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-single'],
      semi: ['error', 'never'],
      'space-before-function-paren': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'eol-last': ['error', 'always']

    }
  }
]
