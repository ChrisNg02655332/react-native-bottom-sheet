# How to show the BottomSheet inside a Modal?

## How are `refs` tracked

By default, when you render a `<BottomSheet />` instance in your App's entry point (root), a `ref` is created and tracked internally.

```js
// App.jsx
import { BottomSheet } from '@antbase/react-native-bottom-sheet'

export function App(props) {
  return (
    <>
      {/* ... */}
      {/* A `ref` pointing to this BottomSheet instance is created */}
      <BottomSheet config={config} />
    </>
  );
}
```

Under the hood, this `ref` is used when you imperatively call `BottomSheet.show()` or `BottomSheet.hide()`.

## Showing a BottomSheet inside a Modal

When you have a [Modal](https://reactnative.dev/docs/modal), things get different. This `Modal` component is [_above_ React's root `View`](https://stackoverflow.com/questions/39766350/bring-view-on-top-of-modal-using-zindex-style-with-react-native), so the only way to show something _on top of the modal_ is to render it inside the `Modal` itself.

This means **you need a new instance** of `<BottomSheet />` rendered inside your `Modal` (as well as keeping the existing `<BottomSheet />` instance outside, in your App's entry point).

```diff
// App.jsx
import { Modal } from 'react-native'
import { BottomSheet } from '@antbase/react-native-bottom-sheet'

export function App(props) {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  return (
    <>
      {/* ... */}
      <BottomSheet config={config} />
      <Modal visible={isModalVisible}>
+       <BottomSheet config={config} />
      </Modal>
    </>
  );
}
```

Everything else works as usual; you can show and hide Bottomsheets using the imperative API: `BottomSheet.show()` or `BottomSheet.hide()`. When the `Modal` is visible, the `ref` from inside the `Modal` will be used, otherwise the one outside.

> The `ref` is tracked automatically; whichever `<BottomSheet />` instance last had its `ref` set will be used when showing/hiding.

### Notes regarding `react-native-modal` or `NativeStackNavigator`

The same requirements as above apply when using [react-native-modal](https://github.com/react-native-modal/react-native-modal) or a [NativeStackNavigator](https://reactnavigation.org/docs/native-stack-navigator#presentation) with `presentation: 'modal'`:

```js
<>
  {/* This `BottomSheet` will show when neither the native stack screen nor `Modal` are presented */}
  <BottomSheet config={config} />

  <NativeStackNavigator.Screen>
    {/* This `BottomSheet` will show when the `NativeStackNavigator.Screen` is visible, but the `Modal` is NOT visible. */}
    <BottomSheet config={config} />

    <Modal>
      {/* This `BottomSheet` will show when both the `NativeStackNavigator.Screen` and the `Modal` are visible. */}
      <BottomSheet config={config} />
    </Modal>
  </NativeStackNavigator.Screen>
</>
```
