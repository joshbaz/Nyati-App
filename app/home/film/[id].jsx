import { LinearGradient } from "expo-linear-gradient"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { VStack } from "@react-native-material/core"
import { Feather } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"
// import MoviesDB from "../../../assets/data/db.json"
import useFilms from "../../../hooks/useFilms"
import { COLORS } from "../../../src/color/VariableColors"
import Loader from "../../../src/components/Loader"
import VideoPlayer from "../../../src/components/VideoPlayer"

const { width } = Dimensions.get("window")

function FilmDetails() {
  const videoRef = useRef(null)
  const { id } = useLocalSearchParams()
  const { film, fetchFilm, isFetching } = useFilms()
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchFilm(id)
  }, [fetchFilm, id])

  const trailerUrl = useMemo(() => {
    if (!film?.id) return ""

    const BASE_URL = process.env.EXPO_PUBLIC_API_URL
    return `${BASE_URL}/api/v1/film/stream/${film?.id}` //TODO: change this to the trailer url
  }, [film?.trailers, film?.id])

  const playTrailer = async () => {
    setShowTrailer(true)
    if (videoRef.current) {
      videoRef.current.playAsync()
    }
  }

  return (
    <Loader isLoading={!film || isFetching}>
      <View
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          flex: 1,
          marginVertical: 0,
          backgroundColor: COLORS.generalBg,
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              display: "flex",
              alignItems: "start",
              justifyContent: "flex-start",
              width: "100%",
              backgroundColor: COLORS.formBg,
            }}
          >
            <View
              style={{
                height: 400,
                width: "100%",
                display: "flex",
              }}
            >
              {!showTrailer ? (
                <ImageBackground
                  source={{
                    uri:
                      film?.posters[0]?.url ??
                      "https://images-na.ssl-images-amazon.com/images/M/MV5BMjYxMDcyMzIzNl5BMl5BanBnXkFtZTYwNDg2MDU3._V1_SX300.jpg",
                  }}
                  style={{
                    ...styles.cardImage,
                    height: "100%",
                    width: "100%",
                    position: "relative",
                    zIndex: 1,
                    top: 0,
                  }}
                  resizeMode='cover'
                >
                  <LinearGradient
                    colors={[
                      COLORS.generalOpacity2,
                      COLORS.generalOpacity2,
                      COLORS.generalBg,
                    ]}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <View style={styles.arrowBackBtn}>
                      <TouchableOpacity onPress={() => router.back()}>
                        <Feather name='arrow-left' size={30} color='white' />
                      </TouchableOpacity>
                    </View>
                    {/* <View style={styles.trailerBtnWrap}>
                      {trailerUrl && (
                        <TouchableOpacity
                          style={styles.trailerBtn}
                          onPress={async () => {
                            setShowTrailer(true)
                            if (videoRef.current) {
                              videoRef.current.playAsync()
                            }
                          }}
                        >
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
                                name='play-outline'
                                size={24}
                                color='#980F2A'
                              />
                            </View>
                            <Text style={styles.btnText}>Play trailer</Text>
                          </HStack>
                        </TouchableOpacity>
                      )}
                    </View> */}
                  </LinearGradient>
                </ImageBackground>
              ) : (
                <VideoPlayer ref={videoRef} source={trailerUrl} />
              )}
            </View>
            <VStack style={{ width: "100%", flex: 1 }}>
              {/** video trailer */}

              {/** About details */}
              <Details
                film={film}
                playTrailer={playTrailer}
                showTrailer={showTrailer}
              />
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Loader>
  )
}

function Details({ film, playTrailer, showTrailer }) {
  return (
    <View style={styles.detailWrap}>
      <View
        className='space-y-4'
        style={{ paddingVertical: 20, paddingHorizontal: 16 }}
      >
        {/** first section */}
        <View className='min-h-10 w-full h-auto flex flex-row items-start justify-between'>
          <View className='flex flex-col items-start justify-start gap-y-1'>
            <Text className='text-2xl font-bold capitalize text-white'>
              {film?.title}
            </Text>
            <Text className='text-xs font-bold text-gray-300 text-sans'>
              2010 &bull; Film &bull; Drama{" "}
            </Text>
          </View>
          {showTrailer ? (
            <Pressable
              className='flex flex-row items-center justify-center h-16 w-16 rounded-full p-3 bg-gray-500/50 border border-white'
              onPress={async () => {
                // bookmark it
                console.log("bookmarking")
              }}
            >
              <View className='border-2 border-white rounded-full p-1.5 flex items-center justify-center'>
                <Feather name='bookmark' size={20} color='white' />
              </View>
            </Pressable>
          ) : (
            <Pressable
              className='flex flex-row items-center justify-center h-16 w-16 rounded-full p-2'
              style={{ backgroundColor: COLORS.formBtnBg }}
              onPress={async () => {
                router.push("/home/film/watch/[id]", { id: film?.id })
              }}
            >
              <Image
                source={require("../../../assets/playcircle.png")}
                style={{ width: 36, height: 36 }}
                resizeMode='contain'
              />
              {/* <Ionicons name='play-circle-outline' size={40} color='white' /> */}
            </Pressable>
          )}
        </View>
        <View className='space-y-2'>
          <View className='flex flex-row items-center gap-x-2'>
            <Image
              source={require("../../../assets/bagheart.png")}
              style={{ width: 24, height: 24 }}
              resizeMode='contain'
            />

            <Text className='text-gray-300 font-medium tracking-tight text-lg'>
              Free to watch
            </Text>
          </View>
          <View className='flex flex-row items-center gap-x-4'>
            <TouchableOpacity
              onPress={() => props.cardFunction()}
              className='flex flex-row items-center justify-center gap-x-2 h-14 border-2 border-gray-400 rounded-full bg-gray-500/30'
              style={{
                width: 200,
              }}
            >
              <Feather name='plus-circle' size={30} color='white' />
              <Text className='text-gray-100 font-semibold text-lg'>
                Watchlist
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text className='text-gray-400 font-medium text-lg'>
            {film?.overview}
          </Text>
        </View>
        {/** divider */}
        {/* <View style={styles.horizontalLine} /> */}
        {/** funds raised */}
        {/* <VStack spacing={18} style={{ paddingVertical: 30 }}>
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
            <TouchableOpacity
              style={styles.donateBtn}
              onPress={() => {
                router.push("donate")
              }}
            >
              <Text style={styles.donateBtnTxt}>Donate</Text>
            </TouchableOpacity>
          </View>
        </VStack> */}

        {/** More like this*/}
        <VStack style={{ paddingVertical: 33 }}>
          <Animated.View
            style={{
              marginBottom: 30,
              display: "flex",
              height: 280,
            }}
          >
            <Text style={[styles.containerSubTitle, { marginBottom: 30 }]}>
              More Like This
            </Text>
            {/* <FlatList
              horizontal
              data={upcomingFilmList}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.containerGap}
              renderItem={({ item, index }) => (
                <FilmFundCard
                  shouldMarginatedAtEnd={true}
                  cardFunction={() => {
                    navigation.push("FilmDetails", {
                      filmid: item.id,
                    })
                  }}
                  title={item.title}
                  posterUrl={item.posterUrl}
                  cardWidth={width / 2}
                  isFirst={index == 0 ? false : false}
                  isLast={index == upcomingFilmList?.length - 1 ? false : false}
                />
              )}
            /> */}
          </Animated.View>
        </VStack>
      </View>
    </View>
  )
}

export default FilmDetails

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
})
