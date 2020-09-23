
# react-native-audio-video-tools

## Getting started

`$ npm install react-native-audio-video-tools --save`

### Mostly automatic installation

`$ react-native link react-native-audio-video-tools`

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
import RNAudioVideoTools from 'react-native-audio-video-tools';

// TODO: What to do with the module?
RNAudioVideoTools;
```
  