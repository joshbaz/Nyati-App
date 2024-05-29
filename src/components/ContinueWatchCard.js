import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Modal,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Stack, Box, HStack, VStack } from "@react-native-material/core";
import { COLORS, FONTSFAMILIES } from "../color/VariableColors";
import { Ionicons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";

const ContinueWatchCard = (props) => {
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
          height: 190,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => props.cardFunction()}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <VStack
          spacing={10}
          style={{
            display: "flex",

            height: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              height: 137,
              overflow: "hidden",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "transparent",
            }}
          >
            <ImageBackground
              source={{ uri: props.posterUrl }}
              resizeMode="cover"
              style={[
                styles.cardImage,
                {
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
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
                  <Ionicons
                    name="play-sharp"
                    size={40}
                    color={COLORS.formSubTitle}
                  />
                </View>

                <View style={styles.progressBars}>
                  <ProgressBar
                    progress={0.5}
                    color={"#F51D4A"}
                    borderRadius={20}
                   
                    style={{ backgroundColor: "#EEF1F4", borderRadius:20, width:'100%' }}
                  />
                </View>
              </View>
            </ImageBackground>
          </View>

          <View style={[styles.titleTextStack]}>
            <Text numberOfLines={1} style={styles.titleText}>
              {props.title}
            </Text>
          </View>
        </VStack>
      </TouchableOpacity>
    </View>
  );
};

export default ContinueWatchCard;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
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
  titleTextStack: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingLeft: 10,
    paddingRight: 10,
    
    width: "100%",
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
  progressBars: {
    width: '100%',
    paddingLeft: 4,
    paddingRight: 4,
    position: 'absolute',
    bottom:8
  },
});

