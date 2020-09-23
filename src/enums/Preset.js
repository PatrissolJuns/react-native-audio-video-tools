import BaseEnum from './BaseEnum';

export default class Preset extends BaseEnum
{
    static VERY_SLOW = 'veryslow';
    static SLOWER = 'slower';
    static SLOW = 'slow';
    static MEDIUM = 'medium';
    static FAST = 'fast';
    static FASTER = 'faster';
    static VERY_FAST = 'veryfast';
    static SUPER_FAST = 'superfast';
    static ULTRA_FAST = 'ultrafast';
}
