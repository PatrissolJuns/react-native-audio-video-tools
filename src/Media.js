import { Platform } from 'react-native';
import {generateFile} from "./CacheManager";
import {RNFFmpeg, RNFFmpegConfig, RNFFprobe} from "react-native-ffmpeg";
import {
    getFilename,
    getExtension,
    isRemoteMedia,
    isFileNameError,
    millisecondsToTime,
    isOptionsValueCorrect,
    timeStringToMilliseconds
} from "./utils";
import {
    INCORRECT_OUTPUT_PATH,
    DEFAULT_VIDEO_CONVERT_TO_OPTIONS,
    DEFAULT_AUDIO_CONVERT_TO_OPTIONS,
    ERROR_WHILE_GETTING_INPUT_DETAILS,
    ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE
} from './constants';

/**
 * Main class of any media whether video or audio
 */
export default class Media {
    constructor(mediaFullPath, mediaType) {
        // Determine whether media is an 'audio' or 'video'
        this.mediaType = mediaType;
        // Will contain media details
        this.mediaDetails = undefined;
        // Full path of current media
        this.mediaFullPath = mediaFullPath;
        // Filename of current media
        this.filename = getFilename(mediaFullPath);
        // Check whether the current media is a remote one
        this.isRemoteMedia = isRemoteMedia(mediaFullPath);
        // Extension of current media
        this.extension = getExtension(mediaFullPath, mediaType);
    }

    /**
     * Update media path
     * @param mediaFullPath
     */
    setMediaFullPath = (mediaFullPath) => {
        // Update core property
        this.mediaDetails = undefined;
        this.mediaFullPath = mediaFullPath;
        this.filename = getFilename(mediaFullPath);
        this.isRemoteMedia = isRemoteMedia(mediaFullPath);
        this.extension = getExtension(mediaFullPath, this.mediaType);
    };

    /**
     * Indicate whether input file is correct or not
     * Display error in case input file is incorrect
     * @returns {{message: string, isCorrect: boolean}}
     */
    isInputFileCorrect = async () => {
        if (isFileNameError(this.filename)) {
            return {
                isCorrect: false,
                message: this.filename // because filename will contains the error message
            };
        }

        // Get details about input file in order to be sure that is a correct one
        const details = await this.getDetails().catch(() => null);
        if (!details) {
            return {
                isCorrect: false,
                message: details || ERROR_WHILE_GETTING_INPUT_DETAILS
            };
        }

        return {
            isCorrect: true,
            message: ''
        };
    };

    /**
     * Perform some operation in order to check options parameters
     * @param options
     * @param operation
     * @param extension
     * @param withOutputFilePath
     * @returns {Promise<{message: string, outputFilePath: string, isCorrect: boolean}|{message: string, isCorrect: boolean}>}
     */
    checkInputAndOptions = async (options, operation, extension = this.extension, withOutputFilePath = true) => {
        const defaultResult = {
            outputFilePath: '',
            isCorrect: true,
            message: '',
        };

        // Check if the video path is correct
        const _isInputFileCorrect = await this.isInputFileCorrect();
        if (!_isInputFileCorrect.isCorrect) {
            return _isInputFileCorrect;
        }

        // Check if options parameters are correct
        const _isOptionsValueCorrect = isOptionsValueCorrect(options, operation, this.mediaType);
        if (!_isOptionsValueCorrect.isCorrect) {
            return _isOptionsValueCorrect;
        }

        if (withOutputFilePath) {
            // Check if output file is correct
            let outputFilePath = undefined;
            try {
                // use default output file
                // or use new file from cache folder
                if (options.outputFilePath) {
                    outputFilePath = options.outputFilePath;
                    defaultResult.outputFilePath = outputFilePath;
                } else {
                    if (Platform.OS === 'android') {
                        outputFilePath = await generateFile(extension);
                        defaultResult.outputFilePath = outputFilePath;
                    }
                }
                if (outputFilePath === undefined || outputFilePath === null) {
                    defaultResult.isCorrect = false;
                    defaultResult.message = options.outputFilePath ? INCORRECT_OUTPUT_PATH : ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE;
                }
            } catch (e) {
                defaultResult.isCorrect = false;
                defaultResult.message = options.outputFilePath ? INCORRECT_OUTPUT_PATH : ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE;
            } finally {
                return defaultResult;
            }
        }

        return defaultResult;
    };

    /**
     * Retrieve details about a media
     * @returns {Promise<MediaDetails | null>}
     */
    getDetails = (force = false) => {
        return new Promise(async (resolve, reject) => {
            // Check force parameter
            if (typeof force !== 'boolean') {
                reject(`Parameter force should be boolean. ${typeof force} given`);
                return;
            }

            // Perform cache operation
            if (!force && this.mediaDetails) {
                resolve(this.mediaDetails);
                return;
            }

            const GetAnotherMediaInfoCommand = `-i "${this.mediaFullPath}" -v error -select_streams v:0 -show_entries format=size -show_entries stream=size,width,height -of json`;
            try {
                // Since we used "-v error", a work around is to call first this command before the following
                const result = await RNFFprobe.execute(GetAnotherMediaInfoCommand);
                if (result.rc !== 0) {
                    throw new Error("Failed to execute command");
                }

                // get the output result of the command
                // example of output {"programs": [], "streams": [{"width": 640,"height": 360}], "format": {"size": "15804433"}}
                let mediaInfo = await RNFFmpegConfig.getLastCommandOutput();
                mediaInfo = JSON.parse(mediaInfo.lastCommandOutput);

                // execute second command
                const mediaInformation = await RNFFprobe.getMediaInformation(this.mediaFullPath);

                // treat both results
                mediaInformation['filename'] = this.filename;
                mediaInformation['extension'] = this.extension;
                mediaInformation['isRemoteMedia'] = this.isRemoteMedia;
                mediaInformation['size'] = Number(mediaInfo.format.size);
                if (this.mediaType === 'video') {
                    mediaInformation['width'] = Number(mediaInfo.streams[0].width);
                    mediaInformation['height'] = Number(mediaInfo.streams[0].height);
                }

                // update mediaDetails
                this.mediaDetails = mediaInformation;

                // return result
                resolve(mediaInformation);
            } catch (e) {
                // update mediaDetails
                this.mediaDetails = null;
                reject(e);
            }
        });
    };

    /**
     * Cut media file
     * @param options
     * @returns {Promise<any>}
     */
    cut = (options) => {
        return new Promise(async (resolve, reject) => {
            // Check input and options values
            const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'cut');
            if (!checkInputAndOptionsResult.isCorrect) {
                reject(checkInputAndOptionsResult.message);
                return;
            }

            // Fetch input details in order to get video duration
            const inputDetails = await this.getDetails();
            const toDuration = timeStringToMilliseconds(options.to);
            const fromDuration = timeStringToMilliseconds(options.from);

            // Check for incoherence
            if (inputDetails.duration < toDuration) {
                reject('The option "to" can not be greater than the total time of the video');
                return;
            }

            if (inputDetails.duration < fromDuration) {
                reject('The option "from" can not be greater than the total time of the video');
                return;
            }

            // get the time to cut the video since ffmpeg use another system
            const _to = millisecondsToTime(toDuration - fromDuration);

            // get resulting output file path
            const { outputFilePath } = checkInputAndOptionsResult;

            // construct final command
            const cmd = `-ss ${options.from} -i "${this.mediaFullPath}" -to ${_to} -c copy "${outputFilePath}"`;

            // execute command
            Media
                .execute(cmd)
                .then(result => resolve({outputFilePath, rc: result}))
                .catch(error => reject(error));
        });
    };

    /**
     * Convert a media from one extension to another
     * @param options
     * @returns {Promise<any>}
     */
    convertTo = (options = (this.mediaType === 'audio'
        ? DEFAULT_AUDIO_CONVERT_TO_OPTIONS
        : DEFAULT_VIDEO_CONVERT_TO_OPTIONS)) => {
        return new Promise(async (resolve, reject) => {
            // Check input and options values
            const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'convertTo', options.extension);
            if (!checkInputAndOptionsResult.isCorrect) {
                reject(checkInputAndOptionsResult.message);
                return;
            }

            // get resulting output file path
            const { outputFilePath } = checkInputAndOptionsResult;

            // construct final command
            const cmd = `-i "${this.mediaFullPath}" "${outputFilePath}"`;

            // execute command
            Media
                .execute(cmd)
                .then(result => resolve({outputFilePath, rc: result}))
                .catch(error => reject(error));
        });
    };

    /**
     * Run a command
     * @param command
     * @returns {Promise<{rc: number}>}
     */
    static execute = command => RNFFmpeg.execute(command);

    /**
     * Cancel ongoing command
     */
    static cancel = () => RNFFmpeg.cancel();
}
