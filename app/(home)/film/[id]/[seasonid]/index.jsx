import { COLORS } from "@/color/VariableColors"
import Loader from "@/components/Loader"
import PageLayoutWrapper from "@/components/PageLayoutWrapper"
import { useFilmCtx } from "context/FilmProvider"
import { LinearGradient } from "expo-linear-gradient"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect } from "react"
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { PaperProvider } from "react-native-paper"
import { Dropdown } from "react-native-paper-dropdown"
import { Picker } from "@react-native-picker/picker"
import { Feather } from "@expo/vector-icons"

function SeasonPage() {
  const params = useLocalSearchParams() // filmId, seasonId
  const { film, season, fetchSeason, isFetching, selectSeason } = useFilmCtx()

  console.log(params)

  useEffect(() => {
    if (params?.seasonid) {
      fetchSeason(params?.id)
    }
  }, [params?.id, fetchSeason])
  return (
    <Loader isLoading={isFetching}>
      <PageLayoutWrapper>
        <View className='flex items-start justify-start w-full h-72 bg-green-400'>
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
        <View className='w-full space-y-2'>
          <Text className='text-white font-bold text-3xl'>{film?.title}</Text>
          <Text className='text-xs font-bold text-gray-300 text-sans'>
            {new Date(film?.releaseDate).getFullYear()} &bull;{" "}
            {film?.genre.join(" \u2022 ")}
          </Text>

          {/* <View className='bg-blue-200'> */}
          <Picker
            selectedValue={season?.id}
            onValueChange={(value) => selectSeason(value)}
            selectionColor={"#FFFAF6"}
            style={{
              backgroundColor: "#302d38",
              height: 50,
            }}
            itemStyle={{
              color: "#FFFAF6",
              fontFamily: "Inter-Bold",
              fontSize: 15,
              height: 50,
            }}
            dropdownIconColor={"#FFFAF6"}
          >
            {film?.season?.length > 0 &&
              film?.season.map((season) => (
                <Picker.Item
                  key={season.id}
                  value={season.id}
                  label={season.id}
                >
                  {season.title}
                </Picker.Item>
              ))}
          </Picker>

          <PaperProvider>
            <View style={{ margin: 16 }}>
              <Dropdown
                label='Select season'
                placeholder='Select season'
                options={film?.season ?? []}
                value={season?.id}
                onSelect={(value) => selectSeason(value)}
              />
            </View>
          </PaperProvider>
          {/* </View> */}
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
