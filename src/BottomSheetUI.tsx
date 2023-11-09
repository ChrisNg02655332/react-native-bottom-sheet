import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';

import type {
  BottomSheetConfig,
  BottomSheetHideParams,
  BottomSheetOptions,
  BottomSheetShowParams,
} from './types';

import { SCREEN_HEIGHT, MAX_TRANSLATE_Y } from './useBottomSheet';

const MAX_OPACITY = 0.8;

type BottomSheetUIProps = {
  options: BottomSheetOptions;
  config: BottomSheetConfig;
  show: (params: BottomSheetShowParams) => void;
  hide: (params: BottomSheetHideParams) => void;
};

const BottomSheetUI = ({
  hide,
  options: { height, disableClose },
}: BottomSheetUIProps) => {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const backdrop = useSharedValue(0);

  const scrollTo = React.useCallback(
    (destination: number) => {
      'worklet';
      translateY.value = withSpring(destination, { damping: 50 }, () => {
        if (destination === 0) runOnJS(hide)();
      });
    },
    [translateY, hide]
  );

  const onHide = () => {
    backdrop.value = withTiming(0);
    scrollTo(0);
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
      backdrop.value = MAX_OPACITY;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      console.log(disableClose);
      if (translateY.value < (-4 * height!) / 3) {
        scrollTo(MAX_TRANSLATE_Y);
      } else if (
        (translateY.value <= (-2 * height!) / 3 &&
          translateY.value >= (-4 * height!) / 3) ||
        disableClose
      ) {
        scrollTo(-height!);
      } else if (translateY.value > (-2 * height!) / 3) {
        runOnJS(onHide)();
      }
    });

  const animateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: Math.min(backdrop.value, MAX_OPACITY),
    };
  });

  React.useEffect(() => {
    scrollTo(-Math.abs(height!));
    backdrop.value = withTiming(MAX_OPACITY);
  }, [height, scrollTo, backdrop]);

  return (
    <>
      <TouchableWithoutFeedback onPress={onHide}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.container, animateStyle]}>
          <View style={styles.line} />
          <Text>Content</Text>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    zIndex: 1,
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#111',
  },
  container: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    zIndex: 1,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
});

export default BottomSheetUI;
