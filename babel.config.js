module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": "commonjs"
      }
    ],
    [
      "@babel/preset-react",
      {
        // You don't need to import React after configured this
        "runtime": "automatic"
      }
    ],
    "@babel/typescript"
  ]
}