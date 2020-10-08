import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RNFS from "react-native-fs";
import {StyleSheet, Text, View} from "react-native";

import toast from "../toast";
import {CustomModal} from "../components/Modals";
import DropDownPicker from 'react-native-dropdown-picker';
import {COLORS, generatedFileName, ROUTES} from "../utils";
import ControlPanelItem from "../components/ControlPanelItem";
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

class ConvertMediaOperation extends Component {
    constructor(props) {
        super(props);
        this.outputFilePath = `file://${RNFS.DocumentDirectoryPath}/convert_video_${generatedFileName(this.props.videoTools)}`;

        this.state = {
            newExtension: this.props.type === 'video' ? ConvertToList.video.mp4 : ConvertToList.audio.mp3,
            isModalVisible: false
        }
    }

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
                outputPath: this.outputFilePath,
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
            .catch(error => toast.error(error ? error.toString() : error))
            .finally(() => {
                // Hide progress modal no matter the issue
                this.props.updateProgressModal({
                    isVisible: false,
                });
            });
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
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
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

ConvertMediaOperation.propTypes = {
    type: PropTypes.string,
    navigate: PropTypes.any,
    mediaTools: PropTypes.any,
    progressModal: PropTypes.any,
    updateProgressModal: PropTypes.any,
    runIfInputFileCorrect: PropTypes.func.isRequired,
};

export default ConvertMediaOperation;
