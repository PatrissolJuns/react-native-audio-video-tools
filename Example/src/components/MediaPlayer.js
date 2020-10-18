import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Video from "react-native-video";
import {ProgressModal} from "./Modals";
import {Icon as IconNative} from "react-native-elements";
import {COLORS, msToTime, PRIMARY_COLOR} from "../utils";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

/**
 * Ion icon with a given size
 * @param props
 * @returns {*}
 * @constructor
 */
const Icon = (props) => (
    <IconNative
        size={30}
        color="white"
        type="ionicon"
        {...props}
    />
);

/**
 * Custom media player with a permanent display of control buttons and seek bar
 */
class MediaPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isStarted: props.autoplay,
            isPlaying: props.autoplay,
            progress: 0,
            duration: 0,
            isSeeking: false,

            // used to event play/pause icon to toggle went user press seek bar
            isFakePlaying: false,

            progressModal: {
                isVisible: false,
                text: 'Loading...',
            }
        };

        this.seekBarWidth = 200;
        this.wasPlayingBeforeSeek = props.autoplay;
        this.seekTouchStart = 0;
        this.seekProgressStart = 0;
        this.stepOfRapidMovement = 0;
        this.getPositionToAdd = 0;
        this.progressInterval = null;
        this.isProgressIntervalOn = false;
    }

    /**
     * Handled source props update
     * @param nextProps
     * @param prevState
     * @returns {null|{source: null}}
     */
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.source !== prevState.source) {
            return {
                isStarted: nextProps.autoplay,
                isPlaying: nextProps.autoplay,
                progress: 0,
                duration: 0,
                isSeeking: false,
                isFakePlaying: false,
                source: nextProps.source
                    ? nextProps.source.path ? nextProps.source.path : nextProps.source
                    : null,
            };
        }

        if (nextProps.paused !== prevState.paused) {
            return {
                isFakePlaying: false,
                isPlaying: nextProps.paused,
                progress: prevState.progress >= 1 ? 0 : prevState.progress,
            };
        }

        return null;
    }

    componentWillUnmount() {
        this.cancelSeekBarInterval();
    }

    updateSeekBarInterval = () => {
        this.progressInterval = setInterval(() => {
            if (this.state.isSeeking) {
                return;
            }
            const newProgress = this.controlValueAgainstAnother(this.state.progress + this.getPositionToAdd, 1);
            this.setState(prevState => ({
                progress: newProgress,
                isPlaying: newProgress === 1 ? false : prevState.isPlaying,
            }), () => {
                // Check if the video has finished playing and should loop
                if (this.state.progress >= 1 && this.props.loop) {
                    this.performReplayAction();
                }
            });
        }, 1000);
        this.isProgressIntervalOn = true;
    };

    cancelSeekBarInterval = () => {
        clearInterval(this.progressInterval);
        this.isProgressIntervalOn = false;
    };

    handlePausePlay = (force = false, value = true) => {
        this.setState(prevState => {
            if (prevState.progress >= 1 && !prevState.isPlaying) {
                return prevState;
            }

            return {
                isPlaying: force ? value : !prevState.isPlaying,
                progress: prevState.progress >= 1 ? 0 : prevState.progress,
            }
        }, () => {
            // Check if the video has finished playing and it was on pause before pressed on play/pause button
            // therefore replay it
            if (this.state.progress >= 1 && !this.state.isPlaying) {
                this.performReplayAction();
            }
        });
    };

    performReplayAction = () => {
        this.setState(
            { isPlaying: true, progress: 0 },
            () => this.player && this.performSeekAction(0)
        );
    };

    skipBackwards = () => {
        const timeToSkip = this.stepOfRapidMovement / this.state.duration;
        const newProgress = this.state.progress - timeToSkip > 0
            ? this.state.progress - timeToSkip : 0;

        // If the new state is more than the boundaries, replay the media instead
        if (newProgress === 0) {
            this.performReplayAction();
            return;
        }

        this.setState({progress: newProgress});
        this.performSeekAction(this.controlValueAgainstAnother(newProgress * this.state.duration));
    };

    skipForwards = () => {
        const timeToSkip = this.stepOfRapidMovement / this.state.duration;
        const newProgress = this.state.progress + timeToSkip <= 1
            ? this.state.progress + timeToSkip : 1;

        // If the new state is more than the boundaries, replay the media instead
        if (newProgress === 1) {
            this.performReplayAction();
            return;
        }

        this.setState({progress: newProgress});
        this.performSeekAction(this.controlValueAgainstAnother(newProgress * this.state.duration));
    };

    performSeekAction = (time) => {
        let _time = time;
        if (time < 0) _time = 0;
        else if (time > this.state.duration) _time = this.state.duration;
        this.player.seek(_time, 10);
    };

    controlValueAgainstAnother = (value, against = this.state.duration) => {
        return value < 0 ? 0
            : (value > against ? against : value);
    };

    /**
     | -------------------------------------------------------
     | Video Event
     | -------------------------------------------------------
     |
     | This section contains all events of video
     */
    onLoadStart = () => {
        // Only show progress modal when dealing with remote media
        if (this.state.source && this.state.source.uri.includes('http')) {
            this.setState(prevState => ({progressModal: {...prevState.progressModal, isVisible: true}}));
        }
    };

    onLoad = (event) => {
        const { duration } = event;

        // Get time to add on each interval call
        this.getPositionToAdd = 1 / duration;

        // Time to skip when pressed on backward or forward
        this.stepOfRapidMovement = duration > 15
            ? 15
            : duration > 10
                ? 10
                : duration > 5
                    ? 5
                    : 2;

        this.setState(prevState => ({duration, progressModal: {...prevState.progressModal, isVisible: false}}) );
    };

    onEnd = (event) => {
        if (this.props.onEnd) {
            this.props.onEnd(event);
        }

        this.setState({ progress: 1 });

        if (!this.props.loop) {
            this.setState(
                { isPlaying: false },
                () => this.player && this.performSeekAction(0)
            );
        } else {
            this.performReplayAction();
        }
    };

    /**
     | -------------------------------------------------------
     | Seeker Event
     | -------------------------------------------------------
     |
     | This section contains all events of seek bar and seek button
     */

    /**
     * get seek bar width
     */
    onSeekBarLayout = ({ nativeEvent }) => {
        this.seekBarWidth = nativeEvent.layout.width;
    };

    onSeekBarStartResponder = () => true;

    onSeekButtonStartResponder = () => true;

    onSeekBarMoveResponder = () => false;

    onSeekButtonMoveResponder = () => true;

    onSeekButtonResponderGrant = (e) => {
        this.seekTouchStart = e.nativeEvent.pageX;
        this.seekProgressStart = this.state.progress;
        this.wasPlayingBeforeSeek = this.state.isPlaying;
        this.setState({
            isSeeking: true,
            isPlaying: false,
            isFakePlaying: this.wasPlayingBeforeSeek ? true : this.state.isFakePlaying,
        });
    };

    onSeekButtonResponderRelease = () => {
        this.setState({
            isSeeking: false,
            isFakePlaying: false,
            isPlaying: this.wasPlayingBeforeSeek,
        });
    };

    onSeekBarResponderRelease = (e) => {
        const diff = e.nativeEvent.pageX;
        const ratio = 100 / this.seekBarWidth;
        let progress = ((ratio * diff) / 100);
        progress = this.controlValueAgainstAnother(progress, 1);

        this.performSeekAction(progress * this.state.duration);

        this.setState({
            progress,
        }, () => {
            this.setState({isSeeking: false, isPlaying: this.wasPlayingBeforeSeek, isFakePlaying: false});
        });
    };

    onSeekButtonResponderMove = (e) => {
        const diff = e.nativeEvent.pageX - this.seekTouchStart;
        const ratio = 100 / this.seekBarWidth;
        let progress = this.seekProgressStart + ((ratio * diff) / 100);

        progress = this.controlValueAgainstAnother(progress, 1);

        this.setState({
            progress,
        });

        this.performSeekAction(progress * this.state.duration);
    };

    renderSeekBar = () => {
        return (
            <View
                style={[styles.seekBar]}
                onLayout={this.onSeekBarLayout}
                onResponderGrant={this.onSeekButtonResponderGrant}
                onResponderRelease={this.onSeekBarResponderRelease}
                onStartShouldSetResponder={this.onSeekBarStartResponder}
                onMoveShouldSetPanResponder={this.onSeekBarMoveResponder}
            >
                {/* This view represents video's time played */}
                <View
                    style={[
                        { flexGrow: this.state.progress },
                        styles.seekBarProgress,
                    ]}
                />

                {/* This view is the button slider */}
                <View
                    style={[
                        styles.seekBarKnob,
                        this.state.isSeeking ? { transform: [{ scale: 1.1 }] } : {},
                    ]}
                    hitSlop={{ top: 20, bottom: 20, left: 10, right: 20 }}
                    onResponderMove={this.onSeekButtonResponderMove}
                    onResponderGrant={this.onSeekButtonResponderGrant}
                    onResponderRelease={this.onSeekButtonResponderRelease}
                    onResponderTerminate={this.onSeekButtonResponderRelease}
                    onStartShouldSetResponder={this.onSeekButtonStartResponder}
                    onMoveShouldSetPanResponder={this.onSeekButtonMoveResponder}
                />

                {/* This view represents the total video time */}
                <View style={[
                    styles.seekBarBackground,
                    { flexGrow: 1 - this.state.progress },
                ]} />
            </View>
        );
    };

    renderControls = () => {
        return (
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <TouchableOpacity style={styles.touchable} onPress={this.skipBackwards}>
                        <Icon name="ios-play-back-outline" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.touchable}
                        onPress={() => this.handlePausePlay()}>
                        {this.state.isFakePlaying || this.state.isPlaying ? (
                            <Icon name="ios-pause-circle-outline" />
                        ) : (
                            <Icon name="ios-play-circle-outline" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.touchable} onPress={this.skipForwards}>
                        <Icon name="ios-play-forward-outline" />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    {this.renderSeekBar()}
                    <View style={styles.timeWrapper}>
                        <Text style={styles.timeLeft}>{msToTime(this.state.progress * this.state.duration * 1000)}</Text>
                        <Text style={styles.timeRight}>{msToTime(this.state.duration * 1000)}</Text>
                    </View>
                </View>
            </View>
        )
    };

    render() {
        // Handle interval
        if (this.state.isPlaying && !this.isProgressIntervalOn) {
            this.updateSeekBarInterval();
        } else if (!this.state.isPlaying) {
            this.cancelSeekBarInterval();
        }

        return (
            <>
                <Video
                    {...this.props}
                    controls={false}
                    ref={p => { this.player = p; }}
                    paused={this.props.paused
                        ? this.props.paused || !this.state.isPlaying
                        : !this.state.isPlaying}
                    onEnd={this.onEnd}
                    onLoad={this.onLoad}
                    onLoadStart={this.onLoadStart}
                />
                {this.renderControls()}
                <ProgressModal
                    text={this.state.progressModal.text}
                    isVisible={this.state.progressModal.isVisible}
                />
            </>
        );
    }
}

const styles = StyleSheet.create({
    seekBar: {
        flexGrow: 1,
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 20,
    },
    seekBarFullWidth: {
        marginLeft: 0,
        marginRight: 0,
        paddingHorizontal: 0,
        marginTop: -3,
        height: 3,
    },
    seekBarProgress: {
        height: 3,
        backgroundColor: PRIMARY_COLOR,
    },
    seekBarKnob: {
        width: 15,
        height: 15,
        marginHorizontal: -8,
        marginVertical: -10,
        borderRadius: 10,
        backgroundColor: PRIMARY_COLOR,
        zIndex: 1,
    },
    seekBarBackground: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        height: 3,
    },

    container: {
        flex: 0.3,
        backgroundColor: COLORS.Haiti,
        justifyContent: 'space-between',
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    touchable: {
        padding: 5,
    },
    touchableDisabled: {
        opacity: 0.3,
    },
    timeWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    timeLeft: {
        flex: 1,
        fontSize: 16,
        color: COLORS.White,
        paddingLeft: 10,
    },
    timeRight: {
        flex: 1,
        fontSize: 16,
        color: COLORS.White,
        textAlign: 'right',
        paddingRight: 10,
    },
});

MediaPlayer.propTypes = {
    ...Video.propTypes,
    autoplay: PropTypes.bool,
    loop: PropTypes.bool,
};

MediaPlayer.defaultProps = {
    loop: false,
    autoplay: true,
};

export default React.memo(MediaPlayer);
