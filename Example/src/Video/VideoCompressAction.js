import React, {useState} from 'react';
import PropTypes from 'prop-types';
import RNFS from "react-native-fs";
import {Icon} from "react-native-elements";
import DropDownPicker from 'react-native-dropdown-picker';
import {VideoTools} from 'react-native-audio-video-tools';
import {StyleSheet, Text, View, Platform, PermissionsAndroid} from "react-native";

import {CustomModal} from "../components/Modals";
import ControlPanelItem from "../components/ControlPanelItem";
import {COLORS, getExtensionFromVideoTools, ROUTES} from "../utils";

const QualityList = {low: 'low', medium: 'medium', high: 'high'};
const SpeedList = {
    veryslow: 'veryslow',
    slower: 'slower',
    slow: 'slow',
    medium: 'medium',
    fast: 'fast',
    faster: 'faster',
    veryfast: 'veryfast',
    superfast: 'superfast',
    ultrafast: 'ultrafast'
};

const generatedFileName = videoTools => `/compress_video_${Date.now().toString()}.${getExtensionFromVideoTools(videoTools)}`;

const requestWritePermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "RNAudioVideoTools App Write Permission",
                message:
                    "In order to save media, you need to give us permission to write to your file",
                buttonNegative: "Deny",
                buttonPositive: "Allow"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the camera");
        } else {
            console.log("Camera permission denied");
        }
    } catch (err) {
        console.warn(err);
    }
};

const VideoCompressAction = ({runIfInputFileCorrect, videoTools, navigate, progressModal, updateProgressModal}) => {
    const path = 'file://' + RNFS.DocumentDirectoryPath + generatedFileName(videoTools);
    const [quality, setQuality] = useState(QualityList.high);
    const [speed, setSpeed] = useState(SpeedList.veryslow);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showCompressOptions = () => {
        runIfInputFileCorrect(() => {
            setIsModalVisible(true)
        });
    };

    const compressVideo = () => {
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
    };

    return (
        <>
            <ControlPanelItem
                bgColor={COLORS.Jade}
                text={"Compress Video"}
                onPress={showCompressOptions}
            />
            <CustomModal
                isVisible={isModalVisible}
                rightText={"Start"}
                leftText={"Cancel"}
                onLeftClick={() => setIsModalVisible(false)}
                onCloseClick={() => setIsModalVisible(false)}
                onRightClick={compressVideo}
                content={(
                    <View style={{}}>
                        <Text>Please select options or leave default one</Text>
                        <View style={styles.lisItemContainer}>
                            <Text style={{fontWeight: 'bold',}}>Quality:</Text>
                            <DropDownPicker
                                items={Object.values(QualityList).map(i => ({label: i, value: i}))}
                                defaultValue={quality}
                                containerStyle={{height: 40, flex: 0.7}}
                                style={{backgroundColor: '#fafafa'}}
                                itemStyle={{justifyContent: 'flex-start'}}
                                dropDownStyle={{backgroundColor: '#fafafa'}}
                                onChangeItem={item => setQuality(item.value)}
                            />
                        </View>
                        <View style={styles.lisItemContainer}>
                            <Text style={{fontWeight: 'bold',}}>Speed:</Text>
                            <DropDownPicker
                                items={Object.values(SpeedList).map(i => ({label: i, value: i}))}
                                defaultValue={speed}
                                containerStyle={{height: 40, flex: 0.7}}
                                style={{backgroundColor: '#fafafa'}}
                                itemStyle={{justifyContent: 'flex-start'}}
                                dropDownStyle={{backgroundColor: '#fafafa'}}
                                onChangeItem={item => setSpeed(item.value)}
                            />
                        </View>
                        <View style={styles.lisItemContainer}>
                            <Icon name={'info-circle'} type="font-awesome-5"/>
                            <Text style={styles.infoText}>
                                The higher the speed, the less effective the compression is and can in some cases lead to an opposite effect.
                            </Text>
                        </View>
                    </View>
                )}
            />
        </>
    );
};

VideoCompressAction.propTypes = {

};

const styles = StyleSheet.create({
    lisItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        // width: '100%'
        justifyContent: 'space-between',
    },
    infoText: {
        flex: 1,
        marginLeft: 10,
        flexWrap: 'wrap',
        fontStyle: 'italic'
    }
});

export default VideoCompressAction;
