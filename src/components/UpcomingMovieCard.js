import React from "react"
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { HStack, VStack } from "@react-native-material/core"
import { COLORS } from "../color/VariableColors"

const UpcomingMovieCard = (props) => {
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
        onPress={() => props.cardFunction()}
        style={{ width: "100%", height: "100%", backgroundColor: "red" }}
      >
        <ImageBackground
          source={{ uri: props.posterUrl }}
          style={[
            styles.cardImage,
            { width: "100%", height: "100%", resizeMode: "cover" },
          ]}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              flex: 1,
              display: "flex",
              alignItem: "space-between",
              justifyContent: "space-between",
            }}
          >
            <View
              style={[
                styles.showcaseType,
                {
                  paddingVertical: 6,
                  paddingHorizontal: 6,
                },
              ]}
            >
              <Text style={styles.showcaseTypeText}>Premering</Text>
            </View>

            <View style={styles.titleTextStack}>
              <VStack>
                <Text numberOfLines={1} style={styles.titleText}>
                  {props.title}
                </Text>
                <HStack spacing={10}>
                  <Text style={styles.subtitleText}>12k Views</Text>{" "}
                  <Text style={styles.subtitleText}>31 days ago</Text>
                </HStack>
              </VStack>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  )
}

export default UpcomingMovieCard

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,

    backgroundColor: COLORS.generalBg,
    height: 266,
    overflow: "hidden",
  },
  cardImage: {
    display: "flex",
  },
  showcaseType: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 17,
    backgroundColor: "#f13f64",
    textAlign: "center",
    position: "absolute",
    top: 10,
    left: 10,
  },
  showcaseTypeText: {
    color: COLORS.formSubTitle,
    fontFamily: "Inter-ExtraBold",
    fontSize: 9.93,
    textTransform: "uppercase",
  },
  titleTextStack: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  titleText: {
    color: COLORS.formSubTitle,
    fontFamily: "Inter-ExtraBold",
    fontSize: 16,
    letterSpacing: -0.37,
  },
  subtitleText: {
    color: COLORS.formSubTitle,
    fontFamily: "Inter-Bold",
    fontSize: 13,
    letterSpacing: -0.26,
  },
})
