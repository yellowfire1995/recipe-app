import js from "@eslint/js";
import nodePlugin from "eslint-plugin-n";
import globals from "globals";

export default [
  { ignores: ["dist"] },
  nodePlugin.configs["flat/recommended"],
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-console": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "prefer-const": "warn",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      "no-duplicate-imports": "error",
      "n/no-unpublished-import": [
        "error",
        {
          allowModules: ["@eslint/js", "eslint-plugin-n", "globals"], // allow eslint devDeps
        },
      ],
      "n/no-extraneous-import": [
        "error",
        {
          allowModules: ["globals"],
        },
      ],
    },
  },
];
