/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const componentGenerator = require("./component/index");

module.exports = (plop) => {
  plop.setGenerator("component", componentGenerator);
  plop.addHelper("directory", (comp) => {
    return `components/${comp}`;
  });
  plop.addHelper("curly", (object, open) => (open ? "{" : "}"));
};
