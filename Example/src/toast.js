import Toast from 'react-native-root-toast';

const toast =  {
    error(text, position = Toast.positions.TOP, callback = null) {
        let toast = Toast.show(text, {
            duration: Toast.durations.LONG,
            position: position,
            opacity: 1,
            shadow: true,
            animation: true,
            hideOnPress: true,
            backgroundColor: 'red',
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
        });
    }
};

export default toast;
