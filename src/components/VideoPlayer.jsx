import { useAuth } from "context/AuthProvider"
import { ResizeMode, Video } from "expo-av"
import { LinearGradient } from "expo-linear-gradient"
import { router, useLocalSearchParams, useRouter } from "expo-router"
import * as ScreenOrientation from "expo-screen-orientation"
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  Button,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
// import { BallIndicator } from "react-native-indicators"
import { Feather } from "@expo/vector-icons"
import { BASE_API_URL, invoke } from "../../lib/axios"
import { COLORS } from "../color/VariableColors"
import VideoControls from "./VideoControls"

// const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]
const testsrc =
  "https://newtou.nyc3.digitaloceanspaces.com/66ba92032df5ff8a0a4574ac/Fair Play_360p.mp4"

function VideoPlayer({ posterSource, handleFullscreen }, ref) {
  const router = useRouter()
  const videoRef = useRef(null)
  const { getAuthToken } = useAuth()
  const { width, height } = Dimensions.get("window")
  const { id, videoId } = useLocalSearchParams()

  const token = getAuthToken()

  const videoSource = `${BASE_API_URL}/api/v1/film/stream/${videoId}`

  // video states
  const [orientation, setOrientation] = useState(1)
  const [showControls, setShowControls] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [duration, setDuration] = useState(0)

  // forward 10s
  const forward10s = () => {
    if (videoRef.current) {
      videoRef.current.getStatusAsync().then((status) => {
        const newPosition = Math.max(
          status.positionMillis + 10000, // 10s
          status.durationMillis,
        )
        videoRef.current.setPositionAsync(newPosition)
      })
    }
  }

  // rewind 10s
  const rewind10s = () => {
    if (videoRef.current) {
      videoRef.current.getStatusAsync().then((status) => {
        const newPosition = Math.max(status.positionMillis - 10000, 0)
        videoRef.current.setPositionAsync(newPosition)
      })
    }
  }

  // Show or hide controls
  const onSingleTap = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => {
      // Toggle show & hide controls
      setShowControls(true)
    })

  // Set the current time, if video is finished & film type is series, go to the next video
  const handlePlaybackStatusUpdate = useCallback((status) => {
    // console.log("Playback Status", status)
    setCurrentTime(status.positionMillis)
    setDuration(status.durationMillis)

    if (status.isLoaded) {
      setIsLoading(false)
    }

    // if (status.isBuffering) {
    //   setIsLoading(true)
    // }

    if (status.didJustFinish) {
      // reset duration and current time
      // TODO: remove the current film from the
      setCurrentTime(0)
      setDuration(0)
    }
  }, [])

  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync()
      } else {
        videoRef.current.playAsync()
      }
    }
    setIsPlaying(!isPlaying)
  }
  // When the video is ready for display
  const onReadyForDisplay = useCallback((evt) => {
    if (evt.status.isLoaded && videoRef.current) {
      videoRef.current.playAsync()
    }
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!isFullscreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
      )
      setIsFullscreen(true)

      if (typeof handleFullscreen === "function") {
        handleFullscreen(true)
      }
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      )
      setIsFullscreen(false)
      if (typeof handleFullscreen === "function") {
        handleFullscreen(false)
      }
    }
    setOrientation(await ScreenOrientation.getOrientationAsync())
  }, [handleFullscreen, isFullscreen])

  // change orientation and play video
  const playVideo = () => {
    togglePlayPause()
  }

  const { source: src, clearSrc } = useVideo(playVideo)

  // handle back button press
  const onBackPress = useCallback(async () => {
    // TODO: save the video progress / position

    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    )

    router.back()
  }, [])

  useEffect(() => {
    if (isPlaying && showControls) {
      const timer = setTimeout(() => {
        setShowControls(false)
      }, 5000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [isPlaying, showControls])

  const isBufferControlsShowing = isLoading || showControls

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: isBufferControlsShowing
          ? "rgba(0,0,0,0.5)"
          : "transparent",
      }}
      className='flex flex-1 items-center justify-center'
    >
      <GestureDetector gesture={onSingleTap}>
        <View className='w-full h-full'>
          <Video
            ref={videoRef}
            style={{ flex: 1 }}
            source={{
              uri: videoSource,
              headers: {
                range: "bytes=0-",
              },
            }}
            isLooping
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            onReadyForDisplay={onReadyForDisplay}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            onError={(error) => console.error("AV Error", error)}
            videoStyle={{
              width: "100%",
              height: "100%",
              backgroundColor: "black",
            }}
          />
        </View>
      </GestureDetector>
      <SafeAreaView
        style={{
          width: "100%",
          position: "absolute",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: showControls || isLoading ? 1 : -1,
        }}
      >
        {isBufferControlsShowing && (
          <VideoControls
            isLoading={isLoading}
            onTogglePlayPause={togglePlayPause}
            onForward={forward10s}
            onRewind={rewind10s}
            onSeek={(value) => {
              console.log("Seeking to", value)
              videoRef.current?.setPositionAsync(+value)
              setCurrentTime(+value)
            }}
            onToggleFullscreen={toggleFullscreen}
            duration={duration}
            currentTime={currentTime}
            isMuted={isMuted}
            shouldPlay={isPlaying}
            fullScreenValue={isFullscreen}
            onBackPress={onBackPress}
          />
        )}
      </SafeAreaView>
    </View>
  )
}

function useVideo(cb) {
  const params = useLocalSearchParams()
  const [source, setSource] = useState("")
  const [loading, setLoading] = useState(true)

  const getVideoUrl = useCallback(async () => {
    if (!params.trackid) return
    try {
      setLoading(true)

      const response = await invoke({
        method: "GET",
        endpoint: `/film/track/${params.trackid}`,
      })

      if (response.error) {
        throw new Error(response.error)
      }

      setSource(response.res?.video?.url)

      if (typeof cb === "function") {
        cb()
      }
    } catch (error) {
      // clear the trackid for the use to try again
      router.setParams({ trackid: null })
    } finally {
      setLoading(false)
    }
  }, [params?.trackid])

  const clearSrc = useCallback(() => {
    if (params?.trackid && source) {
      setSource("")
      router.setParams({ trackid: null })
    }
  }, [source, params?.trackid])

  useEffect(() => {
    getVideoUrl()
  }, [getVideoUrl])

  return { source, loading, clearSrc }
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

export default forwardRef(VideoPlayer)
