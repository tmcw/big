module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "no-console": 0,
    "prefer-const": 2,
    "no-var": 2
  },
  overrides: [
    {
      files: ["bin/big.js"],
      env: {
        node: true
      },
      rules: {
        "no-unused-expressions": "off"
      }
    }
  ]
};
