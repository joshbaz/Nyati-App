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
            const posterUrl = item.posters[0].url ?? item.posterUrl ?? undefined
            return (
              <FeaturedMovieCard
                shouldMarginatedAtEnd={false}
                cardFunction={() => {
                  navigation.push("FilmDetails", {
                    filmid: item.id,
                  })
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
