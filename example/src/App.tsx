import * as React from 'react';

import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import {
  BottomSheet,
  BottomSheetScrollView,
} from '@antbase/react-native-bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

const Content1 = () => {
  return (
    <BottomSheetScrollView>
      <Text>Content 1</Text>
      <Button
        title="Hide"
        onPress={() => {
          BottomSheet.hide();
        }}
      />
    </BottomSheetScrollView>
  );
};

const config = {
  content_1: (props: any) => <Content1 {...props} />,
};

export default function App() {
  // const backdrop = () => (
  //   <View
  //     style={{
  //       position: 'absolute',
  //       zIndex: 1,
  //       height: height,
  //       width: '100%',
  //       backgroundColor: 'red',
  //     }}
  //   />
  // );

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Button
            title="Content 1"
            onPress={() => {
              BottomSheet.show({
                type: 'content_1',
                height: height * 0.4,
                // disableClose: false,
                // customBackdrop: backdrop,
                props: {
                  hehe: 'aaa',
                },
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
