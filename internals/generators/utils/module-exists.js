/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require("fs");
const path = require("path");

const reduxModules = fs.readdirSync(
  path.join(__dirname, "../../../src/redux/modules")
);

function moduleExist(comp) {
  return reduxModules.indexOf(comp) >= 0;
}

module.exports = moduleExist;
