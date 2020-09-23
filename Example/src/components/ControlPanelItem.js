import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {ITEMS_PER_ROW} from "../utils";

const ControlPanelItem = ({bgColor, text, onPress}) => {
    return (
        <TouchableOpacity
            style={[styles.btnItem, {backgroundColor: bgColor}]}
            onPress={() => onPress ? onPress() : null}
        >
            <Text style={styles.text}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btnItem: {
        // alignItems: 'stretch',
        // flexBasis: '50%',
        flex: 1 / ITEMS_PER_ROW,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'roboto'
    }
});

ControlPanelItem.propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired
};

export default ControlPanelItem;
