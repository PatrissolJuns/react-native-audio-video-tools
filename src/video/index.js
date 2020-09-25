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
    ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE
} from '../constants';

const DEFAULT_COMPRESS_OPTIONS = {
    quality: QUALITY.MEDIUM,
    speed: PRESET.VERY_SLOW,
};

class VideoTools {
    constructor(videoPath) {
        this.fullPath = videoPath;
        this.extension = getExtension(videoPath);
    }

    /**
     * Update a video path
     * @param videoPath
     */
    setVideoPath = (videoPath) => {
        this.fullPath = videoPath;
        this.extension = getExtension(videoPath);
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

    /**
     * Compress video according to parameters
     * @param options
     * @returns {Promise<any>}
     */
    compress = (options = DEFAULT_COMPRESS_OPTIONS) => {
        return new Promise(async (resolve, reject) => {
            // Check if the video path is correct
            const _isInputFileCorrect = this.isInputFileCorrect();
            if (!_isInputFileCorrect.isCorrect) {
                reject(_isInputFileCorrect.message);
                return;
            }

            // Check if options parameters are correct
            const _isOptionsValueCorrect = isOptionsValueCorrect(options);
            if (!_isOptionsValueCorrect.isCorrect) {
                reject(_isOptionsValueCorrect.message);
                return;
            }

            // Check if output file is correct
            let outputFile = undefined;
            try {
                // use default output file
                // or use new file from cache folder
                // TODO: Only generate output file if android
                outputFile = options.outputFile ? options.outputFile : await generateFile(this.extension);
                if (outputFile === undefined || outputFile === null) {
                    reject(options.outputFile ? INCORRECT_OUTPUT_PATH : ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE);
                    return;
                }
            } catch (e) {
                reject(options.outputFile ? INCORRECT_OUTPUT_PATH : ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE);
                return;
            }

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
            cmd.push(outputFile);

            // execute command
            VideoTools
                .execute(cmd.join(' '))
                .then(result => resolve({rc: result, outputFile: outputFile}))
                .catch(error => reject(error));
        });
    };

    /**
     * Retrieve details about a media
     * @returns {Promise<MediaDetails>}
     */
    getDetails = () => {
        return new Promise(async (resolve, reject) => {
            const GetAnotherMediaInfoCommand = `-i "${this.fullPath}" -v error -select_streams v:0 -show_entries format=size -show_entries stream=size,width,height -of json`;
            try {
                const mediaInformation = await RNFFprobe.getMediaInformation(this.fullPath);
                await RNFFprobe.execute(GetAnotherMediaInfoCommand);
                // example of output {"programs": [], "streams": [{"width": 640,"height": 360}], "format": {"size": "15804433"}}

                // get result of executed command
                let mediaInfo = await RNFFmpegConfig.getLastCommandOutput();
                mediaInfo = JSON.parse(mediaInfo.lastCommandOutput);
                mediaInformation['size'] = Number(mediaInfo.format.size);
                mediaInformation['width'] = Number(mediaInfo.streams[0].width);
                mediaInformation['height'] = Number(mediaInfo.streams[0].height);

                resolve(mediaInformation);
            } catch (e) {
                reject(e);
            }
        });
    };

    /**
     * Run a command
     * @param command
     * @returns {Promise<{rc: number}>}
     */
    static execute = command => RNFFmpeg.execute(command);
}

export default VideoTools;
