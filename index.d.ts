/**
 * typescript definition
 * @author Patrissol Kenfack
 */
declare module "react-native-audio-video-tools" {
    import {MediaInformation} from "react-native-ffmpeg";
    enum Preset {
        VERY_SLOW = 'veryslow',
        SLOWER = 'slower',
        SLOW = 'slow',
        MEDIUM = 'medium',
        FAST = 'fast',
        FASTER = 'faster',
        VERY_FAST = 'veryfast',
        SUPER_FAST = 'superfast',
        ULTRA_FAST = 'ultrafast',
    }
    enum Quality {
        LOW = 'low',
        HIGH = 'high',
        MEDIUM = 'medium',
    }
    type CompressVideo = {
        bitrate?: string;
        quality?: Quality;
        speed?: Preset;
        outputFile?: string;
    }

    type CorrectInputFile = {
        isCorrect: boolean;
        message: string;
    }

    type AnotherMediaInformation = {
        size: number;
        width: number;
        height: number;
    }

    type MediaDetails = MediaInformation & AnotherMediaInformation;

    export class VideoTools {
        // Property
        mediaDetails: null | MediaDetails;

        /**
         * Update a video path
         */
        setVideoPath: (videoPath: string) => void;

        /**
         * Return boolean to indicate whether input file is correct or not
         */
        hasCorrectInputFile: () => boolean;

        /**
         * Return object including error message in case input file is incorrect
         * @returns {{message: string, isCorrect: boolean}}
         */
        isInputFileCorrect: () => CorrectInputFile;

        /**
         * Compress video according to parameters
         */
        compress: (options: CompressVideo) => Promise<{rc: number, outputFile: string}>;

        /**
         * Retrieve details about a video file
         */
        getDetails:(force: boolean) => Promise<MediaDetails>;

        /**
         * Run a command
         */
        execute: (command: string) => Promise<{rc: number}>;
    }
}
