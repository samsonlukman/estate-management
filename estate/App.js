import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PropertyDisplayScreen from './screens/PropertyDisplayScreen';
import PropertyDetailScreen from './screens/PropertyDetailScreen';
import LoginScreen from './screens/LoginScreen';
import SearchScreen from './screens/SearchScreen';
import Favorites from './screens/Favorites';
import AccountScreen from './screens/AccountScreen';
import UserRegistrationForm from './screens/UserRegistrationForm';
import UploadPropertyScreen from './screens/UploadPropertyScreen';
import UploadBuildingScreen from './screens/UploadBuildingScreen';
import UploadLandScreen from './screens/UploadLandScreen';
import { AuthProvider } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainStack = () => {
  return (
    <AuthProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={PropertyDisplayScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true }} />
        <Stack.Screen name="UserRegistrationForm" component={UserRegistrationForm} options={{ headerShown: true }} />
        <Stack.Screen name="UploadProperty" component={UploadPropertyScreen} options={{ headerShown: true }} />
        <Stack.Screen name="UploadBuilding" component={UploadBuildingScreen} options={{ headerShown: true }} />
        <Stack.Screen name="UploadLand" component={UploadLandScreen} options={{ headerShown: true }} />
      </Stack.Navigator>
    </AuthProvider>
  );
};


const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
      <Tab.Navigator>
        <Tab.Screen name="Properties" component={MainStack} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Favorites" component={Favorites} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
