import { LinearGradient } from "expo-linear-gradient";
import React from "react"
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { COLORS } from "../color/VariableColors"


function FeaturedMovieCard(props) {
  return (
    <View
      style={[
        styles.container,
        props.shouldMarginatedAtEnd
          ? props.isFirst
            ? { marginLeft: 16 }
            : props.isLast
              ? { marginRight: 16 }
              : { maxWidth: props.cardWidth }
          : { maxWidth: props.cardWidth },
        props.shouldMarginatedAround
          ? { margin: 12 }
          : { maxWidth: props.cardWidth },
        {
          minWidth: props.cardWidth,
          maxWidth: props.cardWidth,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => {}}
        style={{ width: "100%", height: "100%" }}
      >
        <ImageBackground
          source={{ uri: props.posterUrl }}
          style={[
            styles.cardImage,
            { width: "100%", height: "100%", resizeMode: "cover" },
          ]}
        >
          <LinearGradient
            colors={["rgba(15, 17, 24, 0.945)", "transparent"]}
            start={{ x: 0.9, y: 0.9 }}
            end={{ x: 0.9, y: 0.2 }}
            style={{
              ...styles.linearBg,
              display: "flex",
              height: "100%",
              alignItems: "flex-end",
            }}
          >
            <View className='flex flex-col items-start justify-end w-full h-full p-4 gap-y-2'>
              <Text className='text-white font-bold text-2xl'>
                {props.title}
              </Text>
              <View className='flex flex-row items-center gap-x-2'>
                <Image
                  source={require("../../assets/bagheart.png")}
                  style={{ width: 24, height: 24 }}
                  resizeMode='contain'
                />

                <Text className='text-gray-400 font-medium tracking-tight text-lg'>
                  Free to watch
                </Text>
              </View>
              <View className='flex flex-row items-center gap-x-4'>
                <TouchableOpacity
                  onPress={() => props.cardFunction()}
                  className='flex flex-row items-center justify-center gap-x-2 h-14'
                  style={{
                    width: 200,

                    borderRadius: 100,
                    padding: 2,
                    backgroundColor: COLORS.formBtnBg,
                  }}
                >
                  <Image
                    source={require("../../assets/playcircle.png")}
                    style={{ width: 30, height: 30 }}
                    resizeMode='contain'
                  />
                  <Text className='text-gray-300 font-semibold text-lg'>
                    Trailer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex items-center justify-center border border-white rounded-full h-12 w-12 bg-slate-50/20'>
                  <Feather name='info' size={28} color={COLORS.formText} />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  )
}

export default FeaturedMovieCard

const styles = StyleSheet.create({
  linearBg: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  cardImage: {
    display: "flex",
  },
})