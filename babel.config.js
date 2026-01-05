module.exports = {
  presets: [
    [
      "@react-native/babel-preset",
      {
        runtime: "automatic",
      },
    ],
    "nativewind/babel",
  ],
  plugins: [
    "@babel/plugin-transform-export-namespace-from",
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "@shared-components": "./src/shared/components",
          "@shared-constants": "./src/shared/constants",
          "@font-size": "./src/shared/theme/font-size",
          "@api": "./src/services/api/index",
          "@fonts": "./src/shared/theme/fonts",
          "@colors": "./src/shared/theme/colors",
          "@theme": "./src/shared/theme",
          "@services": "./src/services",
          "@screens": "./src/screens",
          "@utils": "./src/utils",
          "@assets": "./src/assets",
          "@local-storage": "./src/services/local-storage",
          "@navigation": "./src/navigation",
          "@": "./src",
        },
      },
    ],
    "react-native-worklets/plugin",
  ],
};
