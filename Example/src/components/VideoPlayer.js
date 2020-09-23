import React from 'react';
import Video from "react-native-video";
import {Text, StyleSheet, View} from "react-native";

const VideoPlayer = ({source, ...restPRops}) => {
    const path = source
        ? source.path ? source.path : source
        : null;

    return (
        <>
            {path === null ? (
                <View style={styles.emptyContent}>
                    <Text>
                        Please first select a file
                    </Text>
                </View>
            ) : (
                <Video
                    controls
                    source={{uri: path}}
                    resizeMode={'cover'}
                    style={styles.video}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    video: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

VideoPlayer.propTypes = {
    // source: PropTypes.string.isRequired,
};

export default VideoPlayer;
