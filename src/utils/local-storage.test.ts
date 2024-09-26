import { parseJson } from "./local-storage";

describe("Local Storage utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("parseJSON fail", () => {
    const malformedJson = '{ "value": "dummyToken"';
    const result = parseJson(malformedJson);
    expect(result).toBeNull();
  });
});
