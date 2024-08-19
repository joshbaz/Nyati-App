import { DrawerActions } from "@react-navigation/native"
import { it } from "date-fns/locale"
import { router, useNavigation } from "expo-router"
import React from "react"
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import useWatchList from "../../hooks/useWatchList"
import { COLORS, FONTSFAMILIES } from "../../src/color/VariableColors"
import SplashScreen from "../../src/components/SplashScreen"
import UpcomingMovieCard from "../../src/components/UpcomingMovieCard"

const { width } = Dimensions.get("window")

function WatchlistPage() {
  const nav = useNavigation()
  const [active, setActive] = React.useState("all")
  const { watchList: list, loading } = useWatchList({
    limit: 20,
    filters: { type: active === "all" ? "" : active },
  })

  if (loading) {
    return <SplashScreen hideLogo={true} />
  }

  const toggleActive = (value) => {
    if (value === active) return
    setActive(value)
  }

  const options = [
    { label: "All", value: "all" },
    { label: "Movies", value: "movie" },
    { label: "Series", value: "series" },
  ]

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
          <View className='w-full px-4 py-4 flex flex-row items-center justify-between'>
            <TouchableOpacity
              onPress={() => router.back()}
              className='flex flex-row items-center justify-start w-fit'
            >
              <Feather name='arrow-left' size={24} color='white' />
              <Text className='text-white ml-2 text-lg font-bold'>
                Watchlist
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => nav.dispatch(DrawerActions.openDrawer())}
              className='flex flex-row items-center justify-start w-fit'
            >
              <Feather name='menu' size={24} color='white' />
            </TouchableOpacity>
          </View>
          <View className='w-full px-4 py-4'>
            <FlatList
              horizontal
              data={options}
              keyExtractor={(item) => item.value}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => {
                return (
                  <Pressable
                    aria-selected={active === item.value}
                    onPress={() => toggleActive(item.value)}
                    className='rounded-full flex items-center justify-center border border-primary-500 aria-[selected=true]:rounded-sm'
                    style={[
                      {
                        padding: 10,
                        height: 40,
                        width: 100,

                        backgroundColor:
                          active === item.value
                            ? COLORS.formBtnBg
                            : COLORS.formBg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        {
                          color:
                            active === item.value
                              ? COLORS.formBtnText
                              : COLORS.formText,
                          fontFamily: FONTSFAMILIES.formBtnText,
                          fontSize: 16,
                          lineHeight: 20,
                          letterSpacing: 0.1,
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )
              }}
            />
          </View>
          {list && list.length > 1 ? (
            <View
              className='w-full px-4 flex flex-2 flex-row'
              style={{ gap: 20 }}
            >
              {/* <FlatList
                data={list}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item, index }) => {
                  const poster = item.posters[0]?.url ?? item.posterUrl
                  return (
                    <View className='w-1/2'>
                      <UpcomingMovieCard
                        shouldMarginatedAtEnd={false}
                        cardFunction={() => {
                          router.push({
                            pathname: "/(home)/film/[id]",
                            params: { id: item?.id },
                          })
                        }}
                        title={item.title}
                        posterUrl={poster}
                        cardWidth={width / 2.3}
                        isFirst={index == 0 ? true : false}
                        isLast={index == list?.length - 1 ? true : false}
                      />
                      <View>
                        <Text className='text-white'>Watchlist</Text>
                      </View>
                    </View>
                  )
                }}
              /> */}
              {list.map((item, idx) => {
                const poster = item.posters[0]?.url ?? item.posterUrl
                return (
                  <View key={item?.id} className='even:ml-10'>
                    <UpcomingMovieCard
                      shouldMarginatedAtEnd={false}
                      cardFunction={() => {
                        router.push({
                          pathname: "/(home)/film/[id]",
                          params: { id: item?.id },
                        })
                      }}
                      title={item.title}
                      posterUrl={poster}
                      cardWidth={width / 2 - 25} //
                      isFirst={idx == 0 ? true : false}
                      isLast={idx == list?.length - 1 ? true : false}
                    />
                    <View>
                      <Text className='text-white text-lg'>Watchlist</Text>
                    </View>
                  </View>
                )
              })}
            </View>
          ) : (
            <View className='max-h-96 h-full flex flex-col items-center justify-center'>
              <Text className='text-white text-lg'>
                No {active === "all" ? "films" : active} in your watchlist
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

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

export default WatchlistPage
