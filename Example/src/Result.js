import React from 'react';
import Video from "react-native-video";
import {ListItem} from "react-native-elements";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {formatBytes, msToTime, PRIMARY_COLOR} from "./utils";

const getDetailsFromVideo = details => {
    return [
        ['Size', formatBytes(details.size)],
        ['Duration', msToTime(details.duration)],
        ['Resolution', `${details.width}x${details.height}`],
        ['Extension', details.extension],
        ['Format', details.format],
        ['Bitrate', details.bitrate],
        ['Path', details.path],
        ['Number of streams', details.streams.length],
        ['Start time', details.startTime],
    ];
};

const Result = (props) => {
    const {type, content} = props.route.params;

    // list different items to display
    let mediaDetails = null, newMediaDetails = null;
    if (content.mediaDetails)
        mediaDetails = getDetailsFromVideo(content.mediaDetails);
    if (content.newMediaDetails)
        newMediaDetails = getDetailsFromVideo(content.newMediaDetails);

    return (
        <>
            {type === 'text' ? (
                <ScrollView style={styles.container}>
                    {
                        mediaDetails && mediaDetails.map((detail, i) => (
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
                        <View style={styles.scrollViewWrapper}>
                            <View style={styles.sideView}>
                                <Text style={styles.introText}>Media details <Text style={{fontWeight: 'bold'}}>before</Text> action</Text>
                                {
                                    mediaDetails && mediaDetails.map((detail, i) => (
                                        <ListItem key={i} bottomDivider>
                                            <ListItem.Content>
                                                <ListItem.Title>{detail[0]}</ListItem.Title>
                                                <ListItem.Subtitle>{detail[1]}</ListItem.Subtitle>
                                            </ListItem.Content>
                                        </ListItem>
                                    ))
                                }
                            </View>
                            <View style={styles.centerView}>
                                <View style={styles.dividerBar} />
                            </View>
                            <View style={styles.sideView}>
                                <Text style={styles.introText}>Media details <Text style={{fontWeight: 'bold'}}>after</Text> action</Text>
                                {
                                    newMediaDetails && newMediaDetails.map((detail, i) => (
                                        <ListItem key={i} bottomDivider>
                                            <ListItem.Content>
                                                <ListItem.Title>{detail[0]}</ListItem.Title>
                                                <ListItem.Subtitle>{detail[1]}</ListItem.Subtitle>
                                            </ListItem.Content>
                                        </ListItem>
                                    ))
                                }
                            </View>
                        </View>
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
    },
    scrollView: {
        flex: 1,
        marginTop: 10
    },
    scrollViewWrapper: {
        flexDirection: 'row',
        paddingVertical: 10
    },
    sideView: {
        flex: 0.48
    },
    introText: {
        marginBottom: 5,
        textAlign: 'center',
        fontSize: 16,
    },
    centerView: {
        flex: 0.04,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dividerBar: {
        flex: 1,
        borderWidth: 1,
        borderColor: PRIMARY_COLOR
    }
});

export default Result;
