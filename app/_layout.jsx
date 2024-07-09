// import MainNavigator from "./src/components/Navigation/MainNavigator"
import * as Font from "expo-font"
import { Stack, router, useSegments } from "expo-router"

import React, { useEffect, useState } from "react"
import { Provider as PaperProvider } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"

import AuthProvider, { useAuth } from "../context/AuthProvider"
import SplashScreen from "../src/components/SplashScreen"

function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        {/* <MainNavigator /> */}
        <AuthProvider>
          <AppStacks />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  )
}

function AppStacks() {
  const { isAuthenticated, isFetching } = useAuth()
  const [fontLoaded, setFontLoaded] = useState(false)

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
      setTimeout(() => {
        setFontLoaded(true)
      }, 5000)
    }

    loadFont()
  }, [])

  useEffect(() => {
    if (fontLoaded && isAuthenticated) {
      router.push("home")
    }
  }, [isAuthenticated, isFetching, fontLoaded])

  if (!fontLoaded || isFetching) {
    return (
      <SafeAreaProvider>
        <SplashScreen />
      </SafeAreaProvider>
    )
  }

  if (isAuthenticated && !isFetching) {
    return (
      <Stack>
        <Stack.Screen name='home' options={{ headerShown: false }} />
      </Stack>
    )
  }

  // return auth stack & landing page screen
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='auth' options={{ headerShown: false }} />
    </Stack>
  )
}

export default RootLayout