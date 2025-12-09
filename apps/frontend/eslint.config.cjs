import { nextJsConfig } from "@we-got-jobz/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    files: ['tailwind.config.js', 'postcss.config.js'],
    rules: {
      'no-undef': 'off'
    }
  }
];
