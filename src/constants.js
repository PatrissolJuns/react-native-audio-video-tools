import PRESET from "./enums/Preset";
import QUALITY from "./enums/Quality";

const INCORRECT_INPUT_PATH = 'Incorrect input path. Please provide a valid one';
const INCORRECT_OUTPUT_PATH = 'Incorrect output path. Please provide a valid one';
const ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE = 'An error occur while generating output file';
const ERROR_WHILE_GETTING_INPUT_DETAILS = 'An error occur while getting input file details. Please check your input file details';

// Source: https://en.wikipedia.org/wiki/Bit_rate#Other_audio
const AUDIO_BITRATE = [256, 192, 160, 128, 96, 64, 32];

const DEFAULT_COMPRESS_VIDEO_OPTIONS = {
    quality: QUALITY.MEDIUM,
    speed: PRESET.VERY_SLOW,
};

const DEFAULT_COMPRESS_AUDIO_OPTIONS = {
    bitrate: '96k',
    quality: QUALITY.MEDIUM,
};

const DEFAULT_AUDIO_EXTENSION = 'mp3';
const DEFAULT_VIDEO_EXTENSION = 'mp4';

const DEFAULT_EXTRACT_AUDIO_OPTIONS = {
    extension: DEFAULT_AUDIO_EXTENSION,
};

const AUDIO_EXTENSIONS = [
    "wav",
    "bwf",
    "raw",
    "aiff",
    "flac",
    "m4a",
    "pac",
    "tta",
    "wv",
    "ast",
    "aac",
    "mp2",
    "mp3",
    "mp4",
    "amr",
    "s3m",
    "3gp",
    "act",
    "au",
    "dct",
    "dss",
    "gsm",
    "m4p",
    "mmf",
    "mpc",
    "ogg",
    "oga",
    "opus",
    "ra",
    "sln",
    "vox"
];

const VIDEO_EXTENSIONS = [
    "3g2",
    "3gp",
    "aaf",
    "asf",
    "avchd",
    "avi",
    "drc",
    "flv",
    "m2v",
    "m4p",
    "m4v",
    "mkv",
    "mng",
    "mov",
    "mp2",
    "mp4",
    "mpe",
    "mpeg",
    "mpg",
    "mpv",
    "mxf",
    "nsv",
    "ogg",
    "ogv",
    "qt",
    "rm",
    "rmvb",
    "roq",
    "svi",
    "vob",
    "webm",
    "wmv",
    "yuv"
];

export {
    AUDIO_BITRATE,
    AUDIO_EXTENSIONS,
    VIDEO_EXTENSIONS,
    INCORRECT_INPUT_PATH,
    INCORRECT_OUTPUT_PATH,
    DEFAULT_AUDIO_EXTENSION,
    DEFAULT_VIDEO_EXTENSION,
    DEFAULT_EXTRACT_AUDIO_OPTIONS,
    DEFAULT_COMPRESS_AUDIO_OPTIONS,
    DEFAULT_COMPRESS_VIDEO_OPTIONS,
    ERROR_WHILE_GETTING_INPUT_DETAILS,
    ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE
}
