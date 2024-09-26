import { setCookie, getCookie, deleteCookie } from "./cookies";

/**
 * @jest-environment jsdom
 */

describe("Cookie Utils", () => {
  describe("setCookie", () => {
    it("should set a cookie with the specified name and value", () => {
      const cname = "testCookie";
      const cvalue = "testValue";

      setCookie(cname, cvalue);

      // Retrieve the set cookie from document.cookie
      const cookie = document.cookie;

      expect(cookie).toContain(`${cname}=${cvalue}`);
    });
  });

  describe("getCookie", () => {
    it("should return the value of an existing cookie", () => {
      const cname = "testCookie";
      const cvalue = "testValue";

      // Set a cookie for testing
      document.cookie = `${cname}=${cvalue}`;

      const result = getCookie(cname);

      expect(result).toBe(cvalue);
    });

    it("should return an empty string for a non-existent cookie", () => {
      const cname = "nonExistentCookie";

      const result = getCookie(cname);

      expect(result).toBe("");
    });

    it("should get cookie with empty space before keyname", () => {
      const cname = "testCookie";
      const cvalue = "testValue";
      document.cookie = `${cname}=${cvalue}; testCookie2=testValue2`;

      const result = getCookie(cname);

      expect(result).toBe(cvalue);
    });
  });

  describe("deleteCookie", () => {
    it("should delete an existing cookie", () => {
      const cname = "testCookie";
      const cvalue = "testValue";

      // Set a cookie for testing
      document.cookie = `${cname}=${cvalue}`;

      deleteCookie(cname);

      // Retrieve the cookie to check if it's deleted
      const cookie = document.cookie;

      expect(cookie).not.toContain(`${cname}=${cvalue}`);
    });

    it("should not throw an error for a non-existent cookie", () => {
      const cname = "nonExistentCookie";

      expect(() => {
        deleteCookie(cname);
      }).not.toThrow();
    });
  });
});
