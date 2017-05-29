module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": 0,
    "no-extra-boolean-cast": 0,
    "no-console": 0,
    "no-var": 0,
    "semi": [
      "error",
      "always"
    ],
    "mocha/no-exclusive-tests": "error"
  },
  "plugins": [
    "mocha"
  ],
  "globals": {
    "before": true,
    "describe": true,
    "it": true
  }
};
