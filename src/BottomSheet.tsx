import React from 'react';
import BottomSheetUI from './BottomSheetUI';
import { type BottomSheetProps } from './types';
import { useBottomSheet } from './useBottomSheet';

export const BottomSheetRoot = React.forwardRef(
  ({ config, ...defaultOptions }: BottomSheetProps, ref) => {
    const { show, hide, options, visible } = useBottomSheet({ defaultOptions });

    // This must use useCallback to ensure the ref doesn't get set to null and then a new ref every render.
    React.useImperativeHandle(
      ref,
      React.useCallback(
        () => ({
          show,
          hide,
        }),
        [hide, show]
      )
    );

    return visible ? (
      <BottomSheetUI
        options={options}
        hide={hide}
        show={show}
        config={config}
      />
    ) : null;
  }
);

let refs: any[] = [];

/**
 * Adds a ref to the end of the array, which will be used to show the toasts until its ref becomes null.
 *
 * @param newRef the new ref, which must be stable for the life of the Toast instance.
 */
function addNewRef(newRef: any) {
  refs.push({
    current: newRef,
  });
}

/**
 * Removes the passed in ref from the file-level refs array using a strict equality check.
 *
 * @param oldRef the exact ref object to remove from the refs array.
 */
function removeOldRef(oldRef: any | null) {
  refs = refs.filter((r) => r.current !== oldRef);
}

/** WARN: VERY IMPORTANT should call hide method to close bottom sheet before navigate */
export const BottomSheet = (props: any) => {
  const modalRef = React.useRef<any | null>(null);

  const setRef = React.useCallback((ref: any | null) => {
    // Since we know there's a ref, we'll update `refs` to use it.
    if (ref) {
      // store the ref in this toast instance to be able to remove it from the array later when the ref becomes null.
      modalRef.current = ref;
      addNewRef(ref);
    } else {
      // remove the this toast's ref, wherever it is in the array.
      removeOldRef(modalRef.current);
    }
  }, []);

  return <BottomSheetRoot ref={setRef} {...props} />;
};

function getRef() {
  const reversePriority = [...refs].reverse();
  const activeRef = reversePriority.find((ref) => ref?.current !== null);
  if (!activeRef) {
    return null;
  }
  return activeRef.current;
}

BottomSheet.show = (params: any) => {
  getRef()?.show(params);
};

BottomSheet.hide = (params?: any) => {
  getRef()?.hide(params);
};
