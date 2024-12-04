import { router } from "expo-router"
import React from "react"
import { Animated, Dimensions, FlatList, View } from "react-native"
import FeaturedMovieCard from "./FeaturedMovieCard"

const { width } = Dimensions.get("window")

function FeaturedSlide({ films }) {
  return (
    <View>
      <Animated.View
        style={{
          marginBottom: 30,
          display: "flex",
          height: 300,
        }}
      >
        <FlatList
          horizontal
          data={films}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 0 }}
          snapToInterval={width}
          decelerationRate={0}
          renderItem={({ item, index }) => {
            const posterUrl =
              item.posters.find((poster) => poster.isCover)?.url ??
              item.posterUrl ??
              undefined

            let trailerId = null
            if (item?.video?.length > 0) {
              trailerId =
                item?.video.find((video) => video.isTrailer)?.id ?? null
            }

            return (
              <FeaturedMovieCard
                shouldMarginatedAtEnd={false}
                cardFunction={() => {
                  if (trailerId) {
                    router.push(`/film/${item.id}/watch/${trailerId}`)
                  } else {
                    if (item?.type === "series") {
                      router.push(`/film/${item.id}/${item?.season[0]?.id}`)
                    } else {
                      router.push(`/film/${item.id}`)
                    }
                  }
                }}
                title={item.title}
                posterUrl={posterUrl}
                cardWidth={width}
                cardHeight={223}
                isFirst={index == 0 ? true : false}
                isLast={false}
              />
            )
          }}
        />
      </Animated.View>
    </View>
  )
}

export default FeaturedSlide
