const presets = [
  [
    "@babel/typescript",
    "@babel/env",
    {
      targets: {
        browsers: ["ie >= 11"]
      }
    }
  ]
];

module.exports = { presets };
