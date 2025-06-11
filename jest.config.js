// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios).+\\.js$", // allow axios to be transformed
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
