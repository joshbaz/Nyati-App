import VideoPlayer from "@components/VideoPlayer"
import { useLocalSearchParams } from "expo-router"
import * as ScreenOrientation from "expo-screen-orientation"
import { useCallback, useEffect } from "react"
import { View } from "react-native"

// I want a page that is only fits the screen width and height and only in landscape mode.

const testsrc =
  "https://newtou.nyc3.digitaloceanspaces.com/66ba92032df5ff8a0a4574ac/Fair Play_360p.mp4"

function WatchFilm() {
  const params = useLocalSearchParams()

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
    )
  }, [])

  // always show in landscape mode
  useEffect(() => {
    if (params.videoId) {
      toggleFullscreen()
    }
  }, [params.videoId, toggleFullscreen])

  return (
    // <Loader isLoading={false}>
    <View className='flex flex-1 w-full h-full items-center justify-center'>
      <VideoPlayer posterSource={""} videoId={params.videoId} />
    </View>
    // </Loader>
  )
}

export default WatchFilm
