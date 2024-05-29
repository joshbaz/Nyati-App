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
import { LinearGradient } from "expo-linear-gradient";
//import { LinearGradient } from "react-native-linear-gradient";

const FeaturedMovieCard = (props) => {
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
                      
            style={styles.linearBg}
          ></LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default FeaturedMovieCard;

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
});
