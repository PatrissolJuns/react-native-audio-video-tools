import React, {useState} from 'react';
import Layout from "../components/Layout";
import MediaPlayerWrapper from "../components/MediaPlayerWrapper";
import AudioControlPanel from "./AudioControlPanel";

/**
 * Main audio screen
 * @param props
 * @returns {*}
 * @constructor
 */
const AudioScreen = (props) => {
    const { navigation } = props;
    const [audioSource, setAudioSource] = useState(null);

    return (
        <Layout
            type={'audio'}
            navigation={navigation}
            headerText={"Audio"}
            onUploadPressed={file => setAudioSource(file)}
            viewContent={(
                <MediaPlayerWrapper
                    source={audioSource}
                />
            )}
            controlPanel={(
                <AudioControlPanel
                    navigation={navigation}
                    audioSource={audioSource}
                    setAudioSource={setAudioSource}
                />
            )}
        />
    );
};

export default AudioScreen;
