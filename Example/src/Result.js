import React, {useState} from 'react';
import Video from "react-native-video";
import RNFetchBlob from 'rn-fetch-blob';
import {Button, Header, Icon, ListItem} from "react-native-elements";
import {PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import toast from "./toast";
import SimpleProgressBar from "./components/SimpleProgressBar";
import {askPermission, COLORS, formatBytes, getPercentage, msToTime, PRIMARY_COLOR} from "./utils";

const FS = RNFetchBlob.fs;

/**
 * Ask permission to perform operation on file file
 * @returns {Promise<null|boolean>}
 */
const isFilePermissionGranted = async () => {
    try {
        const readPermission = await askPermission(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            "RNAudioVideoTools App Read Permission",
            "In order to save your media, We need permission to access your phone folder"
        );
        const writePermission = await askPermission(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            "RNAudioVideoTools App Write Permission",
            "In order to save your media, We need permission to access your phone folder"
        );
        return readPermission === PermissionsAndroid.RESULTS.GRANTED
            && writePermission === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        return null;
    }
};

/**
 * Return an array of array of details of a media
 * @param details
 * @param type
 * @returns {*[][]}
 */
const getDetailsFromMedia = (details, type = 'video') => {
    const result = [
        ['Size', formatBytes(details.size)],
        ['Duration', msToTime(details.duration)],
    ];

    if (type === 'video') {
        result.push(['Resolution', `${details.width}x${details.height}`]);
    }

    result.push(['Extension', details.extension],
        ['Format', details.format],
        ['Bitrate', details.bitrate],
        ['Filename', details.filename],
        ['Path', details.path],
        ['Number of streams', details.streams.length],
        ['Start time', details.startTime]);

    return result;
};

/**
 * Display a result after an operation
 * @param props
 * @returns {*}
 * @constructor
 */
const Result = (props) => {
    const [downloadTask, setDownloadTask] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadDestinationPath, setDownloadDestinationPath] = useState(null);
    const [downloadDetails, setDownloadDetails] = useState({
        total: 0,
        received: 0,
    });

    // Get var from navigator
    const {type, content} = props.route.params;

    // list different items to display
    let mediaDetails = null, newMediaDetails = null;
    if (content.mediaDetails)
        mediaDetails = getDetailsFromMedia(content.mediaDetails, content.mediaType);
    if (content.newMediaDetails)
        newMediaDetails = getDetailsFromMedia(content.newMediaDetails, content.newMediaType);

    /**
     * Handle download whether remote or local file
     * @returns {Promise<void>}
     */
    const handleDownload = async () => {
        // Get proper source media
        const sourceMediaDetails = content.newMediaDetails
            ? content.newMediaDetails
            : content.mediaDetails;

        // Get source media type
        const mediaType = content.newMediaDetails ? content.newMediaType : content.mediaType;

        // Set android base path
        const androidBasepath = mediaType === 'audio' ? FS.dirs.MusicDir : FS.dirs.MovieDir;

        // Get basepath according to platform
        const basepath = Platform.OS === 'android'
            ? androidBasepath : FS.dirs.LibraryDir;

        // Create destination filename
        let destinationFileFullPath = `${basepath}/${sourceMediaDetails.filename}.${sourceMediaDetails.extension}`;

        // Check if the file already exits
        const isDestinationFileExist = await FS.exists(destinationFileFullPath).catch(() => true);

        if (isDestinationFileExist) {
            // Give random name in case original name already exits
            destinationFileFullPath = `${basepath}/${Date.now()}.${sourceMediaDetails.extension}`;
        }

        // Save resources to state in order to be able to stop remote downloading
        setDownloadDestinationPath(destinationFileFullPath);

        // Ask permission to access file
        const _isFilePermissionGranted = await isFilePermissionGranted();

        // The following line is NOT a mistake
        if (_isFilePermissionGranted === false) {
            toast.error("You need to grant permission in order to continue");
            return;
        } else if (_isFilePermissionGranted === null) {
            toast.error("An error occur asking permission. Please try again later");
            return;
        }

        try {
            // Check if the media's source is a remote one
            if (sourceMediaDetails.isRemoteMedia) {
                setIsDownloading(true);
                // Initiate downloading
                const task = RNFetchBlob.config({path : destinationFileFullPath})
                    .fetch('GET', sourceMediaDetails.path);

                // Save in order to be able to cancel later
                setDownloadTask(task);

                // Download the file
                await task.progress((received, total) => {
                        setDownloadDetails({
                            total,
                            received,
                        });
                    });
            } else {
                // Copy the file instead
                await FS.cp(sourceMediaDetails.path, destinationFileFullPath);
            }

            // Hide download box
            setIsDownloading(false);
            setDownloadDetails({
                bytesWritten: 0,
                contentLength: 0,
            });

            if (Platform.OS === 'android') {
                toast.success(`File downloaded successfully. You can get it into ${mediaType === 'audio' ? 'Music' : 'Movies'} folder`);
            } else {
                toast.success(`File downloaded successfully. You can get it into library folder`);
            }
        } catch (e) {}
    };

    /**
     * Handle stop download action
     * @returns {Promise<void>}
     */
    const stopDownload = async () => {
        try {
            if (downloadTask && downloadDestinationPath) {
                downloadTask.cancel(() => {
                    toast.success("The download was stopped.");
                    setIsDownloading(false);
                    setDownloadDetails({
                        bytesWritten: 0,
                        contentLength: 0,
                    });
                });
            }
        } catch (e) {
            toast.error("An error occur while stopping download");
        }
    };

    /**
     * Right component on header
     * @returns {*}
     */
    const renderRightComponent = () => {
        // Hide download button while downloading
        if (isDownloading) {
            return <View />
        }

        return (
            <Button
                icon={
                    <Icon
                        name="download"
                        type="antdesign"
                        size={15}
                        color="white"
                        style={{
                            marginLeft: 5
                        }}
                    />
                }
                iconRight
                title="Download"
                onPress={handleDownload}
            />
        );
    };

    /**
     * Left component on header
     * @returns {*}
     */
    const renderLeftComponent = () => {
        return (
            <TouchableOpacity
                style={{padding: 5}}
                onPress={() => props.navigation.goBack()}
            >
                <Icon
                    name='arrowleft'
                    type="antdesign"
                    color={COLORS.White}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={{flex: 1}}>
            <Header
                placement="left"
                leftComponent={renderLeftComponent()}
                centerComponent={{ text: 'Result', style: { color: COLORS.White, fontSize: 20 } }}
                rightComponent={renderRightComponent()}
            />
            {isDownloading && (
                <SimpleProgressBar
                    onCancelPress={stopDownload}
                    completed={getPercentage(downloadDetails.received, downloadDetails.total)}
                />
            )}
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
                                    mediaDetails && mediaDetails.map((detail, i) => {
                                        return (
                                            <ListItem key={i} bottomDivider>
                                                <ListItem.Content>
                                                    <ListItem.Title>{detail[0]}</ListItem.Title>
                                                    <ListItem.Subtitle>{detail[1]}</ListItem.Subtitle>
                                                </ListItem.Content>
                                            </ListItem>
                                        );
                                    })
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
        </View>
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
