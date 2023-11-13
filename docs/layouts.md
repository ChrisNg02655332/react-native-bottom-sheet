# Create layouts

If you want to add custom BottomSheet types - or overwrite the existing ones - you can add a [`config` prop](./api.md#props) when rendering the `BottomSheet` component in your app's entry point.

When creating the `config`, you can either:

1. Create Bottom layouts from scratch

```js
// App.jsx
import  { BottomSheet } from '@antbase/react-native-bottom-sheet';

/*
  1. Create the config
*/
const config = {
  content: (props) => (
    <View style={{ height: 60, width: '100%' }}>
      <Text>Welcome</Text>
      <Text>{props.uuid}</Text>
    </View>
    ),
  };
/*
  2. Pass the config as prop to the BottomSheet component instance
*/
export function App(props) {
  return (
    <>
      {...}
      <BottomSheet config={config} />
    </>
  );
}
```

Then just use the library as before.

For example, if I want to show the new `content` type I just created above:

```js
BottomSheet.show({
  type: 'content',
  // And I can pass any custom props I want
  props: { uuid: 'bba1a7d0-6ab2-4a0a-a76e-ebbe05ae6d70' }
});
```
