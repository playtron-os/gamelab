import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transformIgnorePatterns: [],
  moduleNameMapper: {
    "\\.svg": "<rootDir>/config/jest/svgMock.js",
    "\\.(jpg|jpeg|png|gif|webp)$": "<rootDir>/config/jest/fileMock.js",
    "@/(.*)$": "<rootDir>/src/$1"
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^.+\\.scss$": "<rootDir>/config/jest/cssTransform.js"
  },
  setupFiles: ["<rootDir>/config/jest/setupTests.ts"],
  setupFilesAfterEnv: ["<rootDir>/config/jest/setupEnv.ts"],
  testTimeout: 15000
};
export default config;
