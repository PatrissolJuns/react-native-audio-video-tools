import React, {useState} from 'react';
import RNFetchBlob from "rn-fetch-blob";
import {StyleSheet, Text, View} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import DocumentPicker from 'react-native-document-picker';
import {Button, Header, Icon, Input} from "react-native-elements";

import toast from "../toast";
import {CustomModal} from "./Modals";
import {isValidUrl, PRIMARY_COLOR} from "../utils";

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
 * @param type
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
     * Select a file from picker and return its full path
     * @param type
     * @returns {Promise<void>}
     */
    const getFileFromPicker = async (type = 'video') => {
        let path;
        if (type === 'video') {
            try {
                const res = await ImagePicker.openPicker({mediaType: type});
                path = res.path;
            } catch (err) {return;}
        } else {
            // Pick a single file
            try {
                const res = await DocumentPicker.pick({
                    type: [DocumentPicker.types.audio],
                });

                // Create a file to content the selected file since the response is a content resolver
                const destinationFileFullPath = FS.dirs.CacheDir + '/' + res.name;
                await FS.cp(res.uri, destinationFileFullPath);

                path = 'file://' + destinationFileFullPath;
            } catch (err) {return;}
        }

        // Return the response path
        onUploadPressed(path);
        setIsSelectModalVisible(false);
    };


    const renderRightComponent = () => {
        return (
            <Button
                icon={
                    <Icon
                        name="video-library"
                        type="material"
                        size={15}
                        color="white"
                        style={{
                            marginLeft: 5
                        }}
                    />
                }
                iconRight
                title="Select"
                onPress={() => setIsSelectModalVisible(true)}
            />
        );
    };

    return (
        <>
            <Header
                leftComponent={{
                    icon: 'menu',
                    color: '#fff',
                    onPress: () => {
                        navigation.toggleDrawer();
                    }
                }}
                centerComponent={{ text: headerText, style: { color: '#fff' } }}
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
                onLeftClick={() => getFileFromPicker(type)}
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
