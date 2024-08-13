import { ResizeMode, Video } from "expo-av"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import * as ScreenOrientation from "expo-screen-orientation"
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import {
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { BallIndicator } from "react-native-indicators"
import { Feather } from "@expo/vector-icons"
import { invoke } from "../../lib/axios"
import { COLORS } from "../color/VariableColors"
import VideoControls from "./VideoControls"

const { width, height } = Dimensions.get("window")

const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]

function VideoPlayer({ type, duration, posterSource, handleFullscreen }, ref) {
  const router = useRouter()
  const videoRef = useRef(null)

  const { source: src } = useVideo()

  // video states
  const [orientation, setOrientation] = useState(1)
  const [showControls, setShowControls] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setLoading] = useState(true)

  // forward 10s
  const forward10s = () => {
    if (videoRef.current) {
      videoRef.current.getStatusAsync().then((status) => {
        const newPosition = Math.max(
          status.positionMillis + 10000,
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
    .maxDuration(100)
    .onStart((event) => {
      console.log("Gesture Event Tap", event)
      // Toggle show & hide controls
      setShowControls(!showControls)
    })

  // Set the current time, if video is finished & film type is series, go to the next video
  const handlePlaybackStatusUpdate = (status) => {
    setCurrentTime(status.positionMillis)
    if (status.didJustFinish && type === "series") {
      // play next video
    }
  }

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pauseAsync()
    } else {
      videoRef.current.playAsync()
    }
    setIsPlaying(!isPlaying)
  }

  // Play the next Video
  const playNextVideo = () => {
    // play next video
  }

  // Play the previous Video
  const playPreviousVideo = () => {}

  // Toggle mute
  const toggleMute = () => {
    videoRef.current.setIsMutedAsync(isMuted)
    setIsMuted(!isMuted)
  }

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
      )
      setIsFullscreen(true)
      handleFullscreen(true)
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      )
      setIsFullscreen(false)
      handleFullscreen(false)
    }
    setOrientation(await ScreenOrientation.getOrientationAsync())
  }

  // handle back button press
  const onBackPress = () => {
    // if its fullscreen, exit fullscreen
    if (isFullscreen) {
      toggleFullscreen()
      return
    }

    // go back
    router.back()
  }

  useImperativeHandle(ref, () => {
    return {
      playVideo: () => {
        if (videoRef.current) {
          // set orientation to landscape
          toggleFullscreen()
          // play video
          videoRef.current.playAsync()
        }
      },
    }
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

  return (
    <View className='flex flex-1 items-start justify-start w-full h-full'>
      <View className='h-full w-full bg-black relative'>
        {/* {isLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 10,
              width,
              height,
              backgroundColor: COLORS.generalOpacity,
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
        )} */}

        <View className='h-full w-full'>
          <GestureDetector
            gesture={Gesture.Tap()
              .runOnJS(true)
              .onStart(() => {
                setShowControls((prev) => !prev)
              })}
          >
            <Video
              ref={videoRef}
              style={{ flex: 1 }}
              source={{
                uri: src,
              }}
              isLooping
              useNativeControls={false}
              resizeMode={ResizeMode.CONTAIN}
              onLoadStart={() => setLoading(true)}
              posterSource={posterSource}
              usePoster={true}
              PosterComponent={({ source, style }) => {
                console.log("PosterComponent", source)
                return (
                  <ImageBackground
                    source={{
                      uri: source,
                    }}
                    style={{
                      ...style,
                      height: "100%",
                      width: "100%",
                      position: "relative",
                      zIndex: 1,
                      top: 0,
                    }}
                    resizeMode='cover'
                  >
                    <LinearGradient
                      colors={[
                        "transparent",
                        "transparent",
                        COLORS.generalOpacity,
                        COLORS.generalOpacity,
                        COLORS.generalBg,
                      ]}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <View style={styles.arrowBackBtn}>
                        <TouchableOpacity onPress={() => router.back()}>
                          <Feather name='arrow-left' size={30} color='white' />
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                )
              }}
              onError={(error) => console.error("AV Error", error)}
            />
          </GestureDetector>
        </View>
        {showControls && (
          <VideoControls
            onTogglePlayPause={togglePlayPause}
            onForward={forward10s}
            onRewind={rewind10s}
            onSeek={(value) => {
              videoRef.current.setPositionAsync(+value)
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
      </View>

      {/* <View style={styles.arrowBackBtn}>
        <TouchableOpacity
          onPress={() => {
            if (isFullscreen) {
              toggleFullscreen()
            }
            router.back()
          }}
        >
          <Feather name='arrow-left' size={30} color='white' />
        </TouchableOpacity>
      </View> */}
    </View>
  )
}

function useVideo() {
  const params = useLocalSearchParams()
  const [source, setSource] = useState("")
  const [loading, setLoading] = useState(true)

  const getVideoUrl = useCallback(async () => {
    try {
      if (!params.id) return

      setLoading(true)

      const response = await invoke({
        method: "GET",
        endpoint: `/film/track/${params.id}`,
      })

      if (response.error) {
        console.error("Error", response.error)
        setLoading(false)
        return
      }

      setSource(response.res?.video?.url)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [params.filmId])

  useEffect(() => {
    getVideoUrl()
  }, [getVideoUrl])

  return {
    source,
  }
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
