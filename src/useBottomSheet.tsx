import React from 'react';
import { Dimensions } from 'react-native';

import { type BottomSheetOptions } from './types';
import { mergeIfDefined } from './utils';

const noop = () => undefined;

export const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

export const DEFAULT_OPTIONS: Required<any> = {
  type: undefined,
  onShow: noop,
  onHide: noop,
  height: MAX_TRANSLATE_Y,
  props: {},
};

export function useBottomSheet({
  defaultOptions = {},
}: {
  defaultOptions?: BottomSheetOptions;
}) {
  const initialOptions = mergeIfDefined(
    DEFAULT_OPTIONS,
    defaultOptions
  ) as Required<BottomSheetOptions>;

  const [options, setOptions] =
    React.useState<Required<BottomSheetOptions>>(initialOptions);
  const [visible, setVisible] = React.useState(false);

  const hide = React.useCallback(() => {
    setVisible(false);
    options.onHide();
  }, [options]);

  const show = React.useCallback(
    (params: BottomSheetOptions) => {
      const {
        type,
        height = initialOptions.height,
        disableClose = initialOptions.disableClose,
        scrollEnabled = initialOptions.scrollEnabled,
        customBackdrop = initialOptions.customBackdrop,
        onShow = initialOptions.onShow,
        onHide = initialOptions.onHide,
        props = initialOptions.props,
      } = params;

      setOptions(
        mergeIfDefined(initialOptions, {
          type,
          dismiss: hide,
          height,
          disableClose,
          customBackdrop,
          scrollEnabled,
          onShow,
          onHide,
          props,
        }) as Required<BottomSheetOptions>
      );
      setVisible(true);
      onShow();
    },
    [initialOptions, hide]
  );

  return { visible, hide, show, options };
}
