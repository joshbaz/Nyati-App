import React from "react"
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { ProgressBar } from "react-native-paper"
import { Box, HStack, VStack } from "@react-native-material/core"
import { COLORS } from "../color/VariableColors"

const FilmFundCard = (props) => {
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
          height: 235,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "transparent",
          overflow: "hidden",
        },
      ]}
    >
      <Pressable
        onPress={() => props.cardFunction()}
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
            borderRadius: 5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: 130,
              overflow: "hidden",
            }}
          >
            <ImageBackground
              source={{ uri: props.posterUrl }}
              resizeMode='cover'
              objectFit='cover'
              backgroundColor={COLORS.formBg}
              style={{
                ...styles.cardImage,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                resizeMode: "cover",
              }}
            />
          </View>

          <Box style={[styles.fundDetailStack, { height: 231 - 128 }]}>
            <Text numberOfLines={1} style={styles.titleText}>
              Fund: {props.title}
            </Text>
            <View style={styles.progressBars}>
              <ProgressBar
                progress={0.5}
                color={COLORS.formBtnBg}
                borderRadius={20}
                style={{
                  backgroundColor: "#EEF1F4",
                  borderRadius: 10,
                  width: "100%",
                }}
              />
            </View>
            <HStack style={{ justifyContent: "space-between", width: "100%" }}>
              <Text style={styles.raisedMoney}>1.3M Ugx</Text>
              <Text style={styles.fundDays}>20 days left</Text>
            </HStack>
          </Box>
        </VStack>
      </Pressable>
    </View>
  )
}

export default FilmFundCard

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
    justifyContent: "flex-start",
    gap: 10,
    padding: 12,
    width: "100%",
    overflow: "hidden",
    backgroundColor: COLORS.formBg,
  },
  titleText: {
    color: COLORS.formSubTitle,
    fontFamily: "Inter-ExtraBold",
    fontSize: 16,
    letterSpacing: -0.37,
  },
  progressBars: {
    width: "100%",
  },
  raisedMoney: {
    color: "#EE5071",
    fontSize: 12.5,
    fontFamily: "Inter-ExtraBold",
    letterSpacing: -0.25,
  },
  fundDays: {
    color: "#BDBDBD",
    fontSize: 12.5,
    fontFamily: "Inter-Bold",
    letterSpacing: -0.25,
  },
})
