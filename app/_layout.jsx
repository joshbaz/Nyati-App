// import MainNavigator from "./src/components/Navigation/MainNavigator"
import * as Font from "expo-font"
import { Slot } from "expo-router"
import * as ScreenOrientation from "expo-screen-orientation"
import React, { useEffect, useState } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Provider as PaperProvider } from "react-native-paper"
import { RootSiblingParent } from "react-native-root-siblings"
import { SafeAreaProvider } from "react-native-safe-area-context"
import AuthProvider from "../context/AuthProvider"
import MembershipProvider from "../context/MembershipProvider"
import ToastProvider from "../context/ToastProvider"
import SplashScreen from "../src/components/SplashScreen"

function useLoadFonts() {
  const [loaded, setLoaded] = useState(false)

  const customFonts = {
    "Inter-Black": require("../assets/Fonts/Inter/static/Inter-Black.ttf"),
    "Inter-Bold": require("../assets/Fonts/Inter/static/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("../assets/Fonts/Inter/static/Inter-ExtraBold.ttf"),
    "Inter-ExtraLight": require("../assets/Fonts/Inter/static/Inter-ExtraLight.ttf"),
    "Inter-Light": require("../assets/Fonts/Inter/static/Inter-Light.ttf"),
    "Inter-Medium": require("../assets/Fonts/Inter/static/Inter-Medium.ttf"),
    "Inter-Regular": require("../assets/Fonts/Inter/static/Inter-Regular.ttf"),
    "Inter-SemiBold": require("../assets/Fonts/Inter/static/Inter-SemiBold.ttf"),
    "Inter-Thin": require("../assets/Fonts/Inter/static/Inter-Thin.ttf"),
    /** roboto */
    "Roboto-Black": require("../assets/Fonts/Roboto/Roboto-Black.ttf"),
    "Roboto-BlackItalic": require("../assets/Fonts/Roboto/Roboto-BlackItalic.ttf"),
    "Roboto-Bold": require("../assets/Fonts/Roboto/Roboto-Bold.ttf"),
    "Roboto-BoldItalic": require("../assets/Fonts/Roboto/Roboto-BoldItalic.ttf"),
    "Roboto-Italic": require("../assets/Fonts/Roboto/Roboto-Italic.ttf"),
    "Roboto-Light": require("../assets/Fonts/Roboto/Roboto-Light.ttf"),
    "Roboto-LightItalic": require("../assets/Fonts/Roboto/Roboto-LightItalic.ttf"),
    "Roboto-Medium": require("../assets/Fonts/Roboto/Roboto-Medium.ttf"),
    "Roboto-MediumItalic": require("../assets/Fonts/Roboto/Roboto-MediumItalic.ttf"),
    "Roboto-Regular": require("../assets/Fonts/Roboto/Roboto-Regular.ttf"),
    "Roboto-Thin": require("../assets/Fonts/Roboto/Roboto-Thin.ttf"),
    "Roboto-ThinItalic": require("../assets/Fonts/Roboto/Roboto-ThinItalic.ttf"),
  }

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync(customFonts)
      //Text.defaultProps.style.fontFamily = 'Inter-Regular';
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      )
      setTimeout(() => {
        setLoaded(true)
      }, 5000)
    }

    loadFont()
  }, [])
  return { loaded }
}

function RootLayout() {
  const { loaded } = useLoadFonts()

  if (!loaded) {
    return <SplashScreen />
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <RootSiblingParent>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ToastProvider>
              <AuthProvider>
                <MembershipProvider>
                  <Slot initialRouteName='index' />
                </MembershipProvider>
              </AuthProvider>
            </ToastProvider>
          </GestureHandlerRootView>
        </RootSiblingParent>
      </PaperProvider>
    </SafeAreaProvider>
  )
}

export default RootLayout
