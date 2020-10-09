import React from 'react';
import PropTypes from 'prop-types';
import {COLORS, PRIMARY_COLOR} from "../utils";
import {Button, Icon} from "react-native-elements";
import {StyleSheet, Text, View} from "react-native";

/**
 * Display a simple progress bar with a cancel button
 * @param completed
 * @param onCancelPress
 * @returns {*}
 * @constructor
 */
const SimpleProgressBar = ({completed, onCancelPress}) => {
    return (
        <View style={styles.container}>
            <View style={styles.progressBarContainer}>
                <View style={styles.barWrapper}>
                    <View style={[styles.innerBar, {width: `${completed}%`}]}/>
                    <View>
                        <Text style={styles.percentage}>
                            {completed}%
                        </Text>
                    </View>

                </View>
            </View>
            <Button
                icon={
                    <Icon
                        name="cancel"
                        type="material"
                        size={15}
                        color={'white'}
                        style={{marginLeft: 5}}
                    />
                }
                buttonStyle={{ backgroundColor: 'red' }}
                iconRight
                title="Cancel"
                onPress={() => onCancelPress()}
            />
        </View>
    );
};

SimpleProgressBar.propTypes = {
    completed: PropTypes.number,
    onCancelPress: PropTypes.func,
};

const styles = StyleSheet.create({
     container: {
         height: 50,
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'space-between',
         backgroundColor: PRIMARY_COLOR,
         paddingHorizontal: 16
     },
    progressBarContainer: {
        flex: 1,
    },
    barWrapper: {
        backgroundColor: COLORS.White,
        // flex: 1,
        marginRight: 10,
        justifyContent: 'center',
        // alignItems: 'center',
        height: '50%',
        position: 'relative',
    },
    innerBar: {
        position: 'absolute',
        alignItems: 'center',
        backgroundColor: COLORS["Turquoise Blue"],
        width: '0%',
        height: '100%',
    },
    percentage: {
         color: 'black',
        zIndex: 20,
        textAlign: 'center',
        fontWeight: 'bold'
     }
});

export default SimpleProgressBar;
