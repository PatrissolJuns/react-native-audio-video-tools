import Media from "../Media";
import {AUDIO_BITRATE, DEFAULT_COMPRESS_AUDIO_OPTIONS} from "../constants";

/**
 * Management of operations relating to audio processing
 */
class AudioTools extends Media {
    constructor(videoFullPath) {
        super(videoFullPath, 'audio');
    }

    /**
     * Compress audio according to parameters
     * @param options
     * @returns {Promise<any>}
     */
    compress = (options = DEFAULT_COMPRESS_AUDIO_OPTIONS) => {
        return new Promise(async (resolve, reject) => {
            // Check input and options values
            const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'compress', options.extension);
            if (!checkInputAndOptionsResult.isCorrect) {
                reject(checkInputAndOptionsResult.message);
                return;
            }

            // get resulting output file path
            const { outputFilePath } = checkInputAndOptionsResult;

            // Get media details
            const mediaDetails = await this.getDetails().catch(() => null);

            // Initialize bitrate
            let bitrate = DEFAULT_COMPRESS_AUDIO_OPTIONS.bitrate;

            if (mediaDetails && mediaDetails.bitrate) {
                // Check and return the appropriate bitrate according to quality expected
                for (let i = 0; i < AUDIO_BITRATE.length; i++) {
                    // Check a particular bitrate to return its nearest lower according to quality
                    if (mediaDetails.bitrate > AUDIO_BITRATE[i]) {
                        if (i + 2 < AUDIO_BITRATE.length) {
                            if (options.quality === 'low') bitrate = `${AUDIO_BITRATE[i + 2]}k`;
                            else if (options.quality === 'medium') bitrate = `${AUDIO_BITRATE[i + 1]}k`;
                            else bitrate = `${AUDIO_BITRATE[i]}k`;
                        } else if (i + 1 < AUDIO_BITRATE.length) {
                            if (options.quality === 'low') bitrate = `${AUDIO_BITRATE[i + 1]}k`;
                            else bitrate = `${AUDIO_BITRATE[i]}k`;
                        } else bitrate = `${AUDIO_BITRATE[i]}k`;
                        break;
                    }

                    // Check if the matching bitrate is the last in the array
                    if (mediaDetails.bitrate <= AUDIO_BITRATE[AUDIO_BITRATE.length - 1]) {
                        bitrate = `${AUDIO_BITRATE[AUDIO_BITRATE.length - 1]}k`;
                        break;
                    }
                }
            }

            // group command from calculated values
            const cmd = [
                "-i", `"${this.mediaFullPath}"`,
                "-b:a", options.bitrate ? options.bitrate : bitrate,
                "-map", "a",
                `"${outputFilePath}"`
            ];

            // Execute command
            AudioTools
                .execute(cmd.join(' '))
                .then(result => resolve({outputFilePath, rc: result}))
                .catch(error => reject(error));
        });
    };
}

export default AudioTools;
