import { useAuth } from "context/AuthProvider"
import { ResizeMode, Video } from "expo-av"
import {
  router,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router"
import * as ScreenOrientation from "expo-screen-orientation"
import { forwardRef, useCallback, useEffect, useRef, useState } from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { replace } from "formik"
// import { BallIndicator } from "react-native-indicators"
import { BASE_API_URL, invoke } from "../../lib/axios"
import VideoControls from "./VideoControls"

function VideoPlayer({ handleFullscreen }, ref) {
  const router = useRouter()
  const navigation = useNavigation()
  const videoRef = useRef(null)
  const { getAuthToken } = useAuth()
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
          0,
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
    setCurrentTime(status.positionMillis)
    setDuration(status.durationMillis)

    if (status.isLoaded) {
      setIsLoading(false)
    }

    if (status.didJustFinish) {
      // reset duration and current time
      // TODO: remove the current film from the
      setCurrentTime(0)
      setDuration(0)
    }
  }, [])

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync()
      } else {
        videoRef.current.playAsync()
      }
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])
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

  const { source: src, clearSrc } = useVideo(togglePlayPause)

  // handle back button press
  const onBackPress = useCallback(async () => {
    // TODO: save the video progress / position

    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    )

    // find previous route
    if (router.canGoBack()) {
      const previousRoute = navigation.getState().routes

      if (previousRoute.length > 1) {
        router.back()
        clearSrc()
      } else {
        // means we clicked a trailer from the home page
        router.push("/(home)")
        clearSrc()
      }
    } else {
      router.push("/(home)")
      clearSrc()
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

  const isBufferControlsShowing = isLoading || showControls

  if (!videoId) {
    // unmount the video player
    return null
  }

  return (
    <View
      key={videoId}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: isBufferControlsShowing
          ? "rgba(0,0,0,0.5)"
          : "rgba(0,0,0,0.2)",
      }}
      className='flex flex-1 items-center justify-center'
    >
      <GestureDetector gesture={onSingleTap}>
        <View className='w-full h-full'>
          <Video
            ref={videoRef}
            style={{ flex: 1 }}
            source={{
              uri: src,
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
    if (!params.videoId || source) return
    try {
      setLoading(true)

      const response = await invoke({
        method: "GET",
        endpoint: `/film/track/${params.videoId}`,
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
      setSource("")
      router.back()
    } finally {
      setLoading(false)
    }
  }, [params?.vidoeId, cb])

  const clearSrc = useCallback(() => {
    if (params?.videoId && source) {
      setSource("")
    }
  }, [source, params?.videoId])

  useEffect(() => {
    getVideoUrl()
  }, [getVideoUrl])

  return { source, loading, clearSrc }
}

export default forwardRef(VideoPlayer)
