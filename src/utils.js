import { INCORRECT_INPUT_PATH } from './constants';
import PRESET from './enums/Preset';
import QUALITY from './enums/Quality';

// regex to format string time hh:mm:ss
const timeRegex = /\d\d:\d\d:\d\d/;

/**
 * Extract extension from file url
 * @param path
 * @returns {string}
 */
const getExtension = (path) => {
    if (typeof path === 'string') {
        const array = path.split('.');
        return array[array.length - 1] ? array[array.length - 1] : INCORRECT_INPUT_PATH;
    } return INCORRECT_INPUT_PATH;
};

/**
 * Perform operation based on options and return correspondent ffmpeg setting
 * @param quality
 * @returns {{"-crf": string}}
 */
const getCompressionOptionsResolution = (quality) => {
    let _quality;

    const result = {
        "-crf": "",
    };

    switch (quality) {
        case QUALITY.HIGH:
            _quality = 14;
            break;
        case QUALITY.MEDIUM:
            _quality = 18;
            break;
        case QUALITY.LOW:
            _quality = 22;
            break;
        default: _quality = 14;
    }

    result["-crf"] = _quality.toString();

    return result;
};

/**
 * Check options for various operation
 * @param options
 * @param operation
 * @returns {{message: string, isCorrect: boolean}}
 */
const isOptionsValueCorrect = (options, operation) => {
    if (options) {
        switch (operation) {
            case 'compress':
                if (options.quality &&
                    !(QUALITY.getStaticValueList().includes(options.quality))) {
                    return {
                        isCorrect: false,
                        message: 'Incorrect option "quality". Please provide one of [' +
                            QUALITY.getStaticValueList().map(item => `"${item}"`).join(', ') + ']'
                    };
                }
                if (options.speed &&
                    !(PRESET.getStaticValueList().includes(options.speed))) {
                    return {
                        isCorrect: false,
                        message: 'Incorrect option "speed". Please provide one of [' +
                            PRESET.getStaticValueList().map(item => `"${item}"`).join(', ') + ']'
                    };
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

export {
    getExtension,
    millisecondsToTime,
    timeToMilliseconds,
    isOptionsValueCorrect,
    timeStringToMilliseconds,
    getCompressionOptionsResolution
}
