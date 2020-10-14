import React, {useState} from 'react';
import Layout from "../components/Layout";
import MediaPlayerWrapper from "../components/MediaPlayerWrapper";
import VideoControlPanel from "./VideoControlPanel";

/**
 * Main video screen
 * @param props
 * @returns {*}
 * @constructor
 */
const VideoScreen = (props) => {
    const { navigation } = props;
    const [videoSource, setVideoSource] = useState(null);

    return (
        <Layout
            type={'video'}
            navigation={navigation}
            headerText={"Video"}
            onUploadPressed={file => setVideoSource(file)}
            viewContent={(
                <MediaPlayerWrapper
                    source={videoSource}
                />
            )}
            controlPanel={(
                <VideoControlPanel
                    navigation={navigation}
                    videoSource={videoSource}
                    setVideoSource={setVideoSource}
                />
            )}
        />
    );
};

export default VideoScreen;
