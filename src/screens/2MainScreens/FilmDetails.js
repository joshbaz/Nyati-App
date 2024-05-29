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
  ImageBackground,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Stack, Box, HStack, VStack } from "@react-native-material/core";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTSFAMILIES } from "../../color/VariableColors";
import { Formik } from "formik";
import * as yup from "yup";
import { BallIndicator } from "react-native-indicators";
import { MaterialCommunityIcons, Entypo, Feather } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import MoviesDB from "../../../assets/data/db.json";
import DetailFeatureCard from "../../components/DetailFeatureCard";
import FilmFundCard from "../../components/FilmFundCard";
const { width, height } = Dimensions.get("window");


const FilmDetails = ({ navigation }) => {
     const [nowPlayingMoviesList, setNowPlayingMoviesList] =
       useState(undefined);
     const [upcomingFilmList, setUpcomingFilmList] = useState(undefined);
     const [continueWatchingList, setContinueWatchingList] =
       useState(undefined);
    const [fundraisingList, setFundraisingList] = useState(undefined);
    
     useEffect(() => {
       (async () => {
         //  let nowPlaying = await getnowPlayingMoviesList();
         setNowPlayingMoviesList(() => MoviesDB.movies);
         setUpcomingFilmList(() => MoviesDB.movies);
         setContinueWatchingList(() => MoviesDB.movies);
         setFundraisingList(() => MoviesDB.movies);
       })();
     }, []);
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.generalBg,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            marginTop: 0,
            paddingVertical: 0,
          }}
        >
          <VStack style={{ width: "100%" }}>
            {/** video trailer */}
            <View style={{ height: 397 }}>
              <ImageBackground
                source={{
                  uri: "https://images-na.ssl-images-amazon.com/images/M/MV5BMjYxMDcyMzIzNl5BMl5BanBnXkFtZTYwNDg2MDU3._V1_SX300.jpg",
                }}
                style={[
                  styles.cardImage,
                  { width: "100%", height: "100%", resizeMode: "cover" },
                ]}
              >
                <View style={styles.arrowBackBtn}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left-circle" size={30} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={styles.trailerBtnWrap}>
                  <TouchableOpacity style={styles.trailerBtn}>
                    <HStack
                      gap={8}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View>
                        <MaterialCommunityIcons
                          name="play-outline"
                          size={24}
                          color="#980F2A"
                        />
                      </View>
                      <Text style={styles.btnText}>Play trailer</Text>
                    </HStack>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
            {/** About details */}
            <View style={styles.detailWrap}>
              <VStack style={{ paddingVertical: 34, paddingHorizontal: 16 }}>
                {/** first section */}
                <VStack spacing={5} style={{ paddingBottom: 18 }}>
                  <HStack
                    style={{
                      height: 40,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.detailTitle}>Fair Play (2011)</Text>
                    <HStack spacing={16}>
                      <View style={styles.iconBtn}>
                        <Entypo
                          name="star-outlined"
                          size={24}
                          color={"rgba(237, 63, 98, 1)"}
                        />
                      </View>
                      <View style={styles.iconBtn}>
                        <Feather
                          name="share-2"
                          size={24}
                          color={"rgba(237, 63, 98, 1)"}
                        />
                      </View>
                    </HStack>
                  </HStack>
                  <HStack spacing={5}>
                    <Text style={styles.viewsText}>100 Views</Text>
                    <Text style={styles.viewsText}>|</Text>
                    <Text style={styles.viewsText}>2 days ago</Text>
                  </HStack>
                </VStack>
                {/** divider */}
                <View style={styles.horizontalLine} />
                {/** funds raised */}
                <VStack spacing={18} style={{ paddingVertical: 30 }}>
                  <VStack spacing={11}>
                    <HStack
                      style={{
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.raisedfundsTxt}>1,323,092 UGX</Text>{" "}
                      <Text style={styles.subfundsTxt}>
                        funds raised from 14,000,000
                      </Text>
                    </HStack>
                    <View style={styles.progressBars}>
                      <ProgressBar
                        progress={0.5}
                        color={"#F51D4A"}
                        borderRadius={20}
                        style={{
                          backgroundColor: "#EEF1F4",
                          borderRadius: 20,
                          width: "100%",
                        }}
                      />
                    </View>
                    <HStack
                      style={{
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.donatorTxt}>
                        <Text
                          style={{
                            fontFamily: "Inter-ExtraBold",
                            color: "#EE5170",
                          }}
                        >
                          10
                        </Text>{" "}
                        Donators
                      </Text>{" "}
                      <Text style={styles.donateTimeline}>
                        <Text
                          style={{
                            fontFamily: "Inter-ExtraBold",
                            color: "#EE5170",
                          }}
                        >
                          20
                        </Text>{" "}
                        days left
                      </Text>
                    </HStack>
                  </VStack>

                  <View>
                    <TouchableOpacity style={styles.donateBtn} onPress={()=>  navigation.push("Donate")}>
                      <Text style={styles.donateBtnTxt}>Donate</Text>
                    </TouchableOpacity>
                  </View>
                </VStack>

                {/** divider */}
                <View style={styles.horizontalLine} />

                {/** About film && Featuring */}
                <VStack spacing={33} style={{ paddingVertical: 30 }}>
                  <VStack spacing={15}>
                    <Text style={styles.containerSubTitle}>About Film</Text>
                    <Text style={styles.containerSubTxt}>
                      Discover the most anticipated movie releases with our
                      collection of thrilling and captivating trailers. Immerse
                      yourself in the world of cinema and stay up-to-date with
                      the latest blockbusters. Experience the excitement, drama,
                      and action - all in one place.
                    </Text>
                  </VStack>

                  <VStack spacing={15}>
                    <Text style={styles.containerSubTitle}>Featuring</Text>
                    <Animated.View
                      style={{
                        display: "flex",
                        height: 146,
                      }}
                    >
                      <FlatList
                        horizontal
                        data={upcomingFilmList}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.containerGap}
                        renderItem={({ item, index }) => (
                          <DetailFeatureCard
                            shouldMarginatedAtEnd={true}
                            cardFunction={() => {
                              navigation.push("FilmDetails", {
                                filmid: item.id,
                              });
                            }}
                            title={item.title}
                            posterUrl={item.posterUrl}
                            cardWidth={width / 3}
                            isFirst={index == 0 ? false : false}
                            isLast={
                              index == upcomingFilmList?.length - 1
                                ? false
                                : false
                            }
                          />
                        )}
                      />
                    </Animated.View>
                  </VStack>
                </VStack>
                {/** divider */}
                <View style={styles.horizontalLine} />
                {/** More like this*/}
                <VStack style={{ paddingVertical: 33 }}>
                  <Animated.View
                    style={{
                      marginBottom: 30,
                      display: "flex",
                      height: 280,
                    }}
                  >
                    <Text
                      style={[styles.containerSubTitle, { marginBottom: 30 }]}
                    >
                      More Like This
                    </Text>
                    <FlatList
                      horizontal
                      data={upcomingFilmList}
                      keyExtractor={(item) => item.id}
                      contentContainerStyle={styles.containerGap}
                      renderItem={({ item, index }) => (
                        <FilmFundCard
                          shouldMarginatedAtEnd={true}
                          cardFunction={() => {
                            navigation.push("FilmDetails", { filmid: item.id });
                          }}
                          title={item.title}
                          posterUrl={item.posterUrl}
                          cardWidth={width / 2}
                          isFirst={index == 0 ? false : false}
                          isLast={
                            index == upcomingFilmList?.length - 1
                              ? false
                              : false
                          }
                        />
                      )}
                    />
                  </Animated.View>
                </VStack>
              </VStack>
            </View>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default FilmDetails;

const styles = StyleSheet.create({
  trailerBtnWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  trailerBtn: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 229, 234, 0.33)",
    height: 52,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#980F2A",
    position: "absolute",

    bottom: 23,
  },
  btnText: {
    fontFamily: "Roboto-Bold",
    color: "#980F2A",
    fontSize: 16,
    letterSpacing: 0.1,
  },
  detailWrap: {
    backgroundColor: "#141118",
  },
  detailTitle: {
    fontFamily: "Inter-ExtraBold",
    color: "#FFFAF6",
    fontSize: 24,
    letterSpacing: -0.48,
    textTransform: "capitalize",
  },
  iconBtn: {
    display: "flex",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#302d38",
    borderRadius: 12,
  },
  viewsText: {
    color: "rgba(242, 242, 242, 0.60)",
    fontFamily: "Inter-Bold",
    fontSize: 15,
  },
  horizontalLine: {
    borderBottomColor: "rgba(242, 242, 242, 0.60)",
    borderBottomWidth: 1,
  },
  progressBars: {
    width: "100%",
  },
  raisedfundsTxt: {
    color: "#F8B5C3",
    fontFamily: "Inter-ExtraBold",
    fontSize: 14,
  },
  subfundsTxt: {
    color: "#FFFAF6",
    fontFamily: "Inter-Bold",
    fontSize: 12,
  },
  donatorTxt: {
    color: "#FFFAF6",
    fontFamily: "Inter-Bold",
    fontSize: 13,
  },
  donateTimeline: {
    color: "#FFFAF6",
    fontFamily: "Inter-Bold",
    fontSize: 13,
  },
  donateBtn: {
    height: 51,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: "#EE5170",
  },
  donateBtnTxt: {
    fontFamily: "Roboto-Bold",
    fontSize: 16,
    color: "#FFFAF6",
  },
  containerSubTitle: {
    color: "#F8B5C3",
    fontSize: 16,
    fontFamily: "Inter-ExtraBold",
    textTransform: "capitalize",
  },
  containerSubTxt: {
    color: "rgba(242, 242, 242, 0.70)",
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },
  containerGap: {
    gap: 20,
  },
  arrowBackBtn: {
    color: "#ffffff",
    position: "absolute",
    top: 20,
      left: 20,
    zIndex: 1,
  },
});
