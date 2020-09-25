import React from 'react';
import { StatusBar } from 'react-native';
import Navigator from "./src/Navigator";
import {RootSiblingParent} from 'react-native-root-siblings';

const App = () => {
  return (
    <RootSiblingParent>
      <StatusBar barStyle="dark-content" />
      <Navigator />
    </RootSiblingParent>
  );
};

export default App;
