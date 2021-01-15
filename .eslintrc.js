module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  rules: {
    'linebreak-style': ['error', 'windows'],
    indent: ["error", 4],
    quotes: [
      'warn',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],
     
  },
};
