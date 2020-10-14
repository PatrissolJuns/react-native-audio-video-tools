import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from "react-native";
import {AudioTools} from 'react-native-audio-video-tools';

import toast from "../toast";
import {COLORS, ROUTES} from "../utils";
import {ProgressModal} from "../components/Modals";
import ControlPanelItem from "../components/ControlPanelItem";
import ConvertMediaOperation from "../Media/ConvertMediaOperation";
import MediaDetailsOperation from "../Media/MediaDetailsOperation";
import CompressMediaOperation from "../Media/CompressMediaOperation";
import AdjustVolumeOperation from "../Media/AdjustVolumeOperation";

/**
 * Set of controls button to handle various action on audio
 */
class AudioControlPanel extends Component {
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
            audioTools: new AudioTools(this.props.audioSource)
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Update internal audio tools variable when audio source has changed
        if (prevProps.audioSource !== this.props.audioSource) {
            this.state.audioTools.setMediaFullPath(this.props.audioSource);
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
        const inputFileStatus = await this.state.audioTools.isInputFileCorrect();

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

    render() {
        return (
            <>
                <View style={styles.container}>
                    <View style={styles.rowWrapper}>
                        <MediaDetailsOperation
                            type={'audio'}
                            mediaTools={this.state.audioTools}
                            progressModal={this.state.progressModal}
                            navigate={this.props.navigation.navigate}
                            updateProgressModal={this.updateProgressModal}
                            runIfInputFileCorrect={this.runIfInputFileCorrect}
                        />
                        <CompressMediaOperation
                            type={'audio'}
                            mediaTools={this.state.audioTools}
                            progressModal={this.state.progressModal}
                            navigate={this.props.navigation.navigate}
                            updateProgressModal={this.updateProgressModal}
                            runIfInputFileCorrect={this.runIfInputFileCorrect}
                        />
                        <ConvertMediaOperation
                            type={'audio'}
                            mediaTools={this.state.audioTools}
                            progressModal={this.state.progressModal}
                            navigate={this.props.navigation.navigate}
                            updateProgressModal={this.updateProgressModal}
                            runIfInputFileCorrect={this.runIfInputFileCorrect}
                        />
                        <AdjustVolumeOperation
                            type={'audio'}
                            mediaTools={this.state.audioTools}
                            progressModal={this.state.progressModal}
                            navigate={this.props.navigation.navigate}
                            updateProgressModal={this.updateProgressModal}
                            runIfInputFileCorrect={this.runIfInputFileCorrect}
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

AudioControlPanel.propTypes = {
    navigation: PropTypes.any,
    audioSource: PropTypes.any,
    setVideoSource: PropTypes.any,
};

export default AudioControlPanel;
