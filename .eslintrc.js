module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true,
  },
  "plugins": [
    "react"
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "no-debugger": 1,
    "no-console": 1,
    "semi": 1,
    "no-constant-condition": 1,
    "no-dupe-args": 1,
    "no-dupe-keys": 1,
    "no-duplicate-case": 1,
    "no-empty": 1,
    "no-extra-boolean-cast": 1,
    "no-extra-parens": 1,
    "no-extra-semi": 1,
    "no-func-assign": 1,
    "no-inner-declarations": 1,
    "no-irregular-whitespace": 1,
    "no-template-curly-in-string": 1,
    "no-unexpected-multiline": 1,
    "no-unreachable": 1,
    "no-unsafe-negation": 1,
    "use-isnan": 1,
    "valid-typeof": 1,
    "array-callback-return": 1,
    "block-scoped-var": 1,
    "class-methods-use-this": 1,
    "complexity": ["warn", 5],
    "consistent-return": 1,
    "curly": 1,

    // Require that the first prop in a JSX element be on a new line when the element is multiline
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
    "react/jsx-first-prop-new-line": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/no-array-index-key": "warn",
  },
};