import React, {useState} from 'react';
import RNFetchBlob from "rn-fetch-blob";
import DocumentPicker from 'react-native-document-picker';
import {Button, Header, Icon, Input} from "react-native-elements";
import {PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import toast from "../toast";
import {CustomModal} from "./Modals";
import {askPermission, COLORS, isValidUrl, PRIMARY_COLOR} from "../utils";

const FS = RNFetchBlob.fs;
const DEFAULT_REMOTE_VIDEO_URL = "http://techslides.com/demos/sample-videos/small.mp4";
const DEFAULT_REMOTE_AUDIO_URL = "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3";

/**
 * Layout of screens
 * @param navigation
 * @param viewContent
 * @param controlPanel
 * @param headerText
 * @param onUploadPressed
 * @param type 'audio' | 'video'
 * @returns {*}
 * @constructor
 */
const Layout = ({navigation, viewContent, controlPanel, headerText, onUploadPressed, type}) => {
    const [remoteUrl, setRemoteUrl] = useState('');
    const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);
    const [isUrlInputModalVisible, setIsUrlInputModalVisible] = useState(false);

    // Get default remote media url to use
    const defaultRemoteMediaUrl = type === 'audio'
        ? DEFAULT_REMOTE_AUDIO_URL
        : DEFAULT_REMOTE_VIDEO_URL;

    /**
     * Display url modal
     */
    const getFileFromUrl = () => {
        setIsUrlInputModalVisible(true);
        setIsSelectModalVisible(false);
    };

    /**
     * Handle remote url button press action
     * @param action
     */
    const onRemoteUrlBtnAction = (action) => {
        if (action === 'Ok') {
            if (isValidUrl(remoteUrl)) {
                onUploadPressed(remoteUrl);
                setIsUrlInputModalVisible(false);
                setRemoteUrl('');
            }
            else toast.error("Please enter a valid url");
        } else {
            setIsSelectModalVisible(true);
            setIsUrlInputModalVisible(false);
        }
    };

    /**
     * Ask permission to perform operation on file file
     * @returns {Promise<null|boolean>}
     */
    const isFilePermissionGranted = async () => {
        try {
            const readPermission = await askPermission(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                "RNAudioVideoTools App Read Permission",
                "In order to save your media, We need permission to access your phone folder"
            );
            const writePermission = await askPermission(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                "RNAudioVideoTools App Write Permission",
                "In order to save your media, We need permission to access your phone folder"
            );
            return readPermission === PermissionsAndroid.RESULTS.GRANTED
                && writePermission === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            return null;
        }
    };

    /**
     * Select a file from picker and return its full path
     * @returns {Promise<void>}
     */
    const getFileFromPicker = async () => {
        try {

            // Ask permission to access file
            const _isFilePermissionGranted = await isFilePermissionGranted();

            // The following line is NOT a mistake
            if (_isFilePermissionGranted === false) {
                toast.error("You need to grant permission in order to continue");
                return;
            } else if (_isFilePermissionGranted === null) {
                toast.error("An error occur asking permission. Please try again later");
                return;
            }

            // Pick a single file
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types[type]],
            });

            // Get information about file in order to have its full path
            const result = await FS.stat(res.uri);

            // Remove ending "/" if present
            const path = result.path[result.path.length - 1] === '/'
                ? result.path.substring(0, result.path.length - 1) : result.path;

            // Prepend file protocol in order to be compatible with RNAudioVideoTools
            const destinationFileFullPath = 'file://' + path;

            // Return the response path
            onUploadPressed(destinationFileFullPath);
            setIsSelectModalVisible(false);
        } catch (err) {}
    };

    /**
     * Left component on header
     * @returns {*}
     */
    const renderLeftComponent = () => {
        return (
            <TouchableOpacity
                onPress={() => navigation.toggleDrawer()}
                hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
            >
                <Icon
                    name='menu'
                    color={COLORS.White}
                />
            </TouchableOpacity>
        );
    };

    /**
     * Right component on header
     * @returns {*}
     */
    const renderRightComponent = () => {
        return (
            <Button
                iconRight
                title="Select"
                icon={
                    <Icon
                        name="video-library"
                        type="material"
                        size={15}
                        color={COLORS.White}
                        style={{marginLeft: 5}}
                    />
                }
                onPress={() => setIsSelectModalVisible(true)}
            />
        );
    };

    return (
        <>
            <Header
                leftComponent={renderLeftComponent()}
                centerComponent={{ text: headerText, style: { color: COLORS.White, fontSize: 18 } }}
                rightComponent={renderRightComponent()}
            />
            <View style={styles.container}>
                <View style={styles.viewContent}>
                    {viewContent}
                </View>
                <View style={styles.middleContent} />
                <View style={styles.controlPanel}>
                    {controlPanel}
                </View>
            </View>
            <CustomModal
                title={"Choose a file"}
                isVisible={isSelectModalVisible}
                leftText={"From phone"}
                rightText={"From url"}
                onLeftClick={() => getFileFromPicker()}
                onRightClick={() => getFileFromUrl()}
                onCloseClick={() => setIsSelectModalVisible(false)}
                content={(
                    <Text style={{textAlign: 'center'}}>{`Please select ${type === 'audio' ? 'an audio' : 'a video'} file...`}</Text>
                )}
            />
            <CustomModal
                title={"Url"}
                isVisible={isUrlInputModalVisible}
                leftText={"Back"}
                rightText={"Ok"}
                onLeftClick={() => onRemoteUrlBtnAction('Cancel')}
                onRightClick={() => onRemoteUrlBtnAction('Ok')}
                onCloseClick={() => onRemoteUrlBtnAction('Cancel')}
                content={(
                    <View>
                        <Text>Please enter a remote url.</Text>
                        <Text>Example:
                            <Text
                                style={{color: PRIMARY_COLOR}}
                                onPress={() => setRemoteUrl(defaultRemoteMediaUrl)}
                            >
                                {' ' + defaultRemoteMediaUrl}
                            </Text>
                        </Text>
                        <Input
                            value={remoteUrl}
                            placeholder='url...'
                            onChangeText={setRemoteUrl}
                            containerStyle={{marginTop: 5}}
                        />
                    </View>
                )}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewContent: {
        flex: 0.5
    },
    middleContent: {
        flex: 0.2
    },
    controlPanel: {
        flex: 0.3
    }
});

export default Layout;
