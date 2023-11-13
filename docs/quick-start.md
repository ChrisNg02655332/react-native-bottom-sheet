# Quick start

## Install

```sh
yarn add @antbase/react-native-bottom-sheet
# or
npm install --save @antbase/react-native-bottom-sheet
```

## Usage

Render the `BottomSheet` component in your app's entry file, as the **LAST CHILD** in the `View` hierarchy (along with any other components that might be rendered there):

```js
// App.tsx
import { BottomSheet } from '@antbase/react-native-bottom-sheet';

const config = {
  content: (props: any) => (
    <View>
      <Text>Welcome 👋</Text>
      <Button
        title="Hide"
        onPress={() => { BottomSheet.hide()}
      />
    </View>
  ),
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

Then use it anywhere in your app (even outside React components), by calling [any `BottomSheet` method](./api.md#methods) directly:

```js
// Foo.tsx
import { BottomSheet } from '@antbase/react-native-bottom-sheet';
import { Button } from 'react-native'

export function Foo(props) {
  const show = () => {
    BottomSheet.show({
      type: 'content',
    });
  }

  return (
    <Button
      title='Show BottomSheet'
      onPress={show}
    />
  )
}
```

## What's next

Explore the following topics:

- [Using the BottomSheet API](./api.md)
- [Create layouts](./layouts.md)
