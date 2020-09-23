import React from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Video from "react-native-video";

const Result = (props) => {
    const {type, content} = props.route.params;

    return (
        <>
            {type === 'text' ? (
                <View style={styles.container}>
                    <Text>
                        {content.text}
                    </Text>
                </View>
            ) : (
                <View style={{flex: 1}}>
                    <Video
                        controls
                        style={styles.video}
                        resizeMode={'contain'}
                        source={{uri: content.url}}
                    />
                    <ScrollView style={styles.scrollView}>
                        <Text>
                            {content.text}
                        </Text>
                    </ScrollView>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        // flex: 0.3,
        padding: 10,
    }
});

export default Result;
