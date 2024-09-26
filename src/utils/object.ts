import { camelCase } from "lodash";

// eslint-disable-next-line
export const camelCaseKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelCaseKeys(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelCaseKeys(obj[key])
      }),
      {}
    );
  }
  return obj;
};
