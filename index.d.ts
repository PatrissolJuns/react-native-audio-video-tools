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

    type DefaultParameters = {
        extension?: string;
        outputFilePath?: string;
    }

    type Cut = {
        to: string;
        from: string;
        outputFilePath?: string;
    }

    type CorrectInputFile = {
        isCorrect: boolean;
        message: string;
    }

    type AnotherMediaInformation = {
        size: number;
        width?: number;
        height?: number;
        extension: string;
    }

    export type MediaDetails = MediaInformation & AnotherMediaInformation;

    type DefaultResponse = Promise<{rc: number, outputFilePath: string}>;

    class Media {
        // Property
        mediaDetails: null | MediaDetails;

        /**
         * Update media input file with a full path
         */
        setMediaFullPath: (mediaFullPath: string) => void;

        /**
         * Indicate whether input file is correct or not
         * Return object including error message in case input file is incorrect
         * @returns {{message: string, isCorrect: boolean}}
         */
        isInputFileCorrect: () => CorrectInputFile;

        /**
         * Retrieve details about a video file
         */
        getDetails:(force: boolean) => Promise<MediaDetails>;

        /**
         * Convert a video to another extension
         */
        convertTo: (options: DefaultParameters) => DefaultResponse;

        /**
         * Cut video
         */
        cut: (options: Cut) => DefaultResponse;

        /**
         * Run a command
         */
        static execute: (command: string) => Promise<{rc: number}>;

        /**
         * Cancel ongoing command
         */
        static cancel: () => void;
    }

    export class VideoTools extends Media {
        /**
         * Compress video
         */
        compress: (options: CompressVideo) => DefaultResponse;

        /**
         * Extract audio from video
         */
        extractAudio: (options: DefaultParameters) => DefaultResponse;
    }

    export class AudioTools extends Media {
    }
}
