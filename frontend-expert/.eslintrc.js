module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
  rules: {
    'object-curly-newline': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.ts', '**/*.test.tsx'],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
