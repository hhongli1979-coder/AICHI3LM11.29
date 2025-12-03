setupFiles: ['<rootDir>/jest.setup.js']

import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);


jest.mock("react-native/Libraries/TurboModule/TurboModuleRegistry", () => {
    const turboModuleRegistry = jest.requireActual("react-native/Libraries/TurboModule/TurboModuleRegistry");
    return {
      ...turboModuleRegistry,
      getEnforcing: name => {
        if (name === "RNDocumentPicker") {
          return null;
        }
        return turboModuleRegistry.getEnforcing(name);
      }
    };
  });