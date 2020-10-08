import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RNFS from "react-native-fs";
import {StyleSheet, Text, View, Platform, PermissionsAndroid} from "react-native";

import {CustomModal} from "../components/Modals";
import DropDownPicker from 'react-native-dropdown-picker';
import ControlPanelItem from "../components/ControlPanelItem";
import {COLORS, generatedFileName, msToTime, ROUTES} from "../utils";
import {VideoTools, AudioTools} from "react-native-audio-video-tools";

const ConvertToList = {
    video: {
        'mp4': 'mp4',
        'mkv': 'mkv',
        'avi': 'avi',
    },
    audio: {
        'mp3': 'mp3',
        'm4a': 'm4a',
    }
};

class ConvertVideoOperation extends Component {
    constructor(props) {
        super(props);
        this.outputPath = `file://${RNFS.DocumentDirectoryPath}/convert_video_${generatedFileName(this.props.videoTools)}`;

        this.state = {
            newExtension: this.props.type === 'video' ? ConvertToList.video.mp4 : ConvertToList.audio.mp3,
            isModalVisible: false
        }
    }

    /*const compressVideo = () => {
            const options = {
                quality,
                speed,
                outputFilePath: path
            };

            // Hide modal
            setIsModalVisible(false);

            // Display progress modal
            updateProgressModal({
                isVisible: true,
                btnText: 'Cancel',
                text: 'Compressing...',
                onBtnText: () => {
                    VideoTools.cancel();
                    // duplicate this action as work around because it seems as the command does not work well once
                    VideoTools.cancel();
                    updateProgressModal({
                        isVisible: false,
                    });
                },
            });

            // Launch compression
            videoTools.compress(options)
                .then(async result => {
                    updateProgressModal({
                        text: 'Compressing Finished. Getting information about videos...',
                    });

                    // get different video details in order to show some statistics
                    const compressedVideoTools = new VideoTools(result.outputFilePath);
                    const mediaDetails = await videoTools.getDetails();
                    const newMediaDetails = await compressedVideoTools.getDetails();

                    // Hide progress modal
                    updateProgressModal({
                        isVisible: false,
                    });

                    // redirect to result page
                    navigate(ROUTES.RESULT, {
                        content: {
                            url: result.outputFilePath,
                            mediaDetails: mediaDetails,
                            newMediaDetails: newMediaDetails,
                        },
                        type: 'video'
                    });
                })
                .catch(error => {
                    console.log("error => ", error);
                });
        };*/

    showConvertOptions = () => {
        this.props.runIfInputFileCorrect(() => {
            this.setState({
                isModalVisible: true,
            });
        });
    };

    convertMedia = () => {
        // Hide modal
        this.setState({
            isModalVisible: false,
        });

        // Display progress modal
        this.props.updateProgressModal({
            isVisible: true,
            btnText: 'Cancel',
            text: 'Converting...',
            onBtnText: () => {
                const MediaTools = this.props.type === 'video' ? VideoTools : AudioTools;
                MediaTools.cancel();
                // duplicate this action as work around because it seems as the command does not work well once
                MediaTools.cancel();
                this.props.updateProgressModal({
                    isVisible: false,
                });
            },
        });

        this.props
            .mediaTools
            .convertTo({
                outputPath: this.outputPath,
                extension: this.state.newExtension,
            })
            .then(async result => {
                const compressedMediaTools = this.props.type === 'video'
                    ? new VideoTools(result.outputFilePath)
                    : new AudioTools(result.outputFilePath);

                const mediaDetails = await this.props.mediaTools.getDetails();
                const newMediaDetails = await compressedMediaTools.getDetails();

                // redirect to result page
                this.props.navigate(ROUTES.RESULT, {
                    content: {
                        mediaType: this.props.type,
                        newMediaType: this.props.type,
                        url: result.outputFilePath,
                        mediaDetails: mediaDetails,
                        newMediaDetails: newMediaDetails,
                    },
                    type: 'video'
                });
            })
            .catch(error => {
                console.log('error => ', error);
            })
            .finally(() => {
                // Hide progress modal no matter the issue
                this.props.updateProgressModal({
                    isVisible: false,
                });
            })
    };

    render() {
        return (
            <>
                <ControlPanelItem
                    bgColor={COLORS.Haiti}
                    text={`Convert ${this.props.type === 'video' ? 'Video' : 'Audio'}`}
                    onPress={this.showConvertOptions}
                />
                <CustomModal
                    title={`${this.props.type === 'video' ? 'Video' : 'Audio'} Converting`}
                    isVisible={this.state.isModalVisible}
                    rightText={"Start"}
                    leftText={"Cancel"}
                    onLeftClick={() => this.setState({isModalVisible: false})}
                    onCloseClick={() => this.setState({isModalVisible: false})}
                    onRightClick={this.convertMedia}
                    content={(
                        <View style={{}}>
                            <Text>Please select extension to convert to or leave default one</Text>
                            <View style={styles.lisItemContainer}>
                                <DropDownPicker
                                    items={Object.values(ConvertToList[this.props.type]).map(i => ({label: i, value: i}))}
                                    defaultValue={this.state.newExtension}
                                    containerStyle={{height: 40, flex: 0.7}}
                                    style={{backgroundColor: '#fafafa'}}
                                    itemStyle={{justifyContent: 'flex-start'}}
                                    dropDownStyle={{backgroundColor: '#fafafa'}}
                                    onChangeItem={item => this.setState({newExtension: item.value})}
                                />
                            </View>
                        </View>
                    )}
                />
            </>
        );
    }
}

const styles = StyleSheet.create({
    lisItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        // width: '100%'
        justifyContent: 'center',
    },
    infoText: {
        flex: 1,
        marginLeft: 10,
        flexWrap: 'wrap',
        fontStyle: 'italic'
    },
    video: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

ConvertVideoOperation.propTypes = {
    type: PropTypes.string,
    navigate: PropTypes.any,
    mediaTools: PropTypes.any,
    progressModal: PropTypes.any,
    updateProgressModal: PropTypes.any,
    runIfInputFileCorrect: PropTypes.func.isRequired,
};

export default ConvertVideoOperation;
