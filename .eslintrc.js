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
    "no-plusplus": "off"
  }
}
