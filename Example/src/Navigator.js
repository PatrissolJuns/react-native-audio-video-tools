import * as React from 'react';
import VideoScreen from './Video/VideoScreen';
import AudioScreen from './AudioScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import Result from "./Result";
import {ROUTES} from "./utils";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

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
            <Stack.Navigator>
                <Stack.Screen
                    name={ROUTES.HOME}
                    component={HomeScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name={ROUTES.RESULT}
                    component={Result}
                    options={{
                        headerStyle: {
                            backgroundColor: '#3295e8',
                        },
                        headerTitleStyle: {
                            color: '#fff'
                        },
                        headerTintColor: '#fff'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
