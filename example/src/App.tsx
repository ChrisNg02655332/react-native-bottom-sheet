import * as React from 'react';

import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from 'react-native-bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

const Content1 = (props: any) => {
  console.log(props);

  return (
    <View>
      <Text>Content 1</Text>
    </View>
  );
};

const config = {
  content_1: Content1,
};

export default function App() {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Button
            title="Content 1"
            onPress={() => {
              BottomSheet.show({
                type: 'content_1',
                height: height * 0.5,
              });
            }}
          />
        </View>
        <BottomSheet config={config} />
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
