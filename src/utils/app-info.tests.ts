import { nearestPowerOfTwo } from "./app-info";

describe("Disk size", () => {
  test("Nearest power of two", () => {
    expect(nearestPowerOfTwo(510)).toBe(512);
    expect(nearestPowerOfTwo(513)).toBe(512);
    expect(nearestPowerOfTwo(63)).toBe(64);
    expect(nearestPowerOfTwo(64)).toBe(64);
  });
});
