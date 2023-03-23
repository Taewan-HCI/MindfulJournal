module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    '@typescript-eslint/parser',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
  rules: {},
  settings: {
    react: {
      version: 'detect',
    },
  },
};
