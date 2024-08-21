import { LinearGradient } from "expo-linear-gradient"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { ProgressBar } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather, Ionicons } from "@expo/vector-icons"
import MoviesDB from "../../../assets/data/db.json"
import { useAuth } from "../../../context/AuthProvider"
import useDonateFilms from "../../../hooks/useDonateFilms"
import useWatchList from "../../../hooks/useWatchList"
import { COLORS } from "../../../src/color/VariableColors"
import CategoryHeader from "../../../src/components/CategoryHeader"
import ReadMoreCard from "../../../src/components/ReadMore"
import SplashScreen from "../../../src/components/SplashScreen"
import UpcomingMovieCard from "../../../src/components/UpcomingMovieCard"

const { width } = Dimensions.get("window")

function DonationFilmPage() {
  const { user } = useAuth()
  const { id } = useLocalSearchParams()
  const { film, getDonateFilm, loading } = useDonateFilms(true)
  const { handleAddToWatchlist, loading: isLoading } = useWatchList({
    disableFetch: true,
  })

  const [upcomingFilmList] = React.useState(() => MoviesDB.movies)

  // fetch film on mount
  useEffect(() => {
    if (id) {
      getDonateFilm(id)
    }
  }, [id, getDonateFilm])

  if (loading && !film) {
    return <SplashScreen hideLogo={true} />
  }

  const poster = film?.posters ? film?.posters[0]?.url : film?.posterUrl

  // check if film is already in watchlist
  const isItemInWatchlist = film?.watchlist?.find(
    (item) => item?.userId === user?.id,
  )
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.generalBg }}>
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          width: "100%",
          marginTop: 0,
        }}
      >
        <ImageBackground
          source={{
            uri: poster,
          }}
          style={{
            width: "100%",
            height: 380,
            resizeMode: "cover",
            position: "relative",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)"]}
            style={{ width: "100%", height: "100%" }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View className='h-full w-full px-4 flex flex-col item-start justify-between'>
                <View>
                  <Pressable onPress={() => router.back()}>
                    <Ionicons name='arrow-back' size={30} color='white' />
                  </Pressable>
                </View>
                <View>
                  {isItemInWatchlist ? null : (
                    <TouchableOpacity
                      onPress={handleAddToWatchlist}
                      className='flex flex-row items-center justify-center h-14 border-2 border-white rounded-full bg-gray-50/30 backdrop-blur-sm w-full'
                    >
                      {isLoading ? (
                        <ActivityIndicator color='white' size={30} />
                      ) : (
                        <>
                          <Feather name='plus-circle' size={26} color='white' />
                          <Text className='ml-3 text-gray-100 font-semibold text-lg'>
                            Watchlist
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>
        <SafeAreaView style={{ flex: 1, width: "100%" }}>
          <View className='w-full px-4 space-y-6'>
            <View className='w-full'>
              <Text className='text-white text-2xl font-bold'>
                {film?.title}
              </Text>
              <Text className='text-gray-400 text-xl font-semibold'>
                100 views | 2 days ago
              </Text>
            </View>
            <View className='w-full h-0.5 bg-slate-400 my-4' />
          </View>
          {/* Donation stats */}
          <View className='space-y-4 w-full px-4 py-3'>
            <View className='flex flex-row items-center justify-between'>
              <Text className='text-primary-300 text-lg'>1,323,092 UGX</Text>
              <Text className='text-white'>funds raised from 14,000,000</Text>
            </View>
            <View>
              <ProgressBar
                progress={0.5}
                color={COLORS.formBtnBg}
                borderRadius={20}
                style={{
                  backgroundColor: "#EEF1F4",
                  borderRadius: 10,
                  width: "100%",
                }}
              />
            </View>
            <View className='flex flex-row items-center justify-between'>
              <Text className='text-primary-400 text-lg flex flex-row items-center'>
                <Text>10 </Text>
                <Text className='text-white'>Donors</Text>
              </Text>
              <Text className='text-primary-400 text-lg flex flex-row items-center'>
                <Text>20 </Text>
                <Text className='text-white'>Days left</Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(home)/donate/amount",
                  params: { filmId: film?.id },
                })
              }
              className='flex flex-row items-center justify-center h-14 border-2 rounded-full bg-primary-500 backdrop-blur-sm w-full'
            >
              {isLoading ? (
                <ActivityIndicator color='white' size={30} />
              ) : (
                <Text className='ml-3 text-gray-100 font-semibold text-lg'>
                  Donate
                </Text>
              )}
            </TouchableOpacity>
            <View className='w-full h-0.5 bg-slate-400 my-4' />
          </View>
          {/* About the film */}
          <View className='px-4 py-4'>
            <View className='space-y-4'>
              <Text className='text-primary-400 text-xl mb-2'>About film</Text>
              <ReadMoreCard content={film?.overview} linesToShow={6} />
            </View>
            <View>
              <CategoryHeader title='More Like This' viewMoreArrow={true} />
              <FlatList
                horizontal
                data={upcomingFilmList}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 20 }}
                renderItem={({ item, index }) => (
                  <UpcomingMovieCard
                    shouldMarginatedAtEnd={false}
                    cardFunction={() => {
                      router.replace({
                        pathname: "/(home)/donate/[id]",
                        params: { id: item?.id },
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
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  )
}

export default DonationFilmPage
