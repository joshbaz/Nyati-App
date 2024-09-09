import { router } from "expo-router"
import React from "react"
import { Dimensions, FlatList, Pressable, Text, View } from "react-native"
import useWatchList from "../../hooks/useWatchList"
import { COLORS, FONTSFAMILIES } from "../../src/color/VariableColors"
import PageLayoutWrapper from "../../src/components/PageLayoutWrapper"
import SplashScreen from "../../src/components/SplashScreen"
import TopNav from "../../src/components/TopNav"
import UpcomingMovieCard from "../../src/components/UpcomingMovieCard"

const { width } = Dimensions.get("window")

function WatchlistPage() {
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
    { label: "TV Shows", value: "series" },
  ]

  return (
    <PageLayoutWrapper>
      <TopNav title='Watchlist' />
      <View className='w-full  py-4'>
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
                      active === item.value ? COLORS.formBtnBg : COLORS.formBg,
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
        <View className='w-full flex flex-2 flex-row' style={{ gap: 20 }}>
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
    </PageLayoutWrapper>
  )
}

export default WatchlistPage
