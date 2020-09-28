import QUALITY from "./enums/Quality";
import PRESET from "./enums/Preset";

const INCORRECT_INPUT_PATH = 'Incorrect input path. Please provide a valid one';
const INCORRECT_OUTPUT_PATH = 'Incorrect output path. Please provide a valid one';
const ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE = 'An error occur while generating output file';

const DEFAULT_COMPRESS_OPTIONS = {
    quality: QUALITY.MEDIUM,
    speed: PRESET.VERY_SLOW,
};

const DEFAULT_EXTRACT_AUDIO_OPTIONS = {
    extension: 'mp3',
};

export {
    INCORRECT_INPUT_PATH,
    INCORRECT_OUTPUT_PATH,
    DEFAULT_COMPRESS_OPTIONS,
    DEFAULT_EXTRACT_AUDIO_OPTIONS,
    ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE
}
