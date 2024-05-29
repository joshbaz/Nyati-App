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
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Stack, Box, HStack, VStack } from "@react-native-material/core";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTSFAMILIES } from "../../color/VariableColors";
import { Formik } from "formik";
import * as yup from "yup";
import { BallIndicator } from "react-native-indicators";
import CategoryHeader from "../../components/CategoryHeader";
const { width, height } = Dimensions.get("window");
import MoviesDB from "../../../assets/data/db.json";
import UpcomingMovieCard from "../../components/UpcomingMovieCard";
import ContinueWatchCard from "../../components/ContinueWatchCard";
import FilmFundCard from "../../components/FilmFundCard";
import FeaturedMovieCard from "../../components/FeaturedMovieCard";
import { Entypo } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import Orientation from "react-native-orientation";

import { Feather } from "@expo/vector-icons";



const WatchFilm = ({ navigation }) => {
const [filmStatus, setFilmStatus] = useState({
  currentTime: 0,
  duration: 0.1,
  paused: false,
  overlay: false,
  fullscreen: false,
});
    const [status, setStatus] = React.useState({});
    
    const video = React.useRef(null);
    const urlVideo = React.useRef(null)
    //load function

    //timer
      const getTime = (t) => {
        const digit = (n) => (n < 10 ? `0${n}` : `${n}`);
        // const t = Math.round(time);
        const sec = digit(Math.floor(t % 60));
        const min = digit(Math.floor((t / 60) % 60));
        const hr = digit(Math.floor((t / 3600) % 60));
        return hr + ":" + min + ":" + sec; // this will convert sec to timer string
        // 33 -> 00:00:33
        // this is done here
        // ok now the theme is good to look
    };
    
    const load = ({ duration }) => setFilmStatus(() => ({ ...filmStatus, duration: duration }));
    const progress = ({ currentTime }) => {
       console.log("running progress", currentTime);
       setFilmStatus(() => ({ ...filmStatus, currentTime }));  
   }
        
    
     const  fullscreen = () => {
        const { fullscreen } = filmStatus;
        if (fullscreen) {
          Orientation.lockToPortrait();
        } else {
          Orientation.lockToLandscape();
        }
         
         setFilmStatus(() => ({ ...filmStatus, fullscreen: !fullscreen }));
    };
    
    //console.log("status", status);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.generalBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          backgroundColor: COLORS.generalBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: width,
            height: width * 0.9,
            backgroundColor: "black",
          }}
        >
          <Video
            ref={video}
            style={{ flex: 1 }}
            source={require("./reactapp.mp4")}
            onProgress={progress}
            useNativeControls
            resizeMode={'contain'}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
        </View>

        <View style={styles.arrowBackBtn}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left-circle" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WatchFilm;

const styles = StyleSheet.create({
  videoTitleWrap: {
    position: "absolute",
    left: 80,
    top: 10,
  },
  videoTitle: {
    color: "#ffffff",
    fontSize: 20,
  },
    arrowBackBtn: {
        color: '#ffffff',
        position: 'absolute',
        top: 20,
        left:20,
  },
});
