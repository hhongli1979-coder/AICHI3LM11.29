// // const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// // /**
// //  * Metro configuration
// //  * https://reactnative.dev/docs/metro
// //  *
// //  * @type {import('@react-native/metro-config').MetroConfig}
// //  */
// // const config = {};

// // module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

// module.exports = mergeConfig(getDefaultConfig(__dirname), {
//   transformer: {
//     babelTransformerPath: require.resolve('react-native-svg-transformer'),
//   },
//   resolver: {
//     assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(
//       ext => ext !== 'svg',
//     ),
//     sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg'],
//   },
// })


const os = require('os');

// 🔧 Fallback patch for older Node.js versions
if (!os.availableParallelism) {
  os.availableParallelism = () => os.cpus().length;
}

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// ⛔ Don't call getDefaultConfig multiple times
const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
});
