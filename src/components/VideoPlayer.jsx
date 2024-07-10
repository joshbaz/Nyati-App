import { ResizeMode, Video } from "expo-av"
import { useRouter } from "expo-router"
import * as ScreenOrientation from "expo-screen-orientation"

import { forwardRef, useEffect, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { BallIndicator } from "react-native-indicators"
import { SafeAreaView } from "react-native-safe-area-context"

import { Feather } from "@expo/vector-icons"

import { COLORS } from "../color/VariableColors"

const { width } = Dimensions.get("window")

const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

const VideoPlayer = forwardRef(({ source, type }, ref) => {
  const video = useRef(null)
  const router = useRouter()
  //   const [isPlaying, setIsPlaying] = useState(true)
  const [status, setStatus] = useState({})
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const onFullscreenUpdate = async ({ fullscreenUpdate }) => {
    switch (fullscreenUpdate) {
      case (0, 1):
        await ScreenOrientation.unlockAsync() // only on Android required
        break
      case (2, 3):
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT,
        ) // only on Android required
        break
    }
  }

  useEffect(() => {
    if (status?.isBuffering) {
      console.log("status buffering")
    }
  }, [status?.isBuffering])

  const sourceOpts = {
    uri: source,
  }

  if (Platform.OS === "android") {
    sourceOpts.headers = {
      Range: "bytes=0-",
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: 397,
        width: "100%",
        backgroundColor: "black",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={{
            width: width,
            height: "100%",
            backgroundColor: "black",
            position: "relative",
          }}
        >
          {isLoading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 10,
                width: "100%",
                height: "100%",
                backgroundColor: COLORS.generalOpacity2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Animated.View
                style={{
                  position: "relative",
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BallIndicator color='#ED3F62' count={9} />
              </Animated.View>
            </View>
          )}
          <Video
            ref={ref}
            style={{ flex: 1 }}
            source={sourceOpts}
            isLooping
            useNativeControls
            onProgress={(progress) => {
              setProgress(progress)
            }}
            resizeMode={ResizeMode.CONTAIN}
            onFullscreenUpdate={onFullscreenUpdate}
            onError={(error) => console.error("AV Error", error)}
            onPlaybackStatusUpdate={(status) => setStatus(status)}
            onLoad={() => {
              setIsLoading(false)
            }}
            onLoadStart={() => {
              console.log("loading into memory...")
            }}
          />
        </View>

        <View style={styles.arrowBackBtn}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name='arrow-left-circle' size={30} color='white' />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
})

export default VideoPlayer

const styles = StyleSheet.create({
  trailerBtnWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  trailerBtn: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 229, 234, 0.33)",
    height: 52,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#980F2A",
    position: "absolute",

    bottom: 23,
  },
  btnText: {
    fontFamily: "Roboto-Bold",
    color: "white",
    fontSize: 16,
    letterSpacing: 0.1,
  },
  videoTitleWrap: {
    position: "absolute",
    left: 80,
    top: 10,
  },
  videoTitle: {
    color: "#ffffff",
    fontSize: 20,
  },
  arrowBackBtn: {
    color: "#ffffff",
    position: "absolute",
    top: 20,
    left: 20,
  },
})
