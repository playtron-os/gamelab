// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import globals from "globals";
import importPlugin from "eslint-plugin-import-x";
import reactHooks from "eslint-plugin-react-hooks";
import lingui from "eslint-plugin-lingui";
import prettier from "eslint-plugin-prettier/recommended";
import { fixupPluginRules } from "@eslint/compat";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  prettier,
  {
    plugins: {
      reactHooks,
      lingui: fixupPluginRules(lingui)
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker
      }
    }
  },
  {
    rules: {
      "import-x/no-duplicates": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/require-await": "error"
    },
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    // LINGUI rules
    rules: {
      // If t is called at top level it won't get updated when locale changes
      "lingui/t-call-in-function": "error",
      // Enforces that we give as much context to translators as possible
      "lingui/no-expression-in-message": "error",
      // Prevents useless translations
      "lingui/no-single-variables-to-translate": "error",
      "lingui/no-trans-inside-trans": "error"
    },
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: ["src/**/*.test.*", "src/**/*.spec.*", "src/mocks/**"]
  },
  {
    // Warn on unlocalized strings within .tsx files only
    rules: {
      "lingui/no-unlocalized-strings": [
        "warn", // TODO: Change this to error in the future
        {
          ignoreFunction: [
            "console.log",
            "console.warn",
            "console.error",
            "error",
            "info",
            "trace",
            "debug",
            "warn",
            "Error",
            "useSubmissions"
          ]
        }
      ]
    },
    files: ["src/**/*.tsx"],
    ignores: ["src/**/*.test.*", "src/**/*.spec.*", "src/mocks/**"]
  },
  {
    files: [
      "**/*.test.tsx",
      "**/*.test.ts",
      "src/utils/test-utils.tsx",
      "src/mocks/**"
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off"
    }
  },
  {
    ignores: [
      "dist",
      "eslint.config.mjs",
      "internals",
      "src-tauri",
      "config/jest"
    ]
  }
);
