import React from 'react';
import {Button, Text, View} from "react-native";

const AudioScreen = (props) => {
    const { navigation } = props;
    return (

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text> AudioScreen screen </Text>
            <Button
                onPress={() => navigation.navigate('VideoScreen')}
                title="Go to VideoScreen"
            />
        </View>
    );
};

export default AudioScreen;
