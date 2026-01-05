const { defineConfig, globalIgnores } = require("eslint/config");

const _import = require("eslint-plugin-import");
const reactNative = require("eslint-plugin-react-native");
const prettier = require("eslint-plugin-prettier");
const reactHooks = require("eslint-plugin-react-hooks");
const jest = require("eslint-plugin-jest");
const promise = require("eslint-plugin-promise");
const unusedImports = require("eslint-plugin-unused-imports");

const { fixupPluginRules, fixupConfigRules } = require("@eslint/compat");

const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    settings: {
      react: {
        version: "detect",
      },
    },

    plugins: {
      import: fixupPluginRules(_import),
      "react-native": reactNative,
      prettier,
      "react-hooks": fixupPluginRules(reactHooks),
      jest,
      promise,
      "unused-imports": unusedImports,
    },

    extends: fixupConfigRules(
      compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
      ),
    ),

    languageOptions: {
      parser: tsParser,

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },

        project: "./tsconfig.json",
      },

      globals: {
        ...globals.browser,
        ...globals.node,
        ...jest.environments.globals.globals,
      },
    },

    rules: {
      "max-len": ["error", 120],
      "react-native/no-unused-styles": 0,
      "react-native/split-platform-components": 0,
      "react-native/no-inline-styles": 2,
      "react-native/no-color-literals": 0,
      "react-native/no-raw-text": 0,
      "react-hooks/rules-of-hooks": 2,
      "react-hooks/exhaustive-deps": 2,
      "@typescript-eslint/ban-ts-comment": 1,
      "@typescript-eslint/explicit-function-return-type": 0,
      "@typescript-eslint/no-use-before-define": 0,
      "@typescript-eslint/camelcase": 0,
      "@typescript-eslint/no-empty-function": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/explicit-module-boundary-types": 0,
      "@typescript-eslint/no-var-requires": 0,
      "@typescript-eslint/no-non-null-assertion": 0,
      "prefer-destructuring": 2,
      "no-return-await": 0,
      "require-await": 2,
      "promise/always-return": 0,
      "no-nested-ternary": 2,
      "promise/no-return-wrap": 2,
      "promise/param-names": 2,
      "promise/catch-or-return": 2,
      "promise/no-nesting": 2,
      "promise/no-promise-in-callback": 2,
      "promise/no-callback-in-promise": 2,
      "promise/valid-params": 2,
      "no-void": 2,
      "import/namespace": 0,
      "import/no-unresolved": 0,
      "import/no-named-as-default": 0,

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "import/no-named-as-default-member": 0,
      "import/no-extraneous-dependencies": 0,
      "import/default": 0,
      "import/no-cycle": 0,
      "import/no-duplicates": 2,
      "unused-imports/no-unused-imports": 2,
      "unused-imports/no-unused-vars": 2,

      "react/no-unstable-nested-components": [
        "error",
        {
          allowAsProps: true,
        },
      ],

      "import/extensions": [
        "error",
        "never",
        {
          svg: "always",
          model: "always",
          style: "always",
          png: "always",
          jpg: "always",
          json: "always",
          jpeg: "always",
          constant: "always",
        },
      ],

      "@typescript-eslint/no-floating-promises": [
        2,
        {
          ignoreIIFE: true,
        },
      ],

      "react/jsx-filename-extension": [
        1,
        {
          extensions: [".js", ".jsx", ".tsx", ".ts"],
        },
      ],

      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
    },
  },
  globalIgnores([
    "**/*/*.test.*",
    "**/*/*.js",
    "**/*.js",
    "**/node_modules/**/*",
    "build/*",
    "dist/*",
    "node_modules/*",
  ]),
  {
    files: ["**/*.tsx", "**/*.ts"],

    rules: {
      "react/prop-types": 0,
    },
  },
  globalIgnores([
    "**/node_modules/",
    "**/node_modules/**/*",
    "**/build/",
    "**/dist/",
  ]),
]);
