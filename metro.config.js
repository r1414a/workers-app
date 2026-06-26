// // @ts-nocheck
// import { getDefaultConfig } from "expo/metro-config";
// import { withNativeWind } from "nativewind/metro";

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, { input: "./src/global.css" });

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./src/global.css" });
