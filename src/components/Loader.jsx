import React, { useEffect } from "react"
import { LayoutAnimation, Platform, View } from "react-native"
import SplashScreen from "../components/SplashScreen"

function Loader({ isLoading, children }) {
  useEffect(() => {
    if (Platform.OS === "android") {
      LayoutAnimation.Presets.linear.duration = 1000 // Adjust animation duration for Android
    }
  }, [])

  const renderContent = () => children

  return isLoading ? (
    <View>
      <SplashScreen hideLogo={true} />
    </View>
  ) : (
    renderContent()
  )
}

export default Loader
