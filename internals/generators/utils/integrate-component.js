const caseUtil = require("case");
const generateLandmarkIntegration = require("./generate-landmark-integration");

// fileType should be actions reducers should be a file name in src/redux
const integrateModule = (moduleName) => {
  const camelDuck = `${caseUtil.camel(moduleName)}Reducers`;

  const reducerFileIntegrationData = {
    IMPORT_PT: `import ${camelDuck} from 'redux/modules/${camelDuck}/${camelDuck}Slice';\n`,
    INSERTION_PT: `  ${camelDuck},\n`
  };

  generateLandmarkIntegration(
    "./src/redux/reducers.js",
    reducerFileIntegrationData
  );
};

module.exports = integrateModule;
