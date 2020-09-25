import React from 'react';
import PropTypes from 'prop-types';
import {COLORS, PRIMARY_COLOR} from "../utils";
import {Button, Divider, Icon, Overlay} from "react-native-elements";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";

/**
 * Show a progress modal
 *
 * @param text
 * @param isVisible
 * @returns {*}
 * @constructor
 */
const ProgressModal = ({text, isVisible}) => {
    return (
        <Overlay isVisible={isVisible}>
            <View
                style={styles.progressModalContainer}
            >
                <ActivityIndicator
                    size="large"
                    color={PRIMARY_COLOR}
                />
                <Text
                    style={styles.progressModalText}
                >
                    {text}
                </Text>
            </View>
        </Overlay>
    );
};

/**
 * Display a modal
 *
 * @param content
 * @param isVisible
 * @param onCloseClick
 * @param leftText
 * @param rightText
 * @param onLeftClick
 * @param onRightClick
 * @returns {*}
 * @constructor
 */
const Modal = ({content, isVisible, onCloseClick, leftText, rightText, onLeftClick, onRightClick}) => {
    return (
        <Overlay isVisible={isVisible} overlayStyle={styles.container}>
            <View
                style={styles.wrapper}
            >
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Title</Text>
                    <View
                        style={{
                            position: 'absolute',
                            right: 5,
                        }}
                    >
                        <Icon
                            name={'ios-close-circle-outline'}
                            type="ionicon"
                            color={COLORS.White}
                            onPress={onCloseClick}
                        />
                    </View>
                </View>
                <Divider />
                <View style={styles.modalBody}>
                    {content}
                </View>
                <View style={styles.modalFooter}>
                    {onLeftClick && onRightClick ? (
                        <>
                            <Button
                                raised
                                type="outline"
                                title={leftText}
                                onPress={onLeftClick}
                                buttonStyle={{paddingHorizontal: 20, paddingVertical: 5}}
                            />
                            <Button
                                title={rightText}
                                onPress={onRightClick}
                                buttonStyle={{paddingHorizontal: 20, paddingVertical: 5, marginHorizontal: 20, marginLeft: 40}}
                            />
                        </>
                    ) : (
                        <Button
                            title={leftText}
                            onPress={onLeftClick}
                            buttonStyle={{paddingHorizontal: 20, paddingVertical: 5, marginRight: 20}}
                        />
                    )}
                </View>
            </View>
        </Overlay>
    );
};

const styles = StyleSheet.create({
    progressModalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    progressModalText: {
        fontFamily: 'roboto',
        fontSize: 18,
        textAlign: 'center',
        justifyContent: 'center',
        marginLeft: 5
    },
    container: {
        backgroundColor: COLORS.White,
        padding: 0,
    },
    wrapper: {
        maxWidth: '80%',
    },
    modalHeader: {
        justifyContent: 'center',
        position: 'relative',
        paddingTop: 5,
        paddingBottom: 10,
        backgroundColor: COLORS["Summer Sky"],
    },
    modalTitle: {
        fontFamily: 'roboto',
        fontSize: 18,
        textAlign: 'center',
        color: COLORS.White
    },
    modalBody: {
        paddingHorizontal: 10,
        marginVertical: 40,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 10,
        paddingHorizontal: 10,
        paddingLeft: 30,
    }
});

ProgressModal.propTypes = {
    text: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
};

export {
    ProgressModal,
    Modal
};
