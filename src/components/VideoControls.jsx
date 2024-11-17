import { Slider } from "@miblanchard/react-native-slider"
import React, { useMemo } from "react"
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { BallIndicator } from "react-native-indicators"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { COLORS } from "../color/VariableColors"

// format time
const formatTime = (timeInMs) => {
  if (!isNaN(timeInMs)) {
    const totalSeconds = Math.floor(timeInMs / 1000) // 1000 milliseconds in a second
    const hours = Math.floor(totalSeconds / 3600) // 3600 seconds in an hour
    const minutes = Math.floor(totalSeconds / 60) % 60 // 60 minutes in an hour
    const seconds = totalSeconds % 60 // 60 seconds in a minute

    // return 00:00:00 / 00:00:00 -> hours:min
    return `${hours > 0 ? `${hours}:` : ""}${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }

  return "00:00"
}

function VideoControls({
  onTogglePlayPause,
  onSeek,
  onToggleFullscreen,
  duration = 120,
  currentTime: time,
  shouldPlay,
  fullScreenValue,
  onBackPress,
  onForward,
  onRewind,
  isLoading,
}) {
  const { width } = Dimensions.get("window")
  const insets = useSafeAreaInsets()

  const sliderWidth = useMemo(() => {
    let widthValue = width - 20
    if (fullScreenValue) {
      widthValue = width - (insets.right + insets.left)
    }
    return widthValue
  }, [width, insets.right, insets.left, fullScreenValue])

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        paddingTop: fullScreenValue ? 40 : 0,
      }}
      className={`h-full w-full flex flex-col items-start justify-between p-2
        ${fullScreenValue} ? "pt-8" : ""`}
    >
      <View>
        <TouchableOpacity onPress={onBackPress} style={styles.controlButton}>
          <Feather name='arrow-left' size={30} color='white' />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className='flex flex-row items-center justify-center w-full'>
          <BallIndicator color={COLORS.formBtnBg} count={9} />
        </View>
      ) : (
        <View className='flex flex-row items-center justify-center w-full '>
          <TouchableOpacity onPress={onRewind}>
            <MaterialIcons name='replay-10' size={34} color='white' />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onTogglePlayPause()}
            className='flex flex-row items-center justify-center w-16 h-16 rounded-full bg-white/40 shadow-sm mx-8'
          >
            <Ionicons
              name={shouldPlay ? "pause" : "play"}
              size={40}
              color='white'
              style={{ marginLeft: shouldPlay ? 0 : 5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onForward}>
            <MaterialIcons name='forward-10' size={34} color='white' />
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <View></View>
      ) : (
        <View className='flex flex-col items-start'>
          <View className='flex flex-row items-center justify-between px-2 w-full'>
            <View className='flex flex-row items-center justify-start'>
              <Text className='text-sm text-white'>{formatTime(time)}</Text>
              <Text className='text-sm text-white mx-1'>/</Text>
              <Text className='text-sm text-white'>{formatTime(duration)}</Text>
            </View>
            <TouchableOpacity onPress={() => onToggleFullscreen()}>
              {fullScreenValue ? (
                <MaterialIcons name='fullscreen-exit' size={36} color='white' />
              ) : (
                <Ionicons name='scan' size={24} color='white' />
              )}
            </TouchableOpacity>
          </View>

          <View className='w-full'>
            <Slider
              containerStyle={{
                width: sliderWidth,
              }}
              value={time}
              minimumValue={0}
              maximumValue={duration}
              onValueChange={(value) => {
                onSeek(value)
              }}
              onSlidingComplete={(value) => {
                onSeek(value)
              }}
              minimumTrackTintColor={COLORS.formBtnBg}
              maximumTrackTintColor={COLORS.formText}
              thumbTintColor={COLORS.formBtnBg}
            />
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
    height: "100%",
  },
  controlButton: {
    marginHorizontal: 10,
  },
  playbackSpeedText: {
    color: "white",
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    backgroundColor: "black",
    padding: 10,
  },
  slider: {
    marginHorizontal: 10,
  },
  timeText: {
    color: "white",
    fontSize: 12,
  },
})

export default VideoControls
