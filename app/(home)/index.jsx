import { DrawerActions } from "@react-navigation/native"
import { Link, router, useNavigation } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  Animated,
  Button,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { BallIndicator } from "react-native-indicators"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack, VStack } from "@react-native-material/core"
import { Entypo, Feather } from "@expo/vector-icons"
import MoviesDB from "../../assets/data/db.json"
import useFilms from "../../hooks/useFilms"
import { COLORS, FONTSFAMILIES } from "../../src/color/VariableColors"
import Avatar from "../../src/components/Avatar"
import CategoryHeader from "../../src/components/CategoryHeader"
import ContinueWatchCard from "../../src/components/ContinueWatchCard"
import FeaturedSlide from "../../src/components/FeaturedSlide"
import FilmFundCard from "../../src/components/FilmFundCard"
import UpcomingMovieCard from "../../src/components/UpcomingMovieCard"
import WatchFlatList from "../../src/components/WatchFlatList"

const { width } = Dimensions.get("window")

function Home() {
  const nav = useNavigation()
  const { films, fetchFilms } = useFilms()
  const [nowPlayingMoviesList, setNowPlayingMoviesList] = useState(undefined)
  const [upcomingFilmList, setUpcomingFilmList] = useState(undefined)
  const [continueWatchingList, setContinueWatchingList] = useState(undefined)
  const [fundraisingList, setFundraisingList] = useState(undefined)

  // fetch films
  useEffect(() => {
    fetchFilms()
  }, [fetchFilms])

  useEffect(() => {
    ;(async () => {
      //  let nowPlaying = await getnowPlayingMoviesList();
      setNowPlayingMoviesList(() => MoviesDB.movies)
      setUpcomingFilmList(() => MoviesDB.movies)
      setContinueWatchingList(() => MoviesDB.movies)
      setFundraisingList(() => MoviesDB.movies)
    })()
  }, [])

  if (
    nowPlayingMoviesList === undefined ||
    (nowPlayingMoviesList === null && upcomingFilmList === undefined) ||
    (upcomingFilmList === null && continueWatchingList === undefined) ||
    (continueWatchingList === null && fundraisingList === undefined) ||
    fundraisingList === null
  ) {
    return (
      <Modal
        transparent={true}
        visible={true}
        animationType='slide'
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
              <BallIndicator color='#ED3F62' count={9} />
            </Animated.View>
            <Text style={styles.formSubtitle}>Loading</Text>
          </VStack>
        </View>
      </Modal>
    )
  }

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
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
          <Stack direction='column'>
            {/** main featured movies */}
            <View className='space-y-8'>
              <View className='w-full bg-transparent h-16 flex flex-row items-center justify-between px-4'>
                <Pressable
                  onPress={() => {
                    nav.dispatch(DrawerActions.openDrawer())
                  }}
                >
                  <Entypo name='menu' size={30} color={COLORS.formSubTitle} />
                </Pressable>
                <Pressable onPress={() => router.push("/home/search")}>
                  <Feather
                    name='search'
                    size={24}
                    color={COLORS.formSubTitle}
                  />
                </Pressable>
              </View>
              {/* user avatar component */}
              <Avatar />
              <View
                className='flex flex-row items-center justify-between h-20 mx-5 mb-5 rounded-md px-3'
                style={{ backgroundColor: "#36323E66" }}
              >
                <View className='flex flex-col items-start'>
                  <Text className='text-white font-semibold text-lg tracking-tighter '>
                    UGX 1.3 Million
                  </Text>
                  <Text className='text-gray-400 text-base text-sans'>
                    total donations
                  </Text>
                </View>

                <Link href='/(home)/donate'>
                  <View className='flex flex-row items-center gap-x-2'>
                    <Text
                      className='font-semibold text-lg text-sans'
                      style={{ color: COLORS.formLinks }}
                    >
                      View all
                    </Text>
                    <Feather
                      name='arrow-right'
                      size={28}
                      color={COLORS.formLinks}
                    />
                  </View>
                </Link>
              </View>
              <FeaturedSlide films={films} />
            </View>

            {/** upcoming films */}
            <View>
              <Animated.View
                style={{
                  marginBottom: 30,
                  paddingHorizontal: 20,
                  display: "flex",
                  height: 310,
                }}
              >
                <CategoryHeader title='Top Trending' viewMoreArrow={true} />
                <FlatList
                  horizontal
                  data={films}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.containerGap}
                  renderItem={({ item, index }) => {
                    const poster = item.posters[0]?.url ?? item.posterUrl
                    return (
                      <UpcomingMovieCard
                        shouldMarginatedAtEnd={false}
                        cardFunction={() => {
                          if (item?.type === "series") {
                            router.push({
                              pathname: "/(home)/film/[id]/[seasonid]",
                              params: {
                                id: item.id,
                                seasonid: item?.season[0]?.id,
                              },
                            })
                          } else {
                            router.push({
                              pathname: "/(home)/film/[id]",
                              params: { id: item?.id },
                            })
                          }
                        }}
                        title={item.title}
                        posterUrl={poster}
                        cardWidth={width / 2}
                        isFirst={index == 0 ? true : false}
                        isLast={
                          index == upcomingFilmList?.length - 1 ? true : false
                        }
                      />
                    )
                  }}
                />
              </Animated.View>
            </View>

            {/* My watch list */}
            <WatchFlatList />
            <View>
              <Animated.View
                style={{
                  marginBottom: 30,
                  paddingHorizontal: 20,
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
                      shouldMarginatedAtEnd={false}
                      cardFunction={() => {
                        navigation.push("FilmDetails", {
                          filmid: item.id,
                        })
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
                  paddingHorizontal: 20,
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
                      shouldMarginatedAtEnd={false}
                      cardFunction={() => {
                        navigation.push("WatchFilm", {
                          filmid: item.id,
                        })
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
                  paddingHorizontal: 20,
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
                      shouldMarginatedAtEnd={false}
                      cardFunction={() => {
                        navigation.push("FilmDetails", {
                          filmid: item.id,
                        })
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
  )
}

export default Home

const styles = StyleSheet.create({
  overlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "red",
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.3,
    shadowOpacity: "20 30 40 10",
  },
  menuBarIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    width: 50,
    height: 50,
    position: "absolute",
    top: 8,
    right: 20,
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
    gap: 20,
  },
})
