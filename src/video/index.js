import { Platform } from 'react-native';
import PRESET from '../enums/Preset';
import QUALITY from '../enums/Quality';
import { generateFile } from '../CacheManager';
import {RNFFprobe, RNFFmpeg, RNFFmpegConfig} from 'react-native-ffmpeg';
import {
    getExtension,
    isOptionsValueCorrect,
    getCompressionOptionsResolution,
} from '../utils';
import {
    INCORRECT_INPUT_PATH,
    INCORRECT_OUTPUT_PATH,
    ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE, DEFAULT_COMPRESS_OPTIONS, DEFAULT_EXTRACT_AUDIO_OPTIONS
} from '../constants';

class VideoTools {
    constructor(videoPath) {
        this.fullPath = videoPath;
        this.extension = getExtension(videoPath);
        this.mediaDetails = null;

        // this.getOrUpdateCurrentMediaDetails();
    }

    /**
     * Update a video path
     * @param videoPath
     */
    setVideoPath = (videoPath) => {
        if (videoPath !== this.fullPath) {
            this.mediaDetails = null;
            this.fullPath = videoPath;
            this.extension = getExtension(videoPath);
        }

        // this.getOrUpdateCurrentMediaDetails();
    };

    /**
     * Return boolean to indicate whether input file is correct or not
     * @returns {boolean}
     */
    hasCorrectInputFile = () => this.extension !== INCORRECT_INPUT_PATH;

    /**
     * Display error in case input file is incorrect
     * @returns {{message: string, isCorrect: boolean}}
     */
    isInputFileCorrect = () => {
          if (this.extension === INCORRECT_INPUT_PATH) {
              return {
                  isCorrect: false,
                  message: INCORRECT_INPUT_PATH
              };
          }
          return {
            isCorrect: true,
            message: ''
        };
    };

    checkInputAndOptions = async (options, operation, extension = this.extension, withOutputFilePath = true) => {
        const defaultResult = {
            outputFilePath: '',
            isCorrect: true,
            message: '',
        };

        // Check if the video path is correct
        const _isInputFileCorrect = this.isInputFileCorrect();
        if (!_isInputFileCorrect.isCorrect) {
            return _isInputFileCorrect;
        }

        // Check if options parameters are correct
        const _isOptionsValueCorrect = isOptionsValueCorrect(options, operation);
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
     * @returns {Promise<MediaDetails>}
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

            const GetAnotherMediaInfoCommand = `-i "${this.fullPath}" -v error -select_streams v:0 -show_entries format=size -show_entries stream=size,width,height -of json`;
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
                const mediaInformation = await RNFFprobe.getMediaInformation(this.fullPath);

                // treat both results
                mediaInformation['size'] = Number(mediaInfo.format.size);
                mediaInformation['width'] = Number(mediaInfo.streams[0].width);
                mediaInformation['height'] = Number(mediaInfo.streams[0].height);
                mediaInformation['extension'] = getExtension(this.fullPath);

                // update mediaDetails
                this.mediaDetails = mediaInformation;

                // return result
                resolve(mediaInformation);
            } catch (e) {
                reject(e);
            }
        });
    };

    /**
     * Initialize mediaDetails or update it
     */
    getOrUpdateCurrentMediaDetails = () => {
        if (this.hasCorrectInputFile()) {
            // reset media details so that it cannot get into saved one
            this.mediaDetails = null;

            this.getDetails()
                .then({})
                .catch(() => {});
        }
    };

    /**
     * Compress video according to parameters
     * @param options
     * @returns {Promise<any>}
     */
    compress = (options = DEFAULT_COMPRESS_OPTIONS) => {
        return new Promise(async (resolve, reject) => {
            // Check input and options values
            const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'compress');
            if (!checkInputAndOptionsResult.isCorrect) {
                reject(checkInputAndOptionsResult.message);
                return;
            }

            // get resulting output file path
            const { outputFilePath } = checkInputAndOptionsResult;

            // get command options based of options parameters
            const result = getCompressionOptionsResolution(options.quality);

            // group command from calculated values
            const commandObject = {
                "-i": this.fullPath,
                "-c:v": "libx264",
                "-crf": result["-crf"],
                "-preset": options.speed ? options.speed : DEFAULT_COMPRESS_OPTIONS.speed,
            };
            if (options.bitrate) commandObject['bitrate'] = options.bitrate;

            // construct final command
            const cmd = [];
            Object.entries(commandObject).map(item => {
                cmd.push(item[0]);
                cmd.push(item[1]);
            });

            // add output file as last parameters
            cmd.push(outputFilePath);

            // execute command
            VideoTools
                .execute(cmd.join(' '))
                .then(result => resolve({outputFilePath, rc: result}))
                .catch(error => reject(error));
        });
    };

    /**
     * Extract audio from video
     * @param options
     * @returns {Promise<any>}
     */
    extractAudio = (options = DEFAULT_EXTRACT_AUDIO_OPTIONS) => {
        return new Promise(async (resolve, reject) => {
            // Check input and options values
            const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'extractAudio', options.extension);
            if (!checkInputAndOptionsResult.isCorrect) {
                reject(checkInputAndOptionsResult.message);
                return;
            }

            // get resulting output file path
            const { outputFilePath } = checkInputAndOptionsResult;

            // construct final command
            const cmd = `-i "${this.fullPath}" ${outputFilePath}`;

            // execute command
            VideoTools
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

export default VideoTools;
