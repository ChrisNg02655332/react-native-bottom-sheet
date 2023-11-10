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
  visible: boolean;
  show: (params: BottomSheetShowParams) => void;
  hide: (params: BottomSheetHideParams) => void;
};

const BottomSheetUI = (props: BottomSheetUIProps) => {
  const {
    hide,
    visible,
    options: { height, disableClose, customBackdrop },
  } = props;
  const [state, setState] = React.useState(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const backdrop = useSharedValue(0);

  const scrollTo = React.useCallback(
    (destination: number) => {
      'worklet';
      if (destination < 0) {
        runOnJS(setState)(destination);
      } else {
        backdrop.value = withTiming(0, {}, () => {
          runOnJS(setState)(destination);
          if (destination === 0) {
            runOnJS(hide)();
          }
        });
      }
      translateY.value = withSpring(destination, {
        duration: 1500,
        dampingRatio: 0.7,
      });
    },
    [translateY, hide, backdrop]
  );

  const onHide = React.useCallback(() => {
    scrollTo(0);
  }, [scrollTo]);

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
    if (visible) {
      scrollTo(-Math.abs(height!));
      backdrop.value = withTiming(MAX_OPACITY);
    }
  }, [height, scrollTo, backdrop, visible]);

  React.useEffect(() => {
    if (!visible && state < 0) {
      onHide();
    }
  }, [visible, state, onHide]);

  if (state === 0) return null;

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
          <View style={{ height: height }}>{renderContent(props)}</View>
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
