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
                props: {
                  uuid: 'bba1a7d0-6ab2-4a0a-a76e-aabe05ae6d70',
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
