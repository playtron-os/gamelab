/**
 * Component Generator
 */

/* eslint strict: ["off"] */

"use strict";

const Case = require("case");
const componentExists = require("../utils/component-exists");
const generateLandmarkIntegration = require("../utils/generate-landmark-integration");

module.exports = {
  description: "Add a component",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "What should it be called?",
      default: "NewComponent",
      validate: (value) => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? "A component with this name already exists"
            : true;
        }

        return "The name is required";
      }
    },
    {
      type: "confirm",
      name: "takesClassNameAsProp",
      default: false,
      message: "Do you want it to take 'className' as a prop?"
    }
  ],
  actions: (data) => {
    const actions = [];
    // Generate component.tsx, component.scss, component.test.tsx, component.stories.tsx, index.ts
    actions.push(
      {
        type: "add",
        path: "../../src/components/{{kebabCase name}}/{{kebabCase name}}.tsx",
        templateFile: "./component/functional.js.hbs",
        abortOnFail: true
      },
      {
        type: "add",
        path: "../../src/components/{{kebabCase name}}/{{kebabCase name}}.scss",
        templateFile: "./shared/index.scss.hbs",
        abortOnFail: true
      },
      {
        type: "add",
        path: "../../src/components/{{kebabCase name}}/{{kebabCase name}}.test.ts",
        templateFile: "./shared/test.js.hbs",
        abortOnFail: true
      },
      {
        type: "add",
        path: "../../src/components/{{kebabCase name}}/index.ts",
        templateFile: "./component/index.js.hbs",
        abortOnFail: true
      }
    );

    const componentNameCamel = Case.camel(data.name);
    const indexFileIntegrationData = {
      EXPORT_PT: `export { ${Case.pascal(componentNameCamel)} } from './${Case.kebab(data.name)}';\n`
    };

    generateLandmarkIntegration(
      "./src/components/index.ts",
      indexFileIntegrationData
    );

    return actions;
  }
};
