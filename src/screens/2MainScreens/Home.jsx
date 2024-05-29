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
  FlatList
} from "react-native";
import React, { useEffect,useState, useRef } from "react";
import { Stack, Box, HStack, VStack } from "@react-native-material/core";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTSFAMILIES } from "../../color/VariableColors";
import { Formik } from "formik";
import * as yup from "yup";
import { BallIndicator } from "react-native-indicators";
import CategoryHeader from "../../components/CategoryHeader";
const { width, height } = Dimensions.get('window');
import MoviesDB from '../../../assets/data/db.json'
import UpcomingMovieCard from "../../components/UpcomingMovieCard";
import ContinueWatchCard from "../../components/ContinueWatchCard";
import FilmFundCard from "../../components/FilmFundCard";
import FeaturedMovieCard from "../../components/FeaturedMovieCard";
import { Entypo } from "@expo/vector-icons";

const getnowPlayingMoviesList = async () => {
    try {
        let response = await fetch()
        let json = await response.json();
        return json;
    } catch (error) {
    console.error('Error- somethingis not right', error)
    }
};

const getupcomingFilmList = async () => {
  try {
    let response = await fetch();
    let json = await response.json();
    return json;
  } catch (error) {
    console.error("Error- somethingis not right", error);
  }
};

const getcontinueWatchingList = async () => {
  try {
    let response = await fetch();
    let json = await response.json();
    return json;
  } catch (error) {
    console.error("Error- somethingis not right", error);
  }
};

const getfundraisingList = async () => {
  try {
    let response = await fetch();
    let json = await response.json();
    return json;
  } catch (error) {
    console.error("Error- somethingis not right", error);
  }
};

const Home = ({ navigation }) => {

    const [nowPlayingMoviesList, setNowPlayingMoviesList] = useState(undefined);
    const [upcomingFilmList, setUpcomingFilmList] = useState(undefined);
    const [continueWatchingList, setContinueWatchingList] = useState(undefined);
    const [fundraisingList, setFundraisingList] = useState(undefined);

    useEffect(() => {
        (async () => {
          //  let nowPlaying = await getnowPlayingMoviesList();
            setNowPlayingMoviesList(() => MoviesDB.movies);
            setUpcomingFilmList(() => MoviesDB.movies);
            setContinueWatchingList(() => MoviesDB.movies);
             setFundraisingList(() => MoviesDB.movies);
        })()
    },[])


    if (
      nowPlayingMoviesList === undefined ||
      nowPlayingMoviesList === null && upcomingFilmList === undefined ||
      upcomingFilmList === null && continueWatchingList === undefined ||
      continueWatchingList === null && fundraisingList === undefined ||
      fundraisingList === null 
    ) {
        return (
          <Modal
            transparent={true}
            visible={true}
            animationType="slide"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <View
              style={[
                {
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: COLORS.generalBg,
                },
              ]}
                >
                    <VStack spacing={10}>
                     <Animated.View
                style={{
                  position: "relative",
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BallIndicator color="#ED3F62" count={9} />
              </Animated.View>
              <Text style={styles.formSubtitle}>Loading</Text>
                    </VStack>
             
            </View>
          </Modal>
        );
    }
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
          }}
        >
          <Stack direction="column">
            {/** main featured movies */}
            <View>
              <Animated.View
                style={{
                  marginBottom: 30,
                  display: "flex",
                  height: 223,
                }}
              >
                <FlatList
                  horizontal
                  data={upcomingFilmList}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ gap: 0 }}
                  snapToInterval={width}
                  decelerationRate={0}
                  renderItem={({ item, index }) => (
                    <FeaturedMovieCard
                      shouldMarginatedAtEnd={false}
                      cardFunction={() => {
                        navigation.push("FilmDetails", { filmid: item.id });
                      }}
                      title={item.title}
                      posterUrl={item.posterUrl}
                      cardWidth={width}
                      isFirst={index == 0 ? true : false}
                      isLast={false}
                    />
                  )}
                />

                <View style={styles.menuBarIcon}>
                  <Entypo name="menu" size={30} color={COLORS.formSubTitle} />
                </View>
              </Animated.View>
            </View>
            {/** upcoming films */}
            <View>
              <Animated.View
                style={{
                  marginBottom: 30,
                  

                  display: "flex",
                  height: 310,
                }}
              >
                <CategoryHeader
                  title={"Upcoming on Nyati Films"}
                  viewMoreArrow={true}
                />
                <FlatList
                  horizontal
                  data={upcomingFilmList}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.containerGap}
                  renderItem={({ item, index }) => (
                    <UpcomingMovieCard
                      shouldMarginatedAtEnd={true}
                      cardFunction={() => {
                        navigation.push("FilmDetails", { filmid: item.id });
                      }}
                      title={item.title}
                      posterUrl={item.posterUrl}
                      cardWidth={width / 2}
                      isFirst={index == 0 ? true : false}
                      isLast={
                        index == upcomingFilmList?.length - 1 ? true : false
                      }
                    />
                  )}
                />
              </Animated.View>
            </View>

            {/** continue watching */}
            <View>
              <Animated.View
                style={{
                  marginBottom: 30,
                  

                  display: "flex",
                  height: 210,
                }}
              >
                <CategoryHeader title={"Continue Watching"} />
                <FlatList
                  horizontal
                  data={upcomingFilmList}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.containerGap}
                  renderItem={({ item, index }) => (
                    <ContinueWatchCard
                      shouldMarginatedAtEnd={true}
                      cardFunction={() => {
                        navigation.push("WatchFilm", { filmid: item.id });
                      }}
                      title={item.title}
                      posterUrl={item.posterUrl}
                      cardWidth={width / 2}
                      isFirst={index == 0 ? true : false}
                      isLast={
                        index == upcomingFilmList?.length - 1 ? true : false
                      }
                    />
                  )}
                />
              </Animated.View>
            </View>

            {/** film fundraising campaigns */}
            <View>
              <Animated.View
                style={{
                  marginBottom: 30,
                  display: "flex",
                  height: 280,
                }}
              >
                <CategoryHeader
                  title={"Films Fundraising Campaigns"}
                  viewMoreArrow={true}
                />
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
                      isFirst={index == 0 ? true : false}
                      isLast={
                        index == upcomingFilmList?.length - 1 ? true : false
                      }
                    />
                  )}
                />
              </Animated.View>
            </View>
          </Stack>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  overlay: {
    width:'100%',
    height: '100%',
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.3,
    shadowOpacity:'20 30 40 10'
    
  },
  menuBarIcon: {
    display: 'flex',
    justifyContent: "center",
    alignItems:'center',
    alignSelf: 'flex-start',
    width: 50,
    height: 50,
    position: 'absolute',
    top: 8,
    right:20
  },
  formTitle: {
    color: COLORS.formTitle,
    fontFamily: FONTSFAMILIES.formTitlefont,
    fontSize: 27,
    lineHeight: 36,
    letterSpacing: -0.54,
  },
  formSubtitle: {
    color: COLORS.formSubTitle,
    fontFamily: FONTSFAMILIES.formSubTitle,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.32,
  },
  formLinks: {
    color: COLORS.formLinks,
    fontFamily: FONTSFAMILIES.formLinks,
    fontSize: 16,
    lineHeight: 22,

    letterSpacing: -0.32,
  },
  formBtnLink: {
    borderBottomColor: COLORS.formLinks,
    borderBottomWidth: 1,
  },
  formLabel: {
    fontFamily: FONTSFAMILIES.formLabel,
    color: COLORS.formLabel,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.28,
  },
  formInputs: {
    height: 48,
    backgroundColor: COLORS.formBg,
    borderRadius: 6,
    borderColor: COLORS.formBorder,
    borderWidth: 1,
    color: COLORS.formText,
    paddingLeft: 10,
    paddingRight: 10,
  },
  passwordContainer: {
    height: 48,
    backgroundColor: COLORS.formBg,
    borderRadius: 6,
    borderColor: COLORS.formBorder,
    borderWidth: 1,
  },
  passwordInput: {
    width: "89%",
    paddingLeft: 10,
    color: COLORS.formText,
  },
  passwordIcon: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "transparent",
    width: "11%",
    color: COLORS.formText,
  },
  formBtn: {
    backgroundColor: COLORS.formBtnBg,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 52,

    borderRadius: 100,
  },
  formBtnText: {
    fontFamily: FONTSFAMILIES.formBtnText,
    color: COLORS.formBtnText,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: "bold",
    },
    containerGap: {
      gap: 20
  }
});

