module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,  
    commonjs: true,
    es6: true,
    jquery: false,
    jest: true,
    jasmine: true,
    'cypress/globals': true  
  },
  extends: ['eslint:recommended', 'plugin:jest/recommended'],
  plugins: ['jest', 'cypress'],
  parserOptions: {
    ecmaVersion: 10,
    sourceType: 'module'
  },
  rules: {
    indent: [
      'error',
      2
    ],
    quotes: [
      'error',
      'single'
    ],
    'no-var': [
      'error'
    ],
    'no-console': [
      'warn'
    ],
    'no-unused-vars': [
      'warn'
    ],
    'no-mixed-spaces-and-tabs': [
      'error'
    ]
  }
}
