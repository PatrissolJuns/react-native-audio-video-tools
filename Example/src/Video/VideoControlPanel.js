import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from "react-native";
import {VideoTools, AudioTools} from 'react-native-audio-video-tools';

import toast from "../toast";
import {COLORS, ROUTES} from "../utils";
import {ProgressModal} from "../components/Modals";
import ControlPanelItem from "../components/ControlPanelItem";
import ConvertMediaOperation from "../Media/ConvertMediaOperation";
import MediaDetailsOperation from "../Media/MediaDetailsOperation";
import CompressMediaOperation from "../Media/CompressMediaOperation";

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
    runIfInputFileCorrect = async (callback) => {
        // Display progress modal
        this.updateProgressModal({
            btnText: null,
            isVisible: true,
            text: 'Checking input file...'
        });

        // Start checking input file
        const inputFileStatus = await this.state.videoTools.isInputFileCorrect();

        // If everything went fine
        if (inputFileStatus.isCorrect) {
            this.updateProgressModal({isVisible: false});
            return callback();
        }

        // Otherwise
        toast.error(inputFileStatus.message);
        this.updateProgressModal({isVisible: false});
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

    /**
     * Extract an audio from a video
     */
    onExtractAudioPressed = () => {
        this.runIfInputFileCorrect(() => {
            // Display progress modal
            this.updateProgressModal({
                btnText: null,
                isVisible: true,
                text: 'Extracting audio...',
            });

            // Perform extracting...
            this.state.videoTools.extractAudio()
                .then(async result => {
                    // Get different video details in order to show some statistics
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
                        type: 'media',
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
                        <MediaDetailsOperation
                            type={'video'}
                            mediaTools={this.state.videoTools}
                            progressModal={this.state.progressModal}
                            navigate={this.props.navigation.navigate}
                            updateProgressModal={this.updateProgressModal}
                            runIfInputFileCorrect={this.runIfInputFileCorrect}
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
