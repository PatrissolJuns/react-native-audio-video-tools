import React, {useState} from 'react';
import PropTypes from 'prop-types';
import RNFS from "react-native-fs";
import {Icon} from "react-native-elements";
import {StyleSheet, Text, View} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import {AudioTools, VideoTools} from 'react-native-audio-video-tools';

import toast from "../toast";
import {CustomModal} from "../components/Modals";
import {COLORS, generatedFileName, ROUTES} from "../utils";
import ControlPanelItem from "../components/ControlPanelItem";

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

const CompressMediaOperation = ({type, runIfInputFileCorrect, mediaTools, navigate, progressModal, updateProgressModal}) => {
    const MediaTools = type === 'video' ? VideoTools : AudioTools;
    const outputFilePath = `file://${RNFS.DocumentDirectoryPath}/compress_video_${generatedFileName(mediaTools)}`;

    const [speed, setSpeed] = useState(SpeedList.veryslow);
    const [quality, setQuality] = useState(QualityList.high);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showCompressOptions = () => {
        runIfInputFileCorrect(() => {
            if (type === 'video') {
                setIsModalVisible(true);
            } else {
                compressMedia();
            }
        });
    };

    const compressMedia = async () => {
        const options = {
            speed,
            quality,
            outputFilePath,
        };

        // Hide modal
        setIsModalVisible(false);

        // Display progress modal
        updateProgressModal({
            isVisible: true,
            btnText: 'Cancel',
            text: 'Compressing... This may take some time.',
            onBtnText: () => {
                MediaTools.cancel();
                // duplicate this action as work around because it seems as the command does not work well once
                MediaTools.cancel();
                updateProgressModal({
                    isVisible: false,
                });
            },
        });

        try {
            // Launch compression
            const result = await mediaTools.compress(options);

            updateProgressModal({
                btnText: null,
                text: 'Compressing Finished. Getting information about media...',
            });

            // Get different media details in order to show some statistics
            const compressedMediaTools = new MediaTools(result.outputFilePath);
            const mediaDetails = await mediaTools.getDetails();
            const newMediaDetails = await compressedMediaTools.getDetails();

            // redirect to result page
            navigate(ROUTES.RESULT, {
                content: {
                    mediaType: type,
                    newMediaType: type,
                    url: result.outputFilePath,
                    mediaDetails: mediaDetails,
                    newMediaDetails: newMediaDetails,
                },
                type: 'media'
            });
        } catch (e) {
            toast.error(error ? error.toString() : error);
        }

        // Hide progress modal no matter the issue
        updateProgressModal({
            isVisible: false,
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
                title={"Video Compression"}
                isVisible={isModalVisible}
                rightText={"Start"}
                leftText={"Cancel"}
                onLeftClick={() => setIsModalVisible(false)}
                onCloseClick={() => setIsModalVisible(false)}
                onRightClick={compressMedia}
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
                                The higher the speed, the less effective the compression is and
                                can in some cases lead to an <Text style={{fontWeight: 'bold'}}>opposite effect</Text>.
                            </Text>
                        </View>
                    </View>
                )}
            />
        </>
    );
};

CompressMediaOperation.propTypes = {
    type: PropTypes.string,
    navigate: PropTypes.any,
    mediaTools: PropTypes.any,
    progressModal: PropTypes.any,
    updateProgressModal: PropTypes.any,
    runIfInputFileCorrect: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    lisItemContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    infoText: {
        flex: 1,
        color: 'red',
        marginLeft: 10,
        flexWrap: 'wrap',
        fontStyle: 'italic',
    }
});

export default CompressMediaOperation;
