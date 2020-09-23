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

    export class VideoTools {
        compress:(options: CompressVideo) => Promise<{rc: number, outputFile: string}>;

        /**
         * Retrieve information about a video file
         */
        getInformation:() => Promise<MediaInformation>;

        execute: (command: String) => Promise<{rc: number}>;
    }
}
