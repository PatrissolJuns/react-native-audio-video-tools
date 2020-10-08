import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from "react-native";
import {VideoTools, AudioTools} from 'react-native-audio-video-tools';

import toast from "../toast";
import {COLORS, ROUTES} from "../utils";
import {ProgressModal} from "../components/Modals";
import ConvertMediaOperation from "./ConvertMediaOperation";
import CompressMediaOperation from "./CompressMediaOperation";
import ControlPanelItem from "../components/ControlPanelItem";

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
                .catch(error => toast.error(error ? error.toString() : error))
                .finally(() => this.updateProgressModal({isVisible: false}));
        });
    };

    render() {
        return (
            <>
                <View style={styles.container}>
                    <View style={styles.rowWrapper}>
                        <ControlPanelItem
                            text={"Video details"}
                            bgColor={COLORS["Coral Red"]}
                            onPress={this.onVideoDetailsPressed}
                        />
                        <CompressMediaOperation
                            type={'video'}
                            mediaTools={this.state.videoTools}
                            progressModal={this.state.progressModal}
                            navigate={this.props.navigation.navigate}
                            updateProgressModal={this.updateProgressModal}
                            runIfInputFileCorrect={this.runIfInputFileCorrect}
                        />
                        <ConvertMediaOperation
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
        justifyContent: 'flex-end',
    },
    rowWrapper: {
        width: '100%',
        flexDirection: 'row',
    },
});

VideoControlPanel.propTypes = {
    navigation: PropTypes.any,
    videoSource: PropTypes.any,
    setVideoSource: PropTypes.any,
};

export default VideoControlPanel;
