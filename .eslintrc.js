// Docs: https://eslint.org/docs/user-guide/configuring
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-restricted-imports': ['error', { patterns: ['.*'] }],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'internal', 'external', ['parent', 'sibling'], 'index', 'object', 'type', 'unknown'],
        pathGroups: [
          { pattern: 'node:*', group: 'builtin', position: 'before' },
          { pattern: 'nestjs', group: 'internal', position: 'before' },
          { pattern: '#/**', group: 'parent', position: 'before' },
          { pattern: '#*/**', group: 'sibling', position: 'after' },
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
