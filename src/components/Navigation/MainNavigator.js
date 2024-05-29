import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignIn from '../../screens/1AuthScreens/SignIn'
import Register from '../../screens/1AuthScreens/Register'
import VerifyAccount from '../../screens/1AuthScreens/VerifyAccount'
import RegisterSuccess from '../../screens/1AuthScreens/RegisterSuccess'
import Home from '../../screens/2MainScreens/Home'
import WatchFilm from '../../screens/2MainScreens/WatchFilm'
import FilmDetails from '../../screens/2MainScreens/FilmDetails'
import Donate from '../../screens/3PaymentScreens/Donate'
import PaymentOptions from '../../screens/3PaymentScreens/PaymentOptions'
import PaymentComplete from '../../screens/3PaymentScreens/PaymentComplete'
const Stack = createNativeStackNavigator()
const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signin">
        <Stack.Screen
          name="Signin"
          component={SignIn}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="VerifyAccount"
          component={VerifyAccount}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="RegisterSuccess"
          component={RegisterSuccess}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="WatchFilm"
          component={WatchFilm}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="FilmDetails"
          component={FilmDetails}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="Donate"
          component={Donate}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="PaymentOptions"
          component={PaymentOptions}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="PaymentComplete"
          component={PaymentComplete}
          options={{ header: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator

const styles = StyleSheet.create({})