
# react-native-audio-video-tools

React-native-audio-video-tools is a set of functions that allow you to easily 
perform some advanced audio and video manipulations such as cutting, extraction, compressing, etc.

Behind the scene, react-native-audio-video-tools uses FFmpeg to execute commands.

## Features

Both local and remote media are handled and it's possible to perform the following operations:

- Audio
    - File information
    - Compression
    - Trimming
    - Conversion
    - Volume adjusting
- Video
    - File information
    - Compression
    - Trimming
    - Conversion
    - Extraction of audio sound from video

**An Example app is available with almost all features implemented. You can download APK for android [here](Example/android/app/release/app-release.apk)**

<img src="gifs/example_app.gif" width="300">

## Installation

Using Yarn

```sh
yarn add react-native-audio-video-tools
```

Using Npm

```sh
npm install react-native-audio-video-tools --save
```

Then you need to install [react-native-ffmpeg](https://github.com/tanersener/react-native-ffmpeg) and choose one of eight different packages available.

### Linking (for React Native <= 0.59 only)

Note: If you are using react-native version 0.60 or higher you don't need to link this package.

```sh
react-native link react-native-audio-video-tools
```

### Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-audio-video-tools` and add `RNAudioVideoTools.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNAudioVideoTools.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNAudioVideoToolsPackage;` to the imports at the top of the file
  - Add `new RNAudioVideoToolsPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-audio-video-tools'
  	project(':react-native-audio-video-tools').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-audio-video-tools/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-audio-video-tools')
  	```

## Usage

```javascript
import {VideoTools} from 'react-native-audio-video-tools';

// Initialize a video tool
const videoTools = new VideoTools("http://techslides.com/demos/sample-videos/small.mp4");

// Get details about the video
videoTools.getDetails().then(details => {
    console.log("Size: " + details.size);
    console.log("Duration: " + details.duration);
    // Etc.
});
```

## API

This package exposes 2 main class: `AudioTools` and `VideoTools`. 
They are instantiated with a path that can be local or remote.

**Note:** Local path should be a full one with file protocol (file://)

```javascript
import {AudioTools, VideoTools} from 'react-native-audio-video-tools';

// Initialize with a remote url
const videoTools = new VideoTools("http://techslides.com/demos/sample-videos/small.mp4");

// Or initialize with a local url
const audioTools = new AudioTools("file:///storage/emulated/0/Download/my-music.mp3");

// Or use a picker and pass directly the returned path 
// but you should make that the returned path is the full path with file protocol
try {
    const res = await ImagePicker.openPicker({
        mediaType: type,
    });
    const videoTools = new VideoTools(res.path);
} catch (err) {}
```

Here's a full list of available methods of these classes

## 1. Methods available on both `AudioTools` and `VideoTools`

### getDetails(force: boolean): Promise

Return details about the current media. 

By default the result of the operation is cached so the next execution will be almost synchronous. 
However, you can force re-executing by setting force parameter to true 

#### Input

##### force: `boolean`(optional, default to `false`)
Set it to true to disabled cache.

#### Output
The promise returns a MediaDetails that contains:
- size: number; The total length of the media in **bytes**
- width: number; The width of video (**Video only**)
- height: number; The height of video (**Video only**)
- filename: string; The filename without extension
- extension: string; 
- isRemoteMedia: null | boolean; Indicate whether the media is remote or local
- format: string;
- path: string; Full path of media
- duration: number; The total duration of media in **milliseconds**
- startTime: number;
- bitrate: number;
- metadata: [string, string];
- streams: StreamInformation[];
- rawInformation: string;

---

### compress(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

#### Input
An object that represents compression's specification. It contains:

##### - quality: `low | medium | high` (optional, default to `medium`)

##### - bitrate: `string` (optional)

##### - speed: `slow | normal | fast` (**Video only**) (optional, default to `normal`)
  ***Note:*** The higher the speed, the less effective the compression is and can in some cases lead to an **opposite effect**. 

##### [- MediaDefaultParameters's property](#MediaDefaultParameters)

Example with Big Bunny video

```javascript
import {VideoTools} from 'react-native-audio-video-tools';

// Input file size ~ 9.75 MB
const videoTools = new VideoTools("https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_10MB.mp4");

// Output file size ~ 1.63 MB
await videoTools.compress({quality: 'low'});

// Output file size ~ 3.49 MB
await videoTools.compress();

// Output file size ~ 7.76 MB
await videoTools.compress({quality: 'high'});
```

You can make further test with example app.

---

### cut(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

#### Input

An object with the following properties:

##### - from: `string` Format `hh:mm:ss`
The time at which the media cut-off will begin

##### - to: `string` Format `hh:mm:ss`
The time when the media cut-off will stop 

##### - outputFilePath: `string` (See outputFilePath of [MediaDefaultParameters](#MediaDefaultParameters))

---

### convertTo(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

Convert the media to another extension

#### Input
An object with the following properties:

##### - extension: `string`
The new extension to obtain

##### - outputFilePath: `string` (See outputFilePath of [MediaDefaultParameters](#MediaDefaultParameters))

---

### setMediaFullPath(mediaFullPath: string): Void

Update the current media path

#### Input

##### - mediaFullPath: `string`
The new local or remote path

---

### isInputFileCorrect(): Promise
Check if the current media is correct it means processable 

#### Output
The promise returns an object with following properties:

##### - isCorrect: `boolean`
Indicate whether the media is correct or not

##### - message: `string`
Contains error message when the media is incorrect

---

## 2. Only `AudioTools`

### adjustVolume(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

Adjust the volume of audio by either increasing or decreasing it by the value of rate (given in option parameter)

#### Input
An object with the following properties:

##### - rate: `number`
Any number (including decimals) greater than zero

##### [- MediaDefaultParameters's property](#MediaDefaultParameters)

```javascript
import {AudioTools} from 'react-native-audio-video-tools';

// Initialize with a remote url
const audioTools = new AudioTools("https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3");

// Will create a new file with volume decreased by 50% percent of its original file
await audioTools.adjustVolume({rate: 0.5});
```

---

## 3. Only `VideoTools`

### extractAudio(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

Extract audio from video

#### Input see [MediaDefaultParameters](#MediaDefaultParameters)

**Note** By default, **mp3** is used as extension

```javascript
import {VideoTools} from 'react-native-audio-video-tools';

const videoTools = new VideoTools("http://techslides.com/demos/sample-videos/small.mp4");

try {
    const result = await videoTools.extractAudio();
    
    const extractedAudio = new AudioTools(result.outputFilePath);
    const mediaDetails = await extractedAudio.getDetails();
    console.log(mediaDetails.extension); // mp3
} catch (e) {}
```

---

## 4. Others

### MediaDefaultParameters

Default parameters shared with some methods. It contains:

##### - outputFilePath: `string`
The location where the resulting media will be saved.

- **On iOs** This option is **required** and it should be a full path.

- **On Android** This option is **optional**

    When it's not defined, a generic one will be use.

##### - extension: `string` Format `.extention` or `extension` (optional, **Android only**)
When it's set, it represents the extension of the generated output file.

**Note** If both outputFilePath and extension are given, only outputFilePath would be considered

---

### MediaDefaultResponse

Default promise result shared with some methods. It contains:

##### - rc: `number`
The status of the request which is 0 if everything went fine

##### - outputFilePath: `string`
The full path of the media created

---

## Contributing

Feel free to submit issues or pull requests.

## License

The library is released under the MIT licence. For more information see `LICENSE`.
