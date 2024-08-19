import React from "react"
import { Animated, Dimensions, FlatList, View } from "react-native"
import useWatchList from "../../hooks/useWatchList"
import CategoryHeader from "./CategoryHeader"
import UpcomingMovieCard from "./UpcomingMovieCard"

const { width } = Dimensions.get("window")

function WatchFlatList() {
  const { watchList: list } = useWatchList({ limit: 6 })

  if (!Array.isArray(list) || list.length === 0) {
    return null
  }

  return (
    <View>
      <Animated.View
        style={{
          marginBottom: 30,
          paddingHorizontal: 20,
          display: "flex",
          height: 310,
        }}
      >
        <CategoryHeader title='Your watchlist' viewMoreArrow={true} />

        <FlatList
          horizontal
          data={list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 20 }}
          renderItem={({ item, index }) => {
            const poster = item.posters[0]?.url ?? item.posterUrl
            return (
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
                cardWidth={width / 2}
                isFirst={index == 0 ? true : false}
                isLast={index == list?.length - 1 ? true : false}
              />
            )
          }}
        />
      </Animated.View>
    </View>
  )
}

export default WatchFlatList
