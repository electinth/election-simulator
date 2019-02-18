module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "extends": [
    "airbnb",
    "prettier"
  ],
  "plugins": [
    "promise",
    "compat",
    "babel",
    "prettier"
  ],
  "env": {
    "browser": true
  },
  "globals": {
    "describe": true,
    "expect": true,
    "ga": true,
    "it": true,
    "document": false,
    "navigator": false,
    "window": false,
  },
  "rules": {
    "no-plusplus": "off",
    "class-methods-use-this": "off",
    "multiline-comment-style": "off",
    "no-else-return": [
      "error",
      {
        "allowElseIf": true
      }
    ],
    "no-invalid-this": "off",
    "object-curly-spacing": "off",
    "padded-blocks": [
      "error",
      {
        "classes": "never",
        "switches": "never"
      }
    ],
    "babel/new-cap": "error",
    "babel/no-invalid-this": "error",
    "babel/object-curly-spacing": [
      "error",
      "always"
    ],
    "babel/semi": "error",
    "compat/compat": "error",
    "lines-between-class-members": [
      "error",
      "always",
      {
        "exceptAfterSingleLine": true
      }
    ],
    "prettier/prettier": "error",
    "promise/always-return": "error",
    "promise/avoid-new": "off",
    "promise/catch-or-return": "error",
    "promise/no-callback-in-promise": "error",
    "promise/no-native": "off",
    "promise/no-nesting": "off",
    "promise/no-new-statics": "error",
    "promise/no-promise-in-callback": "error",
    "promise/no-return-in-finally": "error",
    "promise/no-return-wrap": [
      "error",
      {
        "allowReject": true
      }
    ],
    "promise/param-names": "error",
    "promise/valid-params": "error",
    "react/sort-prop-types": "off",
    "react/jsx-sort-default-props": "off",
    "react/no-unsafe": "error",
    "complexity": [
      "error",
      11
    ],
    "newline-before-return": "error",
    "no-constant-condition": "error",
    "no-div-regex": "error",
    "no-eq-null": "error",
    "no-implicit-coercion": "error",
    "no-magic-numbers": [
      "error",
      {
        "ignore": [
          -1,
          0,
          1,
          2,
          3
        ],
        "ignoreArrayIndexes": true,
        "enforceConst": true
      }
    ],
    "no-native-reassign": "error",
    "no-negated-condition": "error",
    "no-useless-call": "error",
    "sort-keys": [
      "error",
      "asc",
      {
        "caseSensitive": false,
        "natural": true
      }
    ],
    "import/default": "error",
    "import/no-anonymous-default-export": [
      "error",
      {
        "allowArray": true,
        "allowLiteral": true,
        "allowObject": true
      }
    ],
    "react/forbid-foreign-prop-types": "error",
    "react/jsx-handler-names": [
      "error",
      {
        "eventHandlerPrefix": "handle",
        "eventHandlerPropPrefix": "on"
      }
    ],
    "react/jsx-key": "error",
    "react/jsx-no-literals": "off",
    "react/no-did-mount-set-state": "error",
    "react/no-direct-mutation-state": "error",
    "react/prefer-stateless-function": "off",
    "function-paren-newline": "off",
    "react/jsx-one-expression-per-line": "off"
  },
  "overrides": [{
    "env": {
      "node": true
    },
    "files": [
      "{src}/**/*.{js,jsx,ts,tsx}"
    ],
    "rules": {
      "no-magic-numbers": "off",
      "sort-keys": "off",
      "import/no-extraneous-dependencies": "off",
      "react/jsx-filename-extension": "off"
    }
  }]
}
