import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from "react-native";
import {VideoTools, AudioTools} from "react-native-audio-video-tools";

import toast from "../toast";
import {CustomModal} from "../components/Modals";
import DropDownPicker from 'react-native-dropdown-picker';
import ControlPanelItem from "../components/ControlPanelItem";
import {COLORS, generatedFileName, getBaseFilename, ROUTES} from "../utils";

/**
 * Adjust the volume of an audio
 */
class AdjustVolumeOperation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalVisible: false,
            action: Action.increase
        }
    }

    handleOnAdjustVolume = () => {
        this.props.runIfInputFileCorrect(() => {
            this.setState({
                isModalVisible: true,
            });
        });
    };

    adjustVolume = async () => {
        // Hide modal
        this.setState({
            isModalVisible: false,
        });

        // Display progress modal
        this.props.updateProgressModal({
            isVisible: true,
            btnText: 'Cancel',
            text: 'Executing...',
            onBtnText: () => {
                const MediaTools = this.props.type === 'audio' ? AudioTools : VideoTools;
                MediaTools.cancel();
                // duplicate this action as work around because it seems as the command does not work well once
                MediaTools.cancel();
                this.props.updateProgressModal({
                    isVisible: false,
                });
            },
        });

        const outputFilePath = `${getBaseFilename()}/adjusted_volume_${this.props.type}_${await generatedFileName(this.props.videoTools, this.props.type)}`;

        const rate = this.state.action === Action.increase ? 1.5 : 0.5;

        this.props
            .mediaTools
            .adjustVolume({
                rate,
                outputFilePath,
            })
            .then(async result => {
                const compressedMediaTools = this.props.type === 'audio'
                    ? new AudioTools(result.outputFilePath)
                    : new VideoTools(result.outputFilePath);

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
                    type: 'media'
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
        const media = this.props.type === 'audio' ? 'Audio' : 'Video';
        return (
            <>
                <ControlPanelItem
                    bgColor={COLORS["Medium Slate Blue"]}
                    text={`Adjust Volume`}
                    onPress={this.handleOnAdjustVolume}
                />
                <CustomModal
                    title={`${media} volume adjusting`}
                    isVisible={this.state.isModalVisible}
                    rightText={"Start"}
                    leftText={"Cancel"}
                    onLeftClick={() => this.setState({isModalVisible: false})}
                    onCloseClick={() => this.setState({isModalVisible: false})}
                    onRightClick={this.adjustVolume}
                    content={(
                        <View style={{}}>
                            <Text>Please select action to perform or leave default one</Text>
                            <View style={styles.lisItemContainer}>
                                <DropDownPicker
                                    items={Object.values(Action).map(i => ({label: i, value: i}))}
                                    defaultValue={this.state.action}
                                    containerStyle={{height: 40, flex: 0.7}}
                                    style={{backgroundColor: '#fafafa'}}
                                    itemStyle={{justifyContent: 'flex-start'}}
                                    dropDownStyle={{backgroundColor: '#fafafa'}}
                                    onChangeItem={item => this.setState({action: item.value})}
                                />
                            </View>
                        </View>
                    )}
                />
            </>
        );
    }
}

const Action = {
    'increase': 'Increase',
    'decrease': 'Decrease',
};

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

AdjustVolumeOperation.propTypes = {
    type: PropTypes.string,
    navigate: PropTypes.any,
    mediaTools: PropTypes.any,
    progressModal: PropTypes.any,
    updateProgressModal: PropTypes.any,
    runIfInputFileCorrect: PropTypes.func.isRequired,
};

export default AdjustVolumeOperation;
