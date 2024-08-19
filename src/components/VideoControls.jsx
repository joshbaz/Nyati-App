import { Slider } from "@miblanchard/react-native-slider"
import React from "react"
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { COLORS } from "../color/VariableColors"

const { width, height } = Dimensions.get("window")

// format time
const formatTime = (timeInMs) => {
  if (!isNaN(timeInMs)) {
    console.log("timeInMs", timeInMs)
    const totalSeconds = Math.floor(timeInMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

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
}) {
  return (
    <View className='absolute h-full w-full top-0 left-0 bg-gray-900/50 flex flex-col items-start justify-between p-2'>
      <View>
        <TouchableOpacity onPress={onBackPress} style={styles.controlButton}>
          <Feather name='arrow-left' size={30} color='white' />
        </TouchableOpacity>
      </View>

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
      <View className='flex flex-col items-start'>
        <View className='flex flex-row items-center justify-between px-2 w-full'>
          <View className='flex flex-row items-center justify-start'>
            <Text className='text-sm text-white'>{formatTime(time)}</Text>
            <Text className='text-sm text-white mx-1'>/</Text>
            <Text className='text-sm text-white'>
              {formatTime(duration * 1000)}
            </Text>
          </View>
          <TouchableOpacity onPress={() => onToggleFullscreen()}>
            {fullScreenValue ? (
              <MaterialIcons name='fullscreen-exit' size={36} color='white' />
            ) : (
              <Ionicons name='scan' size={24} color='white' />
            )}
          </TouchableOpacity>
        </View>

        <View className='w-full h-auto'>
          <Slider
            containerStyle={{
              marginHorizontal: 10,
            }}
            minimumValue={0}
            maximumValue={duration * 1000}
            value={time}
            onValueChange={(value) => {
              console.log("value", value)
              onSeek(value)
            }}
            onSlidingComplete={(value) => {
              console.log("value", value)
              onSeek(value)
            }}
            minimumTrackTintColor={COLORS.formBtnBg}
            maximumTrackTintColor='white'
            thumbTintColor={COLORS.formBtnBg}
          />
        </View>
      </View>
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
