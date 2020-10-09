import * as React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Result from "./Result";
import {ROUTES} from "./utils";
import AudioScreen from './Audio/AudioScreen';
import VideoScreen from './Video/VideoScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeScreen = () => {
    return (
        <Drawer.Navigator initialRouteName={ROUTES.VIDEO}>
            <Drawer.Screen name={ROUTES.VIDEO} component={VideoScreen} />
            <Drawer.Screen name={ROUTES.AUDIO} component={AudioScreen} />
        </Drawer.Navigator>
    )
};

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name={ROUTES.HOME}
                    component={HomeScreen}
                />
                <Stack.Screen
                    name={ROUTES.RESULT}
                    component={Result}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
