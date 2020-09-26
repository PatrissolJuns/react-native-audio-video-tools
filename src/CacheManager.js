import { NativeModules } from 'react-native';
const { RNAudioVideoTools } = NativeModules;

/**
 * Generate a cache file
 * @param extension
 * @returns {Promise<any>}
 */
const generateFile = (extension) => {
    return new Promise((resolve, reject) => {
        RNAudioVideoTools.generateFile(extension)
            .then(result => resolve('file://' + result))
            .catch(error => reject(error));
    });
};

export {
    generateFile
}
