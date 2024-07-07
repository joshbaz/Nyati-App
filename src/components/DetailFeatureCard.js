import React from "react"
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import { Box, VStack } from "@react-native-material/core"

import { COLORS } from "../color/VariableColors"

const DetailFeatureCard = (props) => {
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
          height: 136,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "transparent",
          overflow: "hidden",
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => {}}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <VStack
          spacing={0}
          style={{
            display: "flex",

            height: "100%",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: "100%",
              height: 111,
              overflow: "hidden",
              borderTopEndRadius: 10,
              borderTopStartRadius: 10,
              borderBottomEndRadius: 10,
              borderBottomStartRadius: 10,
            }}
          >
            <ImageBackground
              source={{ uri: props.posterUrl }}
              resizeMode='cover'
              objectFit='cover'
              style={[
                styles.cardImage,
                {
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                },
              ]}
            ></ImageBackground>
          </View>

          <Box style={[styles.fundDetailStack, { height: 136 - 111 }]}>
            <Text numberOfLines={1} style={styles.titleText}>
              {props.title}
            </Text>
          </Box>
        </VStack>
      </TouchableOpacity>
    </View>
  )
}

export default DetailFeatureCard

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  cardImage: {
    display: "flex",
  },
  showcaseType: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",

    textAlign: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  showcaseTypeText: {
    color: COLORS.formSubTitle,
    fontFamily: "Inter-ExtraBold",
    fontSize: 9.93,
    textTransform: "uppercase",
  },
  fundDetailStack: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",

    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 9,

    width: "100%",

    overflow: "hidden",
    backgroundColor: "transparent",
  },
  titleText: {
    color: COLORS.formSubTitle,
    fontFamily: "Inter-ExtraBold",
    fontSize: 12.4,
    letterSpacing: -0.37,
  },
  progressBars: {
    width: "100%",
  },
})
