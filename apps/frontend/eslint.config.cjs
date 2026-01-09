/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const { nextJsConfig } = require("@we-got-jobz/eslint-config/next-js");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  ...nextJsConfig,
  {
    files: ['tailwind.config.js', 'postcss.config.js'],
    rules: {
      'no-undef': 'off'
    }
  }
];
