# Custome backdrop

If you want to add custom backdrop - you can add a [`config` prop](./api.md#props) when rendering the `BottomSheet` component in your app's entry point.

When creating the `config`, you can either:

1. Create Bottom with custom backdrop from scratch

```diff
 App.tsx
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

+ const backdrop = () => (
+   <View
+     style={{
+       position: 'absolute',
+       zIndex: 1,
+       top: 0,
+       left: 0,
+       right: 0,
+       bottom: 0,
+       backgroundColor: 'rgba(30, 61, 89, 0.7)',
+     }}
+   />
+   );

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

```diff
BottomSheet.show({
  type: 'content',
+ customBackdrop: backdrop, // add custom backdrop here
  props: { uuid: 'bba1a7d0-6ab2-4a0a-a76e-ebbe05ae6d70' }
});
```
