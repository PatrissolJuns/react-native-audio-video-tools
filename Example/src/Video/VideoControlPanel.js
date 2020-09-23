import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from "react-native";

import {COLORS, ROUTES} from "../utils";
import {Modal, ProgressModal} from "../components/Modals";
import ControlPanelItem from "../components/ControlPanelItem";

const VideoControlPanel = ({navigation, setVideoSource, ...RestProps}) => {
    const [isCutModalVisible, setIsCutModalVisible] = useState(false);
    return (
        <View style={styles.container}>
            <View style={styles.rowWrapper}>
                <ControlPanelItem
                    bgColor={COLORS["Coral Red"]}
                    text={"Video details"}
                    onPress={() => {
                        navigation.navigate(ROUTES.RESULT, {
                            content: {
                                url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                                text: "",
                            },
                            type: 'text'
                        });
                    }}
                />
                <ControlPanelItem
                    bgColor={COLORS.Jade}
                    text={"Compress Video"}
                    onPress={() => {
                        setIsCutModalVisible(true)
                    }}
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
                isVisible={isCutModalVisible}
                rightText={"Ok"}
                leftText={"Cancel"}
                onLeftClick={() => {

                }}
                onCloseClick={() => setIsCutModalVisible(false)}
                onRightClick={() => {

                }}
                content={(
                    <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet at, eveniet, excepturi fugiat laudantium</Text>
                )}
            />
        </View>
    );
};

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
    setVideoSource: PropTypes.any,
};

export default VideoControlPanel;
