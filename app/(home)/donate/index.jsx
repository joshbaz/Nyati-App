import { DrawerActions } from "@react-navigation/native"
import { router, useNavigation } from "expo-router"
import React from "react"
import {
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { HStack, VStack } from "@react-native-material/core"
import { Feather } from "@expo/vector-icons"
import useDonateFilms from "../../../hooks/useDonateFilms"
import { COLORS, FONTSFAMILIES } from "../../../src/color/VariableColors"
import FilmFundCard from "../../../src/components/FilmFundCard"
import SplashScreen from "../../../src/components/SplashScreen"
import UpcomingMovieCard from "../../../src/components/UpcomingMovieCard"

const { width } = Dimensions.get("window")

const options = [
  { label: "All", value: "all" },
  { label: "Movies", value: "movie" },
  { label: "TV Shows", value: "series" },
]

const Donate = () => {
  const nav = useNavigation()
  const { films, loading } = useDonateFilms()
  const [type, setType] = React.useState("all")

  const toggleActive = (value) => {
    if (value === type) return
    setType(value)
  }

  if (loading && !films.length > 0) {
    return <SplashScreen hideLogo={true} />
  }

  return (
    <View
      style={{
        flex: 1,
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <Animated.View
              style={[
                {
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "flex-start",
                },
              ]}
            >
              <VStack
                spacing={30}
                style={{
                  width: "95%",
                }}
              >
                {/** form -Titles & subtitle */}
                <HStack
                  spacing={20}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    paddingVertical: 20,
                  }}
                >
                  <Pressable
                    className='flex flex-row items-center justify-center'
                    onPress={() => nav.dispatch(DrawerActions.openDrawer())}
                  >
                    <Feather name='menu' size={24} color='white' />
                    <Text style={styles.formTitle} className='ml-4'>
                      Donate
                    </Text>
                  </Pressable>
                  <Pressable
                    className='flex flex-row items-center justify-center'
                    onPress={() => console.log("search")}
                  >
                    <Feather name='search' size={24} color='white' />
                  </Pressable>
                </HStack>
                <View className='w-full'>
                  <FlatList
                    horizontal
                    data={options}
                    keyExtractor={(item) => item.value}
                    contentContainerStyle={{ gap: 10 }}
                    renderItem={({ item }) => {
                      return (
                        <Pressable
                          aria-selected={type === item.value}
                          onPress={() => toggleActive(item.value)}
                          className='rounded-full flex items-center justify-center border border-primary-500 aria-[selected=true]:rounded-sm'
                          style={[
                            {
                              padding: 10,
                              height: 40,
                              width: 100,

                              backgroundColor:
                                type === item.value
                                  ? COLORS.formBtnBg
                                  : COLORS.formBg,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              {
                                color:
                                  type === item.value
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

                {/* Donation Film List */}
                {films?.length > 0
                  ? films.map((item, idx) => {
                      const poster = item.posters
                        ? item.posters[0]?.url
                        : item.posterUrl
                      return (
                        <FilmFundCard
                          key={item.id}
                          shouldMarginatedAtEnd={false}
                          cardFunction={() => {
                            router.push({
                              pathname: "/(home)/donate/[id]",
                              params: { id: item?.id },
                            })
                          }}
                          title={item.title}
                          posterUrl={poster}
                          cardWidth={width / 2 - 25} //
                          isFirst={idx == 0 ? true : false}
                          isLast={idx == films?.length - 1 ? true : false}
                        />
                      )
                    })
                  : null}
              </VStack>
            </Animated.View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default Donate

const styles = StyleSheet.create({
  formTitle: {
    color: COLORS.formTitle,
    fontFamily: FONTSFAMILIES.formTitlefont,
    fontSize: 20,

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
    borderBottomColor: "#06F",
    borderBottomWidth: 1,
  },
  formLabel: {
    fontFamily: "Inter-SemiBold",
    color: "#FFFAF6",
    fontSize: 16,

    letterSpacing: -0.28,
    textAlign: "center",
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
  amountContainer: {
    height: 48,
    width: "100%",
    backgroundColor: COLORS.formBg,
    borderRadius: 6,
    borderColor: "#EE5170",
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: 10,
  },
  amountInput: {
    width: "80%",
    paddingLeft: 10,
    paddingRight: 10,
    color: COLORS.formText,
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
  },
  amountIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "20%",
    backgroundColor: "transparent",
    alignSelf: "flex-start",
  },
  amountIconTxt: {
    color: COLORS.formText,
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
  },
  amountSelectorWrap: {
    marginHorizontal: "auto",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  amountSelectorBtn: {
    borderWidth: 1,
    borderColor: "#ED3F62",
    borderRadius: 24,
    paddingVertical: 9,
    paddingHorizontal: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  amountSelectorTxt: {
    color: "#ED3F62",
    fontFamily: "Inter-ExtraBold",
    fontSize: 14,
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
  horizontalLine: {
    borderBottomColor: "rgba(242, 242, 242, 0.60)",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  checkboxTxt: {
    color: "rgba(255, 250, 246, 0.60)",
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },
  privacyBtnLink: {
    alignSelf: "flex-start",
    borderBottomColor: "#06F",
    borderBottomWidth: 1,
  },

  privacyPolicy: {
    color: "#06F",
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },
})
