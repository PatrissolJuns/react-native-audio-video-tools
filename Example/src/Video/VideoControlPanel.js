import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {RNFFmpegConfig} from "react-native-ffmpeg";
import {StyleSheet, Text, View} from "react-native";
import {VideoTools} from 'react-native-audio-video-tools';

import toast from "../toast";
import {COLORS, ROUTES} from "../utils";
import {Modal, ProgressModal} from "../components/Modals";
import ControlPanelItem from "../components/ControlPanelItem";

/**
 * Set of controls button to handle various action on video
 */
class VideoControlPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCutModalVisible: false,
            isProgressModalVisible: false,
            progressModalText: 'Executing...',
            videoTools: new VideoTools(this.props.videoSource)
        };
    }

    componentDidMount() {
        // Enable logCallback to disable/enable log events
        const logCallback = (logData) => {
            // console.log("logData.log => ", logData.log);
        };
        RNFFmpegConfig.enableLogCallback(logCallback);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Update internal video tools variable when video source has changed
        if (prevProps.videoSource !== this.props.videoSource) {
            this.state.videoTools.setVideoPath(this.props.videoSource);
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
            this.setState({isProgressModalVisible: true});
            this.state.videoTools.getDetails()
                .then(details => {
                    this.props.navigation.navigate(ROUTES.RESULT, {
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
                .finally(() => this.setState({isProgressModalVisible: false}));
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
                        <ControlPanelItem
                            bgColor={COLORS.Jade}
                            text={"Compress Video"}
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
                        text={this.state.progressModalText}
                        isVisible={this.state.isProgressModalVisible}
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
