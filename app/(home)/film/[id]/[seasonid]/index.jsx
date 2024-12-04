import { COLORS } from "@/color/VariableColors"
import Loader from "@/components/Loader"
import PageLayoutWrapper from "@/components/PageLayoutWrapper"
import ReadMoreCard from "@/components/ReadMore"
import { useFilmCtx } from "context/FilmProvider"
import { format } from "date-fns"
import { LinearGradient } from "expo-linear-gradient"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect } from "react"
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import RNPickerSelect from "react-native-picker-select"
import { AntDesign, Feather } from "@expo/vector-icons"

function SeasonPage() {
  const { width } = Dimensions.get("window")
  const params = useLocalSearchParams() // filmId, seasonId
  const { film, season, fetchSeason, isFetching, selectSeason, selectEpisode } =
    useFilmCtx()

  useEffect(() => {
    if (params?.seasonid) {
      fetchSeason(params?.id)
    }
  }, [params?.id, fetchSeason])

  const seasonOptions =
    film?.season?.length > 0
      ? film?.season.map((sn) => ({
          label: sn.title,
          value: sn.id,
        }))
      : []

  console.log(season?.episodes)
  return (
    <Loader isLoading={isFetching}>
      <PageLayoutWrapper removePadding>
        <View className='flex items-start justify-start w-full h-72'>
          <ImageBackground
            source={{
              uri: film?.posters[0]?.url,
            }}
            style={{
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
                COLORS.generalOpacity,
                COLORS.generalOpacity,
                COLORS.generalBg,
              ]}
              style={{ width: "100%", height: "100%" }}
            >
              <View style={styles.arrowBackBtn}>
                <TouchableOpacity onPress={() => router.back()}>
                  <Feather name='arrow-left' size={30} color='white' />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
        <View className='w-full space-y-2 px-5'>
          <Text className='text-white font-bold text-3xl'>{film?.title}</Text>
          <Text className='text-sm text-gray-300 text-sans'>
            {new Date(film?.releaseDate).getFullYear()} &bull;{" "}
            {film?.genre.join(" \u2022 ")}
          </Text>

          <View className='flex flex-row items-center justify-between w-full'>
            <RNPickerSelect
              value={season?.id}
              onValueChange={(value) => {
                selectSeason(value)
                router.push(`/film/${params.id}/${value}`)
              }}
              items={seasonOptions}
              placeholder='Select Season'
              style={{
                inputIOS: {
                  backgroundColor: "#302d38",
                  color: "white",
                  fontSize: 15,
                  fontWeight: "bold",
                  height: 50,
                  width: width - 40,
                  paddingHorizontal: 10,
                  borderRadius: 1,
                  textTransform: "capitalize",
                },
                viewContainer: {
                  backgroundColor: "#302d38",
                  borderRadius: 1,
                  width: 300,
                  fontWeight: "bold",
                },
                inputAndroid: {
                  backgroundColor: "#302d38",
                  color: "#FFFAF6",
                  fontFamily: "Inter-Bold",
                  fontSize: 15,
                  height: 50,
                  width: 300,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                },

                chevronContainer: {
                  background: "green",
                },
                chevron: {
                  display: "none",
                },
                modalViewBottom: {
                  backgroundColor: "#302d38",
                },
                modalViewMiddle: {
                  backgroundColor: "#302d38",
                  borderBlockColor: "#302d38",
                  color: "#FFFAF6",
                },
              }}
            />
          </View>
          <View className='mt-10 w-full relative min-h-20'>
            <ReadMoreCard
              renderContent={() => (
                <View className='flex flex-col gap-y-1'>
                  <Text className='text-white font-medium text-lg'>
                    {film?.overview}
                  </Text>
                  <Text className='text-white font-medium text-lg'>
                    {film?.plotSummary}
                  </Text>
                </View>
              )}
              linesToShow={4}
            />
          </View>
          <View className='flex flex-1 space-y-4'>
            <Text className='text-white font-bold text-xl'>Episodes</Text>

            {season?.episodes?.length > 0 ? (
              <View className='flex flex-col items-center justify-center '>
                {season?.episodes.map((ep) => {
                  const epPoster = ep?.posters[0]?.url
                  return (
                    <View key={ep.id} className='flex flex-1 space-y-3 w-full'>
                      <ImageBackground
                        source={{
                          uri: epPoster,
                        }}
                        style={{
                          height: 200,
                          width: "100%",
                          position: "relative",
                          zIndex: 1,
                          top: 0,
                          borderRadius: 10,
                        }}
                        resizeMode='cover'
                      />

                      <View className='space-y-2'>
                        <Text className='text-white font-bold text-xl'>
                          S{season?.season} Ep{ep?.episode} - {ep?.title}
                        </Text>
                        <Text className='text-white font-medium text-sm'>
                          {ep?.releaseDate
                            ? format(new Date(ep?.releaseDate), "MMM dd, yyyy")
                            : ""}
                        </Text>

                        <TouchableOpacity
                          onPress={() => {
                            selectEpisode(ep.id)
                            router.push(
                              `/film/${params.id}/${season.id}/${ep.id}`,
                            )
                          }}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            padding: 12,
                            borderRadius: 100,
                            backgroundColor: "#302d38",
                            width: "50%",
                            height: 54,
                          }}
                        >
                          <AntDesign
                            name='exclamationcircleo'
                            size={24}
                            color='white'
                          />
                          <Text className='text-white font-medium text-lg ml-2'>
                            More Details
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                })}
              </View>
            ) : null}
          </View>
        </View>
      </PageLayoutWrapper>
    </Loader>
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

export default SeasonPage
