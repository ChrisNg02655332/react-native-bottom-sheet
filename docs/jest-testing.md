# How to mock the library for testing with [jest](https://jestjs.io)?

```js
jest.mock('@antbase/react-native-bottom-sheet', () => ({
  show: jest.fn(),
  hide: jest.fn()
}));
```
