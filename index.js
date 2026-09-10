import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

const ignoredWarnings = [
  '[Reanimated] Reduced motion setting is enabled on this device.',
  'props.pointerEvents is deprecated. Use style.pointerEvents',
  '"shadow*" style props are deprecated. Use "boxShadow".',
];

LogBox.ignoreLogs(ignoredWarnings);

if (__DEV__) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args.map(String).join(' ');
    if (ignoredWarnings.some((warning) => message.includes(warning))) {
      return;
    }
    originalWarn(...args);
  };
}

// Configure warning filters before App imports navigation and Reanimated.
const App = require('./App').default;

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
