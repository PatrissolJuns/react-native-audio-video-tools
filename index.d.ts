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

    export type MediaDefaultParameters = {
        extension?: string;
        outputFilePath?: string;
    }

    export type AdjustVolume = {
        rate: number;
    } & MediaDefaultParameters;

    export type CompressVideo = {
        speed?: Preset;
        bitrate?: string;
        quality?: Quality;
    } & MediaDefaultParameters;

    export type CompressAudio = {
        bitrate?: string;
        quality?: Quality;
    } & MediaDefaultParameters;

    export type ConvertTo = {
        extension: string;
        outputFilePath?: string;
    }

    export type CutMedia = {
        to: string;
        from: string;
        outputFilePath?: string;
    };

    export type CorrectInputFile = {
        isCorrect: boolean;
        message: string;
    }

    type AnotherMediaInformation = {
        size: number;
        width?: number;
        height?: number;
        filename: string;
        extension: string;
        isRemoteMedia: null | boolean;
    }

    export type MediaDetails = MediaInformation & AnotherMediaInformation;

    export type MediaDefaultResponse = Promise<{rc: number, outputFilePath: string}>;

    class Media {
        // Property
        isRemoteMedia: null | boolean;

        /**
         * Update media input file with a full path
         */
        setMediaFullPath: (mediaFullPath: string) => void;

        /**
         * Indicate whether input file is correct or not
         * Return object including error message in case input file is incorrect
         * @returns {{message: string, isCorrect: boolean}}
         */
        isInputFileCorrect: () => Promise<CorrectInputFile>;

        /**
         * Retrieve details about a video file
         */
        getDetails: (force: boolean) => Promise<MediaDetails | any>;

        /**
         * Convert a video to another extension
         */
        convertTo: (options: ConvertTo) => MediaDefaultResponse;

        /**
         * Cut video
         */
        cut: (options: CutMedia) => MediaDefaultResponse;

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
        compress: (options: CompressVideo) => MediaDefaultResponse;

        /**
         * Extract audio from video
         */
        extractAudio: (options: MediaDefaultParameters) => MediaDefaultResponse;
    }

    export class AudioTools extends Media {
        /**
         * Compress an audio
         */
        compress: (options: CompressAudio) => MediaDefaultResponse;

        /**
         * Adjust volume of an audio
         */
        adjustVolume: (options: AdjustVolume) => MediaDefaultResponse;
    }
}
