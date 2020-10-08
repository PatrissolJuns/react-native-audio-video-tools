import React, {useState} from 'react';
import {StyleSheet, Text, View} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import {Button, Header, Icon, Input} from "react-native-elements";

import toast from "../toast";
import {CustomModal} from "./Modals";
import {PRIMARY_COLOR} from "../utils";

const Layout = ({navigation, viewContent, controlPanel, headerText, onUploadPressed, type}) => {
    const [remoteUrl, setRemoteUrl] = useState('');
    const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);
    const [isUrlInputModalVisible, setIsUrlInputModalVisible] = useState(false);

    const getFileFromUrl = () => {
        setIsUrlInputModalVisible(true);
        setIsSelectModalVisible(false);
    };

    const onRemoteUrlBtnAction = (action) => {
        if (action === 'Ok') {
            if (remoteUrl !== '') {
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

    const getFileFromPicker = async (type = 'video') => {
        try {
            const res = await ImagePicker.openPicker({
                mediaType: type,
            });
            onUploadPressed(res.path);
            setIsSelectModalVisible(false);
        } catch (err) {
            throw err;
        }
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
                /*rightComponent={{
                    icon: 'file-upload',
                    type: 'font-awesome5',
                    color: '#fff',
                }}*/
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
                    <Text style={{textAlign: 'center'}}>{`Please select ${type === 'video' ? 'a video' : 'an audio'} file...`}</Text>
                )}
            />
            <CustomModal
                title={"Url"}
                isVisible={isUrlInputModalVisible}
                leftText={"Cancel"}
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
                                onPress={() => setRemoteUrl('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
                            >
                                {' '} http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
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
