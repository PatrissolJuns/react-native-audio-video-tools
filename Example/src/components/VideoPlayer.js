import React, {useState} from 'react';
import Video from "react-native-video";
import {ProgressModal} from "./Modals";
import {Text, StyleSheet, View} from "react-native";

/**
 * Main media player
 * @param source
 * @param restPRops
 * @returns {*}
 * @constructor
 */
const VideoPlayer = ({source}) => {
    const [text, setText] = useState('Loading...');
    const [isVisible, setIsVisible] = useState(false);
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
                    onLoad={() => setIsVisible(false)}
                    onLoadStart={() => {
                        // Only show progress modal when dealing with remote media
                        if (path.includes('http'))
                            setIsVisible(true)
                    }}
                />
            )}
            <ProgressModal
                text={text}
                isVisible={isVisible}
            />
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
