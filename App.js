import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/components/SplashScreen';
import { Provider as PaperProvider } from "react-native-paper";
import MainNavigator from './src/components/Navigation/MainNavigator';
import * as Font from 'expo-font'

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false); 

  const customFonts = {
    "Inter-Black": require("./assets/Fonts/Inter/static/Inter-Black.ttf"),
    "Inter-Bold": require("./assets/Fonts/Inter/static/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("./assets/Fonts/Inter/static/Inter-ExtraBold.ttf"),
    "Inter-ExtraLight": require("./assets/Fonts/Inter/static/Inter-ExtraLight.ttf"),
    "Inter-Light": require("./assets/Fonts/Inter/static/Inter-Light.ttf"),
    "Inter-Medium": require("./assets/Fonts/Inter/static/Inter-Medium.ttf"),
    "Inter-Regular": require("./assets/Fonts/Inter/static/Inter-Regular.ttf"),
    "Inter-SemiBold": require("./assets/Fonts/Inter/static/Inter-SemiBold.ttf"),
    "Inter-Thin": require("./assets/Fonts/Inter/static/Inter-Thin.ttf"),
    /** roboto */
    "Roboto-Black": require("./assets/Fonts/Roboto/Roboto-Black.ttf"),
    "Roboto-BlackItalic": require("./assets/Fonts/Roboto/Roboto-BlackItalic.ttf"),
    "Roboto-Bold": require("./assets/Fonts/Roboto/Roboto-Bold.ttf"),
    "Roboto-BoldItalic": require("./assets/Fonts/Roboto/Roboto-BoldItalic.ttf"),
    "Roboto-Italic": require("./assets/Fonts/Roboto/Roboto-Italic.ttf"),
    "Roboto-Light": require("./assets/Fonts/Roboto/Roboto-Light.ttf"),
    "Roboto-LightItalic": require("./assets/Fonts/Roboto/Roboto-LightItalic.ttf"),
    "Roboto-Medium": require("./assets/Fonts/Roboto/Roboto-Medium.ttf"),
    "Roboto-MediumItalic": require("./assets/Fonts/Roboto/Roboto-MediumItalic.ttf"),
    "Roboto-Regular": require("./assets/Fonts/Roboto/Roboto-Regular.ttf"),
    "Roboto-Thin": require("./assets/Fonts/Roboto/Roboto-Thin.ttf"),
    "Roboto-ThinItalic": require("./assets/Fonts/Roboto/Roboto-ThinItalic.ttf"),
  };

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync(customFonts)
      //Text.defaultProps.style.fontFamily = 'Inter-Regular';
      setTimeout(()=>{setFontLoaded(true)}, 5000)
      
    }

    loadFont();
  }, [])
  
  if (!fontLoaded) {
    return (
      <SafeAreaProvider>
        <SplashScreen></SplashScreen>
      </SafeAreaProvider>
    );
    
    
  }
  return (
    <SafeAreaProvider>
      <PaperProvider>
        
        <MainNavigator/> 
      </PaperProvider>
   
    </SafeAreaProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
