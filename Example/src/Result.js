import React from 'react';
import {ScrollView, StyleSheet, View} from "react-native";

import Video from "react-native-video";
import {formatBytes, msToTime} from "./utils";
import {ListItem} from "react-native-elements";

const Result = (props) => {
    const {type, content} = props.route.params;
    let details = null;
    if (content.details) {
        // list different items to display
        details = [
            ['Size', formatBytes(content.details.size)],
            ['Duration', msToTime(content.details.duration)],
            ['Resolution', `${content.details.width}x${content.details.height}`],
            ['Format', content.details.format],
            ['Bitrate', content.details.bitrate],
            ['Path', content.details.path],
            ['Number of streams', content.details.streams.length],
            ['Start time', content.details.startTime],
        ];
    }

    return (
        <>
            {type === 'text' ? (
                <ScrollView style={styles.container}>
                    {
                        details && details.map((detail, i) => (
                            <ListItem key={i} bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>{detail[0]}</ListItem.Title>
                                    <ListItem.Subtitle>{detail[1]}</ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        ))
                    }
                </ScrollView>
            ) : (
                <View style={styles.container}>
                    <Video
                        controls
                        style={styles.video}
                        resizeMode={'contain'}
                        source={{uri: content.url}}
                    />
                    <ScrollView style={styles.scrollView}>
                        {
                            details && details.map((detail, i) => (
                                <ListItem key={i} bottomDivider>
                                    <ListItem.Content>
                                        <ListItem.Title>{detail[0]}</ListItem.Title>
                                        <ListItem.Subtitle>{detail[1]}</ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                            ))
                        }
                    </ScrollView>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    video: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Result;
