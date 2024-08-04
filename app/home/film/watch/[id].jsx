import { router } from "expo-router"
import * as ScreenOrientation from "expo-screen-orientation"
import React, { useEffect, useState } from "react"
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { invoke } from "../../../../lib/axios"
import { COLORS } from "../../../../src/color/VariableColors"
import VideoPlayer from "../../../../src/components/VideoPlayer"

const { width, height } = Dimensions.get("window")

const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

const WatchFilm = () => {
  const [filmStatus, setFilmStatus] = useState({
    currentTime: 0,
    duration: 0.1,
    paused: false,
    overlay: false,
    fullscreen: false,
  })
  const [orientation, setOrientation] = useState(1)
  const videoRef = React.useRef(null)
  // const [videoSource, setVideoSource] = useState("")

  // const fetchVideoSource = async () => {
  //   try {
  //     const response = await invoke({ endpoint: "/stream/{filmId}" })
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
    )
    const o = await ScreenOrientation.getOrientationAsync()
    setOrientation(o)
  }

  useEffect(() => {
    lockOrientation()
    if (videoRef.current) {
      videoRef.current.playAsync()
      // videoRef?.current?.presentFullscreenPlayer()
    }
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width,
        backgroundColor: COLORS.generalBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width,
          height,
          flex: 1,
          backgroundColor: COLORS.generalBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <VideoPlayer ref={videoRef} source={videoSource} />

        <View style={styles.arrowBackBtn}>
          <TouchableOpacity
            onPress={() => {
              ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP,
              )
              router.back()
            }}
          >
            <Feather name='arrow-left' size={30} color='white' />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default WatchFilm

const styles = StyleSheet.create({
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
    left: 40,
  },
})
