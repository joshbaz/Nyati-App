import { router, useLocalSearchParams } from "expo-router"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
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
import MoviesDB from "../../../assets/data/db.json"
import { useAuth } from "../../../context/AuthProvider"
import { useFilmCtx } from "../../../context/FilmProvider"
import useFilms from "../../../hooks/useFilms"
import useWatchList from "../../../hooks/useWatchList"
import { COLORS } from "../../../src/color/VariableColors"
import CategoryHeader from "../../../src/components/CategoryHeader"
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
  }, [film.id])

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
  const { user } = useAuth()
  const { fetchFilm } = useFilmCtx()
  const [upcomingFilmList] = useState(MoviesDB.movies || undefined)

  // handle watchlist
  const { handleAddToWatchlist, loading } = useWatchList({ disableFetch: true })

  const isItemInWatchlist = film?.watchlist?.find(
    (item) => item?.userId === user?.id,
  )

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
        <View className='space-y-2'>
          <AccessSection film={film} />
          {isItemInWatchlist ? null : (
            <View className='flex flex-row items-center gap-x-4'>
              <TouchableOpacity
                onPress={() => handleAddToWatchlist(film?.id, fetchFilm)}
                className='flex flex-row items-center justify-center gap-x-2 h-14 border-2 border-gray-400 rounded-full bg-gray-500/30'
                style={{
                  width: 200,
                }}
              >
                {loading ? (
                  <ActivityIndicator color='white' size={30} />
                ) : (
                  <>
                    <Feather name='plus-circle' size={30} color='white' />
                    <Text className='text-gray-100 font-semibold text-lg'>
                      Watchlist
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className='relative'>
          <ReadMoreCard content={film?.overview} linesToShow={5} />
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

function AccessSection({ film }) {
  const { fetchFilm } = useFilmCtx()
  const { removeItemFromWatchList, handleAddToWatchlist } = useWatchList({
    disableFetch: true,
  })
  const access = useMemo(() => {
    if (film?.access === "free") return "Free to watch"
    return "Available to rent or buy"
  }, [film?.access])

  const shouldShowPurchaseBtn = useMemo(() => {
    if (film?.access === "free") return false
    return true
  }, [film?.access])

  const numFormat = new Intl.NumberFormat("en-UG", {
    currency: "UGX",
    style: "decimal",
  })

  const watchlistId = useMemo(() => {
    if (!film?.watchlist) return false
    const item = film?.watchlist.find((item) => {
      const available = item?.filmId === film?.id
      if (available && item?.type === "SAVED") return item?.id
      return null
    })
    return item?.id
  }, [film])

  const options = [
    {
      label: "Play Trailer",
      icon: "play",
      onPress: () => {
        console.log("play trailer")
      },
    },
    {
      label: watchlistId ? "Remove Watchlist" : "Watch List",
      icon: watchlistId ? "x" : "plus",
      onPress: () => {
        if (watchlistId) {
          console.log("removing from watchlist", watchlistId)
          removeItemFromWatchList(watchlistId, film?.id, fetchFilm)
        } else {
          handleAddToWatchlist(film?.id, fetchFilm)
        }
      },
    },
    {
      label: "Like",
      icon: "thumbs-up",
      onPress: () => {
        console.log("play trailer")
      },
    },
    {
      label: "Not for me",
      icon: "thumbs-down",
      onPress: () => {
        console.log("play trailer")
      },
    },
  ]

  return (
    <View className='w-full space-y-6'>
      <View className='flex flex-row items-center gap-x-2'>
        <Image
          source={require("../../../assets/bagheart.png")}
          style={{ width: 26, height: 26 }}
          resizeMode='contain'
        />

        <Text className='text-white font-medium tracking-tight text-lg'>
          {access}
        </Text>
      </View>
      {shouldShowPurchaseBtn ? (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(home)/film/purchase",
              params: {
                filmId: film?.id,
                amount: film?.price,
                access: film?.access,
              },
            })
          }
          className='flex flex-row items-center justify-center h-16 border-2 border-primary-500 rounded-3xl w-full'
          style={{
            backgroundColor: COLORS.formBg,
          }}
        >
          <Text className='text-primary-500 font-semibold text-xl'>
            {film?.access === "rent" ? "Rent @ " : "Buy @ "}{" "}
            {`UGX ${numFormat.format(film?.price)}`}
          </Text>
        </TouchableOpacity>
      ) : null}

      <View className='flex flex-row items-center justify-between gap-x-4'>
        <FlatList
          data={options}
          horizontal
          keyExtractor={(item) => item.label}
          contentContainerStyle={{ gap: 20 }}
          style={{ width: width / 4 }}
          renderItem={({ item }) => (
            <View
              key={item?.label}
              className='space-y-3 flex flex-col justify-center items-center w-auto'
            >
              <Pressable
                className='flex flex-row items-center justify-center h-14 w-14 rounded-full p-2 bg-gray-500/50 border border-white'
                onPress={item?.onPress}
              >
                <View className='border border-white rounded-full p-1.5 flex items-center justify-center'>
                  <Feather name={item.icon} size={16} color='white' />
                </View>
              </Pressable>
              <Text className='text-white'>{item.label}</Text>
            </View>
          )}
        />
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
