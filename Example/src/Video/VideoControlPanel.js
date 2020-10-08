import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from "react-native";
import {VideoTools, AudioTools} from 'react-native-audio-video-tools';

import toast from "../toast";
import {COLORS, ROUTES} from "../utils";
import {CustomModal, ProgressModal} from "../components/Modals";
import ControlPanelItem from "../components/ControlPanelItem";
import VideoCompressOperation from "./VideoCompressOperation";
import VideoCutOperation from "./VideoCutOperation";
import ConvertVideoOperation from "./ConvertVideoOperation";

/**
 * Set of controls button to handle various action on video
 */
class VideoControlPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCutModalVisible: false,
            progressModal: {
                text: 'Executing...',
                btnText: null,
                isVisible: false,
                onBtnText: () => null
            },
            videoTools: new VideoTools(this.props.videoSource)
        };
    }

    componentDidMount() {
        // Enable logCallback to disable/enable log events
        const logCallback = (logData) => {
            // console.log("logData.log => ", logData.log);
        };
        // RNFFmpegConfig.enableLogCallback(logCallback);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Update internal video tools variable when video source has changed
        if (prevProps.videoSource !== this.props.videoSource) {
            this.state.videoTools.setMediaFullPath(this.props.videoSource);
        }
    }

    /**
     * Run a command only when the input path is correct
     * otherwise display an error message
     * @param callback function to execute
     * @returns {*}
     */
    runIfInputFileCorrect = (callback) => {
        const inputFileStatus = this.state.videoTools.isInputFileCorrect();
        if (inputFileStatus.isCorrect) {
            return callback();
        }
        toast.error(inputFileStatus.message);
        // toastRef.current.show(inputFileStatus.message);
    };

    /**
     * Get details of current video
     */
    onVideoDetailsPressed = () => {
        this.runIfInputFileCorrect(() => {
            this.updateProgressModal({isVisible: true});
            this.state.videoTools.getDetails()
                .then(details => {
                    this.props.navigation.navigate(ROUTES.RESULT, {
                        content: {
                            url: '',
                            mediaType: 'video',
                            mediaDetails: details,
                        },
                        type: 'text'
                    });
                })
                .catch(error => {
                    toast.error(error.toString());
                })
                .finally(() => this.updateProgressModal({isVisible: false}));
        });
    };

    /**
     * Update progress modal state
     */
    updateProgressModal = (object) => this.setState(prevState => ({
        progressModal: {
            ...prevState.progressModal,
            ...object
        }
    }));

    onExtractAudioPressed = () => {
        this.runIfInputFileCorrect(() => {
            this.updateProgressModal({isVisible: true});
            this.state.videoTools.extractAudio()
                .then(async result => {
                    // get different video details in order to show some statistics
                    const compressedVideoTools = new AudioTools(result.outputFilePath);
                    const mediaDetails = await this.state.videoTools.getDetails();
                    const newMediaDetails = await compressedVideoTools.getDetails();

                    this.props.navigation.navigate(ROUTES.RESULT, {
                        content: {
                            mediaType: 'video',
                            newMediaType: 'audio',
                            url: result.outputFilePath,
                            mediaDetails: mediaDetails,
                            newMediaDetails: newMediaDetails,
                        },
                        type: 'video',
                    });
                })
                .catch(error => {
                    console.log("error => ", error);
                    toast.error(error ? error.toString() : error);
                })
                .finally(() => this.updateProgressModal({isVisible: false}));
        });
    };

    test = () => {

        /*let c = `-i "file:///data/user/0/com.rnaudiovideotools/cache/react-native-image-crop-picker/Koc3.mp4" "file:///data/user/0/com.rnaudiovideotools/cache/3cd9677c-d0a3-424b-99a7-d9513fa91d0f.mp3"`;
        console.log('c => ', c);
        RNFFmpeg.execute(c)
            .then(result => {
                console.log('result => ', result);
            })
            .catch(error => {
                console.log('error => ', error);
            });*/
    };

    render() {
        console.log("Au => ", AudioTools);
        return (
            <>
                <View style={styles.container}>
                    <View style={styles.rowWrapper}>
                        <ControlPanelItem
                            text={"Video details"}
                            bgColor={COLORS["Coral Red"]}
                            onPress={this.onVideoDetailsPressed}
                        />
                        <VideoCompressOperation
                            videoTools={this.state.videoTools}
                            progressModal={this.state.progressModal}
                            navigate={this.props.navigation.navigate}
                            updateProgressModal={this.updateProgressModal}
                            runIfInputFileCorrect={this.runIfInputFileCorrect}
                        />
                        <ConvertVideoOperation
                            type={'video'}
                            mediaTools={this.state.videoTools}
                            progressModal={this.state.progressModal}
                            navigate={this.props.navigation.navigate}
                            updateProgressModal={this.updateProgressModal}
                            runIfInputFileCorrect={this.runIfInputFileCorrect}
                        />
                        <ControlPanelItem
                            text={"Extract Audio"}
                            onPress={this.onExtractAudioPressed}
                            bgColor={COLORS["Medium Slate Blue"]}
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
                    <CustomModal
                        title={"Video Compression"}
                        text={"Loading..."}
                        isVisible={this.state.isCutModalVisible}
                        rightText={"Ok"}
                        leftText={"Cancel"}
                        onLeftClick={() => {

                        }}
                        onCloseClick={() => this.setState({isCutModalVisible: false})}
                        onRightClick={() => {

                        }}
                        content={(
                            <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet at, eveniet, excepturi fugiat laudantium</Text>
                        )}
                    />

                    <ProgressModal
                        text={this.state.progressModal.text}
                        btnText={this.state.progressModal.btnText}
                        isVisible={this.state.progressModal.isVisible}
                        onBtnPress={this.state.progressModal.onBtnText}
                    />
                </View>
            </>
        );
    }
}

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

VideoControlPanel.propTypes = {
    navigation: PropTypes.any,
    videoSource: PropTypes.any,
    setVideoSource: PropTypes.any,
};

export default VideoControlPanel;
