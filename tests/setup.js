// Jest setup file

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock Expo modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [''],
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: () => null,
  },
  Tabs: {
    Screen: () => null,
  },
}));

// Mock Lucide icons
jest.mock('lucide-react-native', () => ({
  Award: () => null,
  Home: () => null,
  Gamepad2: () => null,
  User: () => null,
  // Add other icons as needed
}));

// Global setup
global.beforeAll(() => {
  // Setup global test environment
});

global.afterAll(() => {
  // Cleanup global test environment
});