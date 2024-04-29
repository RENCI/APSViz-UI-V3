import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


export default [
  {
    files: ["src/**/*.js"],
    ignores: ["**/*.config.js"],
    languageOptions: { globals: globals.browser },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "semi": "error",
      "prefer-const": "error",
      "no-dupe-args": "error",
      "no-dupe-keys": "error",

    },
    linterOptions: { reportUnusedDisableDirectives: "error" }
  },
  pluginJs.configs.recommended,
  pluginReactConfig,
];