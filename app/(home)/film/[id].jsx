import { router, useLocalSearchParams } from "expo-router"
import React, { useCallback, useEffect, useState } from "react"
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { VStack } from "@react-native-material/core"
import { Feather } from "@expo/vector-icons"
import MoviesDB from "../../../assets/data/db.json"
import { useFilmCtx } from "../../../context/FilmProvider"
import { COLORS } from "../../../src/color/VariableColors"
import CategoryHeader from "../../../src/components/CategoryHeader"
import FilmActions from "../../../src/components/FilmActions"
import Loader from "../../../src/components/Loader"
import ReadMoreCard from "../../../src/components/ReadMore"
import UpcomingMovieCard from "../../../src/components/UpcomingMovieCard"
import VideoPlayer from "../../../src/components/VideoPlayer"

const { width } = Dimensions.get("window")

const getMainVideo = (film) => {
  if (!film?.video) return null
  //filter out trailers
  const mainVideo = film?.video?.find((video) => !video?.isTrailer)
  if (!mainVideo) return null
  return mainVideo?.id
}

function FilmDetails() {
  const { id, trackid } = useLocalSearchParams()
  const { film, fetchFilm, isFetching } = useFilmCtx()
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchFilm(id)
  }, [fetchFilm, id])

  const playFilm = useCallback(async () => {
    router.setParams({ trackid: getMainVideo(film) })
  }, [film?.id])

  return (
    <Loader isLoading={!film && isFetching}>
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
              className='flex flex-1 items-start justify-start w-full'
              style={{
                height: 400,
                flex: 1,
              }}
            >
              <VideoPlayer
                posterSource={film?.posters[0]?.url}
                handleFullscreen={(fullscreen) => setIsFullscreen(fullscreen)}
              />
            </View>

            {isFullscreen ? null : (
              <VStack style={{ width: "100%", flex: 1 }}>
                <Details film={film} play={playFilm} showFilm={!!trackid} />
              </VStack>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Loader>
  )
}

function Details({ film, play, showFilm }) {
  const [upcomingFilmList] = useState(MoviesDB.movies || undefined)
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
          {showFilm ? (
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
              onPress={() => play()}
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
        <View>
          <FilmActions film={film} />
        </View>
        <View className='relative space-y-2 py-4'>
          <Text className='text-white font-semibold text-xl'>
            Film Information
          </Text>
          <View>
            <ReadMoreCard content={film?.overview} linesToShow={5} />
          </View>
        </View>
        {/** divider */}
        {/* <View style={styles.horizontalLine} /> */}
        <View>
          <CategoryHeader title='Start Watching' viewMoreArrow={true} />
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
                isLast={index == upcomingFilmList?.length - 1 ? true : false}
              />
            )}
          />
        </View>
      </View>
    </View>
  )
}

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

export default FilmDetails
