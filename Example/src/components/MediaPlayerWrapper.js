import React from 'react';
import MediaPlayer from "./MediaPlayer";
import {Text, StyleSheet, View} from "react-native";

/**
 * Main media player
 * @param source
 * @returns {*}
 * @constructor
 */
const MediaPlayerWrapper = ({source}) => {
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
                <MediaPlayer
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

MediaPlayerWrapper.propTypes = {
    // source: PropTypes.string.isRequired,
};

export default MediaPlayerWrapper;
