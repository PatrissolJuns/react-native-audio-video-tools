import React, {useState, useEffect} from 'react';
import {RNFFmpegConfig} from "react-native-ffmpeg";
import {StyleSheet, Text, View} from "react-native";
import {VideoTools} from 'react-native-audio-video-tools';

import toast from "../toast";
import {COLORS, ROUTES} from "../utils";
import {Modal, ProgressModal} from "../components/Modals";
import ControlPanelItem from "../components/ControlPanelItem";


/**
 * Set of controls button to handle various action on video
 * @param navigation
 * @param videoSource
 * @param setVideoSource
 * @returns {*}
 * @constructor
 */
const VideoControlPanel = ({navigation, videoSource, setVideoSource}) => {
    // Initializing VideoTools only once
    const [videoTools, setVideoTools] = useState(new VideoTools(videoSource));

    const [isCutModalVisible, setIsCutModalVisible] = useState(false);
    const [isProgressModalVisible, setIsProgressModalVisible] = useState(false);
    const [progressModalText, setProgressModalText] = useState("Executing...");

    /**
     * Update internal video tools variable when video source has changed
     */
    useEffect(() => {
        videoTools.setVideoPath(videoSource);
    }, [videoSource]);

    /**
     * Enable logCallback to disable/enable log events
     */
    useEffect(() => {
        const logCallback = (logData) => {
            // console.log("logData.log => ", logData.log);
        };
        RNFFmpegConfig.enableLogCallback(logCallback);
    }, []);

    /**
     * Run a command only when the input path is correct
     * otherwise display an error message
     * @param callback
     * @returns {*}
     */
    const runIfInputFileCorrect = (callback) => {
        const inputFileStatus = videoTools.isInputFileCorrect();
        if (inputFileStatus.isCorrect) {
            return callback();
        }
        toast.error(inputFileStatus.message);
        // toastRef.current.show(inputFileStatus.message);
    };


    /**
     * Get details of current video
     */
    const onVideoDetailsPressed = () => {
        runIfInputFileCorrect(() => {
            setIsProgressModalVisible(true);
            videoTools.getDetails()
                .then(details => {
                    navigation.navigate(ROUTES.RESULT, {
                        content: {
                            url: '',
                            details: details,
                        },
                        type: 'text'
                    });
                })
                .catch(error => {
                    toast.error(error.toString());
                })
                .finally(() => setIsProgressModalVisible(false));
        });
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.rowWrapper}>
                    <ControlPanelItem
                        text={"Video details"}
                        bgColor={COLORS["Coral Red"]}
                        onPress={onVideoDetailsPressed}
                    />
                    <ControlPanelItem
                        bgColor={COLORS.Jade}
                        text={"Compress Video"}
                        onPress={() => {
                            setIsCutModalVisible(true)
                        }}
                    />
                    <ControlPanelItem
                        bgColor={COLORS.Haiti}
                        text={"Cut Video"}
                    />
                    <ControlPanelItem
                        bgColor={COLORS["Medium Slate Blue"]}
                        text={"Extract Audio"}
                    />
                </View>
                {/*<View style={[styles.rowWrapper]}>
                    <ControlPanelItem
                        bgColor={COLORS.Purple}
                        text={"Extract images"}
                    />
                    <ControlPanelItem
                        bgColor={COLORS.Gamboge}
                        text={"Fast Motion"}
                    />
                    <ControlPanelItem
                        bgColor={COLORS.Haiti}
                        text={"Cut Video"}
                    />
                    <TouchableOpacity
                        style={[styles.btnItem, {backgroundColor: COLORS["Summer Sky"]}]}
                    >
                        <Text style={styles.text}>
                            Slow Motion
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnItem, {backgroundColor: COLORS.Persimmon}]}
                    >
                        <Text style={styles.text}>
                            Add Fade-in
                        </Text>
                    </TouchableOpacity>
                </View>*/}
                <Modal
                    text={"Loading..."}
                    isVisible={isCutModalVisible}
                    rightText={"Ok"}
                    leftText={"Cancel"}
                    onLeftClick={() => {

                    }}
                    onCloseClick={() => setIsCutModalVisible(false)}
                    onRightClick={() => {

                    }}
                    content={(
                        <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet at, eveniet, excepturi fugiat laudantium</Text>
                    )}
                />
                <ProgressModal text={progressModalText} isVisible={isProgressModalVisible} />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        // alignContent: 'stretch'
        justifyContent: 'flex-end',
        // backgroundColor: 'black'
    },
    rowWrapper: {
        width: '100%',
        flexDirection: 'row',
        // alignItems: 'stretch',
        // flexWrap: 'wrap',
    },
});

export default VideoControlPanel;
