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
        speed?: Preset;
        bitrate?: string;
        quality?: Quality;
        outputFilePath?: string;
    }

    type ExractAudio = {
        extension?: string;
        outputFilePath?: string;
    }

    type CorrectInputFile = {
        isCorrect: boolean;
        message: string;
    }

    type AnotherMediaInformation = {
        size: number;
        width: number;
        height: number;
        extension: string;
    }

    type MediaDetails = MediaInformation & AnotherMediaInformation;

    type DefaultResponse = Promise<{rc: number, outputFilePath: string}>;

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
         * Retrieve details about a video file
         */
        getDetails:(force: boolean) => Promise<MediaDetails>;

        /**
         * Compress video according to parameters
         */
        compress: (options: CompressVideo) => DefaultResponse;

        /**
         * Extract audio from video
         */
        extractAudio: (options: ExractAudio) => DefaultResponse;

        /**
         * Run a command
         */
        static execute: (command: string) => Promise<{rc: number}>;

        /**
         * Cancel ongoing command
         */
        static cancel: () => void;
    }
}
