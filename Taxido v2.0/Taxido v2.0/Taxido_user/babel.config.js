module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    '@babel/plugin-proposal-optional-chaining' ,
    '@babel/plugin-proposal-nullish-coalescing-operator',
    [
      'module-resolver',
      {
        root: ['./src/'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@src': './src',
          '@screens': './src/screens',
          '@theme': './src/themes',
          '@style': './src/styles',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@commonComponent': './src/commonComponent',
          '@components': './src/components',
          '@api': './src/api',
          '@App': './App',
        }
      }
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      }
    ],
  ],
};
