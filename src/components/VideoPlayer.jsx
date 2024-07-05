import { ResizeMode, Video } from "expo-av"
import { useRouter } from "expo-router"
import * as ScreenOrientation from "expo-screen-orientation"

import { useEffect, useRef, useState } from "react"
import {
  Button,
  Dimensions,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { HStack, VStack } from "@react-native-material/core"

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"

import { COLORS } from "../color/VariableColors"

const { width } = Dimensions.get("window")

const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

export default function VideoPlayer({ source, setIsPlaying }) {
  const video = useRef(null)
  const router = useRouter()
  //   const [isPlaying, setIsPlaying] = useState(true)
  const [status, setStatus] = useState({})
  const [progress, setProgress] = useState(0)

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: COLORS.generalBg,
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
          backgroundColor: COLORS.generalBg,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={{
            width: width,
            height: width * 0.9,
            backgroundColor: "black",
          }}
        >
          <Video
            ref={video}
            style={{ flex: 1 }}
            source={{
              uri: source,
            }}
            // onProgress={progress}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            onFullscreenUpdate={onFullscreenUpdate}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
          <View style={styles.buttons}>
            <View style={styles.trailerBtnWrap}>
              <TouchableOpacity
                style={styles.trailerBtn}
                onPress={() => {
                  status.isPlaying
                    ? video.current.pauseAsync()
                    : video.current.playAsync()
                }}
              >
                <HStack
                  gap={8}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View>
                    <MaterialCommunityIcons
                      name='play-outline'
                      size={24}
                      color='#fff'
                    />
                  </View>
                  <Text style={styles.btnText}>
                    {status.isPlaying ? "Pause" : "Play"} Trailer
                  </Text>
                </HStack>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.arrowBackBtn}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name='arrow-left-circle' size={30} color='white' />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

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
