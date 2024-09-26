const fs = require("fs");

module.exports = (pathToFile, integrationData) => {
  const file = fs.readFileSync(pathToFile).toString();

  const landmarkIndexes = [];
  let error;

  Object.keys(integrationData).forEach((landmark) => {
    const landmarkRegexp = new RegExp(`// ${landmark}`, "g");
    const landmarkIndex = file.search(landmarkRegexp);
    if (landmarkIndex < 0) {
      error = ` error searching for ${landmark} landmark.\nSee ${pathToFile}.`;
      return;
    }
    landmarkIndexes.push(landmarkIndex);
  });

  if (error) {
    console.error(error);
    return;
  }
  const codeToAdd = Object.values(integrationData);

  const newFile = landmarkIndexes.reduce(
    (acc, currentValue, idx, indexArray) => {
      const isLastIndex = idx === indexArray.length - 1;

      let newAcc;
      if (idx === 0) {
        newAcc = acc.slice(0, currentValue).concat(codeToAdd[idx]);
        return isLastIndex
          ? newAcc.concat(file.slice(currentValue, file.length))
          : newAcc;
      }

      newAcc = acc
        .concat(file.slice(indexArray[idx - 1], currentValue))
        .concat(codeToAdd[idx]);

      return isLastIndex
        ? newAcc.concat(file.slice(currentValue, file.length))
        : newAcc;
    },
    file
  );

  fs.writeFile(pathToFile, newFile, (err) => {
    if (err) {
      console.warn(`ERROR writing to ${pathToFile}`);
    }
  });
};
