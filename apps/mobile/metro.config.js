const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs", "cjs"];

config.transformer.unstable_allowRequireContext = true;

// Alias react-native -> react-native-web for web platform
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "react-native": require.resolve("react-native-web"),
};

module.exports = config;
