import React from 'react';
import {StyleSheet, View} from "react-native";
import {Button, Header, Icon} from "react-native-elements";
import DocumentPicker from 'react-native-document-picker';

const Layout = ({navigation, viewContent, controlPanel, headerText, onUploadPressed, type}) => {
    const getFileFromPicker = async (type = DocumentPicker.types.video) => {
        try {
            const res = await DocumentPicker.pick({
                type: [type],
            });
            onUploadPressed(res.uri);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
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
                onPress={() => getFileFromPicker(type)}
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
