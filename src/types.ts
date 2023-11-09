export type BottomSheetOptions = {
  type?: string;
  /** @description it should percent of screen */
  height?: number;
  onShow?: () => void;
  onHide?: () => void;
  props?: any;
};

export type BottomSheetShowParams = BottomSheetOptions;

export type BottomSheetHideParams = void;

export type BottomSheetConfigParams<Props> = {
  type: string;
  visible: boolean;
  show: (params: BottomSheetShowParams) => void;
  hide: (params: BottomSheetHideParams) => void;
  props: Props;
};

export type BottomSheetConfig = {
  [key: string]: (params: BottomSheetConfigParams<any>) => React.ReactNode;
};

export type BottomSheetProps = { config: BottomSheetConfig };
