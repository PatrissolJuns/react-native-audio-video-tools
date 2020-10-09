import Toast from 'react-native-root-toast';

/**
 * Toast default options
 * @param backgroundColor
 * @param position
 * @param callback
 * @returns {{duration: number, backgroundColor: *, delay: number, onShow: onShow, shadow: boolean, onShown: onShown, hideOnPress: boolean, onHidden: onHidden, position: number, onHide: onHide, opacity: number, animation: boolean}}
 */
const defaultOptions = (backgroundColor, position = Toast.positions.TOP, callback = null) => {
  return {
      duration: Toast.durations.LONG,
      position: position,
      opacity: 1,
      shadow: true,
      animation: true,
      hideOnPress: true,
      backgroundColor: backgroundColor,
      delay: 0,
      onShow: () => {
          // calls on toast\`s appear animation start
      },
      onShown: () => {
          // calls on toast\`s appear animation end.
      },
      onHide: () => {
          // calls on toast\`s hide animation start.
      },
      onHidden: () => {
          if (callback) callback();
      }
  };
};

/**
 * Custom toast
 * @type {{success(*=, *=, *=): void, warning(*=, *=, *=): void, error(*=, *=, *=): void}}
 */
const toast = {
    error(text, position = Toast.positions.BOTTOM, callback = null) {
        Toast.show(text, defaultOptions('red', position, callback));
    },
    success(text, position = Toast.positions.BOTTOM, callback = null) {
        Toast.show(text, defaultOptions('green', position, callback));
    },
    warning(text, position = Toast.positions.BOTTOM, callback = null) {
        Toast.show(text, defaultOptions('yellow', position, callback));
    },
};

export default toast;
