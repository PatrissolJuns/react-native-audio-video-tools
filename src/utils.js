import SPEED from './enums/Speed';
import QUALITY from './enums/Quality';
import {
    AUDIO_EXTENSIONS,
    VIDEO_EXTENSIONS,
    INCORRECT_INPUT_PATH,
    DEFAULT_AUDIO_EXTENSION,
    DEFAULT_VIDEO_EXTENSION,
} from './constants';

// Regex to format string time hh:mm:ss
const timeRegex = /\d\d:\d\d:\d\d/;

/**
 * Check if a given media path is a local or remote
 * @param path
 * @returns {boolean}
 */
const isRemoteMedia = path => {
    return typeof path === 'string'
        ? path.split(':/')[0].includes('http')
        : null;
};

/**
 * Check whether a given extension is valid
 * which means among known extensions
 * @param extension
 * @param type
 * @returns {boolean}
 */
const isMediaExtensionCorrect = (extension, type) => {

    if (typeof extension === 'string'
        && (type === 'audio' || type === 'video')) {
        const extensionList = type === 'audio' ? AUDIO_EXTENSIONS : VIDEO_EXTENSIONS;
        return extensionList.includes(extension.toLowerCase());
    }
    return false;

};

/**
 * Check if a filename is an error one
 * @param filename
 * @returns {boolean}
 */
const isFileNameError = (filename) => {
    return filename === INCORRECT_INPUT_PATH;
};

/**
 * Extract full file name (with extension) from file path or url
 * @param path
 * @returns {string}
 */
const getFullFilename = (path) => {
    if (typeof path === 'string') {
        let _path = path;

        // In case of remote media, check if the url would be valid one
        if (path.includes('http') && !isValidUrl(path)) {
            return INCORRECT_INPUT_PATH;
        }

        // In case of url, check if it ends with "/" and do not consider it furthermore
        if (_path[_path.length - 1] === '/')
            _path = _path.substring(0, path.length - 1);

        const array = _path.split('/');
        return array.length > 1 ? array[array.length - 1] : INCORRECT_INPUT_PATH;
    } return INCORRECT_INPUT_PATH;
};

/**
 * Extract file name from file path or url
 * @param path
 * @returns {string}
 */
const getFilename = (path) => {
    const fullFilename = getFullFilename(path);
    if (!isFileNameError(fullFilename)) {
        const array = fullFilename.split('.');
        return array.length > 1
            ? array.slice(0, -1).join('')
            : array.join('');
    } return fullFilename;
};

/**
 * Extract extension from file path or url
 * @param path
 * @param type 'audio' | 'video'
 * @returns {string}
 */
const getExtension = (path, type) => {
    let extension;
    const fullFilename = getFullFilename(path);
    if (!isFileNameError(fullFilename)) {
        const array = fullFilename.split('.');

        // Check if array contains .something
        if (array.length > 1) {
            extension = array[array.length - 1];
            return isMediaExtensionCorrect(extension, type)
                ? extension
                : (type === 'audio' ? DEFAULT_AUDIO_EXTENSION : DEFAULT_VIDEO_EXTENSION);
        }
        return type === 'audio' ? DEFAULT_AUDIO_EXTENSION : DEFAULT_VIDEO_EXTENSION;
    } return extension;
};

/**
 * Perform operation based on options and return correspondent ffmpeg setting
 * @param quality: QUALITY
 * @param speed: SPEED
 * @returns {{"-crf": string,"-preset": string}}
 */
const getCompressionOptionsResolution = (quality, speed) => ({
    "-crf": quality === QUALITY.LOW ? '28' : quality === QUALITY.MEDIUM ? '23' : '18',
    "-preset": speed === SPEED.SLOW ? 'veryslow' : speed === SPEED.NORMAL ? 'medium' : 'fast'
});

/**
 * Check options for various operation
 * @param options
 * @param operation
 * @param mediaType
 * @returns {{message: string, isCorrect: boolean}}
 */
const isOptionsValueCorrect = (options, operation, mediaType = 'video') => {
    if (options) {
        if (typeof options !== 'object') {
            return {
                isCorrect: false,
                message: 'Parameter "options" must be an object'
            }
        }

        if (options.extension) {
            // Check if the type of extension is correct
            if (typeof options.extension !== 'string') {
                return {
                    isCorrect: false,
                    message: `Parameter force should be a string. ${typeof options.extension} given`
                };
            }

            // Check if extension follows this pattern '.extension' or 'extension'
            if (/^\.?\w+$/.test(options.extension)) {
                // Remove the dot if the present
                options.extension = options.extension.replace(/^\.?(\w+)$/, '$1');

                // if  operation is extract Audio, we compare the extension with audio .
                if (operation === "extractAudio") {
                  if (!isMediaExtensionCorrect(options.extension, "audio")) {
                    const extensionList = mediaType === 'audio' ? AUDIO_EXTENSIONS : VIDEO_EXTENSIONS;
                    return {
                        isCorrect: false,
                        message: `Unknown extension ${options.extension}. Please provide one of [` +
                            extensionList.map(item => `"${item}"`).join(', ') + ']'
                    };
                  } else {
                    return {
                      isCorrect: true,
                    }
                  }
                }

                // Check if extension is correct according to extension list

                if (!isMediaExtensionCorrect(options.extension, mediaType)) {
                    const extensionList = mediaType === 'audio' ? AUDIO_EXTENSIONS : VIDEO_EXTENSIONS;
                    return {
                        isCorrect: false,
                        message: `Unknown extension ${options.extension}. Please provide one of [` +
                            extensionList.map(item => `"${item}"`).join(', ') + ']'
                    };
                }
            } else {
                return {
                    isCorrect: false,
                    message: `Malformed extension. Found ${options.extension} instead of this pattern: '.extension' or 'extension'`
                };
            }
        }

        switch (operation) {
            case 'compress':
                if (mediaType === 'video') {
                    if (options.quality &&
                        !(QUALITY.getStaticValueList().includes(options.quality))) {
                        return {
                            isCorrect: false,
                            message: 'Incorrect option "quality". Please provide one of [' +
                                QUALITY.getStaticValueList().map(item => `"${item}"`).join(', ') + ']'
                        };
                    }
                    if (options.speed &&
                        !(SPEED.getStaticValueList().includes(options.speed))) {
                        return {
                            isCorrect: false,
                            message: 'Incorrect option "speed". Please provide one of [' +
                                SPEED.getStaticValueList().map(item => `"${item}"`).join(', ') + ']'
                        };
                    }
                }
                break;
            case 'cut':
                if (!timeRegex.test(options.from)) {
                    return {
                        isCorrect: false,
                        message: 'Incorrect option "from". Please provide a valid one matching hh:mm:ss'
                    };
                }
                if (!timeRegex.test(options.to)) {
                    return {
                        isCorrect: false,
                        message: 'Incorrect option "to". Please provide a valid one matching hh:mm:ss'
                    };
                }
                break;
            case 'adjustVolume':
                if (typeof options.rate !== 'number') {
                    return {
                        isCorrect: false,
                        message: `Parameter rate should be a number. ${typeof options.rate} given`
                    };
                }

                if (options.rate < 0) {
                    return {
                        isCorrect: false,
                        message: `Parameter rate should be greater than or equal 0. Found ${typeof options.rate}`
                    };
                }

                break;
            default: return {
                isCorrect: true,
                message: ''
            };
        }
    }

    return {
        isCorrect: true,
        message: ''
    };
};

/**
 * Convert time to milliseconds
 * @param seconds
 * @param minutes
 * @param hours
 */
const timeToMilliseconds = (seconds = 0, minutes = 0, hours = 0) => {
    return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
};

/**
 * Convert time fom string to milliseconds
 * @param time in hh:mm:ss format
 */
const timeStringToMilliseconds = (time) => {
    if (typeof time === 'string' && timeRegex.test(time)) {
        const array = time.split(':').map(i => Number(i));
        return ((array[0] * 60 * 60) + (array[1] * 60) + array[2]) * 1000;
    }

    return NaN;
};

/**
 * Convert milliseconds to time
 * From stackoverflow https://stackoverflow.com/a/19700358/12458141
 * @param duration
 * @returns {string}
 */
const millisecondsToTime = (duration) => {
    let milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours === "00"
        ? minutes + ":" + seconds
        : hours + ":" + minutes + ":" + seconds;
};

/**
 * Check if a given url is valid
 * @param url
 * @returns {boolean}
 */
const isValidUrl = url => /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url);

export {
    isValidUrl,
    getFilename,
    getExtension,
    isRemoteMedia,
    isFileNameError,
    millisecondsToTime,
    timeToMilliseconds,
    isOptionsValueCorrect,
    timeStringToMilliseconds,
    getCompressionOptionsResolution
}
