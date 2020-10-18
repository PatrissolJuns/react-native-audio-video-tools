import Media from "../Media";
import {
    getCompressionOptionsResolution, mapSpeedToPreset,
} from '../utils';
import {
    DEFAULT_COMPRESS_VIDEO_OPTIONS,
    DEFAULT_EXTRACT_AUDIO_OPTIONS
} from '../constants';

/**
 * Management of operations relating to video processing
 */
class VideoTools extends Media {
    constructor(videoFullPath) {
        super(videoFullPath, 'video');
    }

    /**
     * Compress video according to parameters
     * @param options
     * @returns {Promise<any>}
     */
    compress = (options = DEFAULT_COMPRESS_VIDEO_OPTIONS) => {
        return new Promise(async (resolve, reject) => {
            // Check input and options values
            const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'compress', options.extension);
            if (!checkInputAndOptionsResult.isCorrect) {
                reject(checkInputAndOptionsResult.message);
                return;
            }

            // get resulting output file path
            const { outputFilePath } = checkInputAndOptionsResult;

            // get command options based of options parameters
            const result = getCompressionOptionsResolution(options.quality, options.speed);

            // group command from calculated values
            const cmd = [
                "-i", `"${this.mediaFullPath}"`,
                "-c:v", "libx264",
                "-crf", result["-crf"],
                "-preset", result["-preset"],
            ];

            // Add bitrate if present
            if (options.bitrate) {
                cmd.push("-b:v", options.bitrate);
            }

            // Add output file as last parameter
            cmd.push(`"${outputFilePath}"`);

            // Execute command
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
            const cmd = `-i "${this.mediaFullPath}" "${outputFilePath}"`;

            // execute command
            VideoTools
                .execute(cmd)
                .then(result => resolve({outputFilePath, rc: result}))
                .catch(error => reject(error));
        });
    };
}

export default VideoTools;
