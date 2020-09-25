const ITEMS_PER_ROW = 4;

const COLORS = {
    'Jade': '#07BC74',
    'Summer Sky': '#3295e8',
    'Turquoise Blue': '#5FD3EF',
    'Medium Slate Blue': '#8868f0',
    'Rose Bud': '#ffa59c',
    'Haiti': '#292631',
    'Persimmon': '#ed5301',
    'Cadet Blue': '#579d9a',
    'Jelly Bean': '#467f8b',
    'Gamboge': '#f39c0f',
    'Madison': '#2c3e50',
    'Sandal': '#a5886b',
    'Kimberly': '#7b6c8e',
    'Indigo': '#3F048C',
    'Coral Red': '#ff4653',
    'Medium Red Violet': '#BD3381',
    "Purple": "#800080",
    "White": "#ffffff",
};

const PRIMARY_COLOR = COLORS["Summer Sky"];
const SECONDARY_COLOR = COLORS["Turquoise Blue"];

const ROUTES = {
    RESULT: 'Result',
    HOME: 'HOME',
    VIDEO: 'Video',
    AUDIO: 'Audio'
};

/**
 * Convert bytes to Bytes, KB, MB, ...
 * From stackoverflow https://stackoverflow.com/a/18650828/12458141
 * @param bytes
 * @param decimals
 * @returns {string}
 */
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Convert millisecond to time
 * From stackoverflow https://stackoverflow.com/a/19700358/12458141
 * @param duration
 * @returns {string}
 */
const msToTime = (duration) => {
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
    COLORS,
    ROUTES,
    ITEMS_PER_ROW,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
    formatBytes,
    msToTime,
}
