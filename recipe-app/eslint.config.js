import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // catch bugs
      "no-console": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",

      // code quality
      "prefer-const": "warn",
      "no-var": "error",
      eqeqeq: ["error", "always"], // enforce === over ==
      "no-duplicate-imports": "error",

      // react specific
      "react/self-closing-comp": "warn", // <Component /> instead of <Component></Component>
      "react/jsx-no-useless-fragment": "warn",
      "react/jsx-curly-brace-presence": [
        "warn",
        { props: "never", children: "never" },
      ], // no unnecessary {} around strings
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
