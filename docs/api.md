# API

The `BottomSheet` API consists of:

1. [methods](#methods) that can be called directly on the `BottomSheet` object (in an _imperative_ way)
1. [props](#props) that can be passed to the `BottomSheet` component instance; they act as defaults for all BottomSheet that are shown

## methods

### `show(options = {})`

To show a BottomSheet, call the `show()` method andd pass the `options` that suit your needs. Everything is optional, unless specified otherwise:

```js
import { View, Text, Button } from 'react-native';
import { BottomSheet } from '@antbase/react-native-bottom-sheet';

const config = {
  content: (props: any) => <Content {...props} />,
};

const Content = () => {
  return (
    <View>
      <Text>Content 1</Text>
      <Button
        title="Hide"
        onPress={() => {
          BottomSheet.hide();
        }}
      />
    </View>
  );
};

BottomSheet.show({
  type: 'content',
});
```

The complete set of **options** is described below:

| option           | description                                                         | type              | default value |
| ---------------- | ------------------------------------------------------------------- | ----------------- | ------------- |
| `type`           | BottomSheet type.  [Learn how to define types](./layouts.md)        | `string`          |               |
| `onShow`         | Called when the BottomSheet is shown                                | `() => void`      |               |
| `onHide`         | Called when the BottomSheet hides                                   | `() => void`      |               |
| `props`          | Any custom props passed to the specified BottomSheet type. Has effect only when there is a custom BottomSheet type (configured via the `config` prop on the BottomSheet instance) that uses the `props` parameter | `any`             |               |

### `hide()`

To hide the current visible BottomSheet, call the `hide()` method:

```js
BottomSheet.hide();
```

If an `onHide` callback was set (via `show()`, or as a default `prop` on the BottomSheet component instance), it will be called now.

## props

The following set of `props` can be passed to the `BottomSheet` component instance to specify certain **defaults for all BottomSheets that are shown**:

| prop             | description                                       | type                                         | default value |
| ---------------- | ------------------------------------------------- | -------------------------------------------- | ------------- |
| `config`         | Layout configuration for custom BottomSheet types | [`BottomSheetConfig`](../src/types/index.ts) |               |
| `type`           | Default BottomSheet type `string`                 | `success`                                    |               |
| `onShow`         | Called when any BottomSheet is shown              | `() => void`                                 |               |
| `onHide`         | Called when any BottomSheet hides                 | `() => void`                                 |               |

For example, to make sure all your BottomSheets are displayed on the screen:

```js
// App.jsx
import { BottomSheet } from '@antbase/react-native-bottom-sheet';

const config = {
  content: (props: any) => <Content {...props} />,
};

export function App(props) {
  return (
    <>
      {/* ... */}
      <BottomSheet config={config} />
    </>
  );
}
```
