# How to render the BottomSheet when using a Navigation library?

1. Usage with [react-navigation](https://reactnavigation.org)

## Usage with [react-navigation](https://reactnavigation.org)

To have the BottomSheet visible on top of the navigation `View` hierarchy, render it as the **last child** in the `View` hierarchy (along the root Navigation component):

```js
import { BottomSheet } from '@antbase/react-native-bottom-sheet'
import { NavigationContainer } from '@react-navigation/native';

export function App() {
  return (
    <>
      <NavigationContainer>
        {...}
      </NavigationContainer>
      <BottomSheet config={config} />
    </>
  );
}
```
