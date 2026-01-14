/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const { nextJsConfig } = require("@we-got-jobz/eslint-config/next-js");
const tseslint = require("typescript-eslint");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  ...nextJsConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
      },
    },
  },
  {
    files: ['tailwind.config.js', 'postcss.config.js', 'tailwind.config.cjs', 'postcss.config.cjs'],
    rules: {
      'no-undef': 'off'
    }
  }
];
