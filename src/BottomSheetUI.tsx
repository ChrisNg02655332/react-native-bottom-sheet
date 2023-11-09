import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import type { SpringConfig } from 'react-native-reanimated/lib/typescript/reanimated2/animation/springUtils';

import type {
  BottomSheetConfig,
  BottomSheetHideParams,
  BottomSheetOptions,
  BottomSheetShowParams,
} from './types';

import { SCREEN_HEIGHT, MAX_TRANSLATE_Y } from './useBottomSheet';

const MAX_OPACITY = 0.8;

function renderContent({ options, config, show, hide }: BottomSheetUIProps) {
  const { type, props } = options;

  if (type) {
    const ModalComponent = config[type]!;
    return ModalComponent({ hide, props, show, type });
  }

  return null;
}

type BottomSheetUIProps = {
  options: BottomSheetOptions;
  config: BottomSheetConfig;
  show: (params: BottomSheetShowParams) => void;
  hide: (params: BottomSheetHideParams) => void;
};

const springConfig: SpringConfig = {
  duration: 1200,
  dampingRatio: 1,
  stiffness: 100,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

const BottomSheetUI = (props: BottomSheetUIProps) => {
  const {
    hide,
    options: { height, disableClose, customBackdrop },
  } = props;
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const backdrop = useSharedValue(0);

  const scrollTo = React.useCallback(
    (destination: number) => {
      'worklet';
      translateY.value = withSpring(destination, springConfig, () => {
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
      <TouchableWithoutFeedback
        onPress={() => {
          disableClose ? null : onHide();
        }}
      >
        {typeof customBackdrop === 'function' ? (
          customBackdrop()
        ) : (
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        )}
      </TouchableWithoutFeedback>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.container, animateStyle]}>
          <View style={styles.line} />
          <View style={[styles.content, { height: height }]}>
            {renderContent(props)}
          </View>
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
  content: {
    padding: 16,
  },
});

export default BottomSheetUI;
