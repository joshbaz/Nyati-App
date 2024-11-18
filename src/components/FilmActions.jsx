import { useToast } from "context/ToastProvider"
import { router } from "expo-router"
import React, { useMemo, useState } from "react"
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useFilmCtx } from "../../context/FilmProvider"
import useWatchList from "../../hooks/useWatchList"
import { COLORS } from "../color/VariableColors"

const { width } = Dimensions.get("window")

function FilmActions() {
  const { showToast } = useToast()
  const { fetchFilm, likeRateFilm, film } = useFilmCtx()
  const [currentTrailer, setCurrentTrailer] = useState(0)
  const [selectedResolution, setSelectedResolution] = useState(() => {
    const defaultResolution = film?.video.find(
      (video) => video?.resolution === "HD",
    )
    if (!defaultResolution) return null
    return defaultResolution
  })

  const { removeItemFromWatchList, handleAddToWatchlist } = useWatchList({
    disableFetch: true,
  })
  const access = useMemo(() => {
    if (film?.access === "free") return "Free to watch"
    return "Available to rent"
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

  // get the trailer videos ids and play each keeping track of the current playing video
  const trailerIds = useMemo(() => {
    if (!film?.video) return []
    const trailers = film?.video.filter((video) => video?.isTrailer)
    return trailers.map((trailer) => trailer && trailer?.id)
  }, [film?.video])

  const currentThumbsType = useMemo(() => {
    if (film?.likes[0]?.type === "THUMBS_UP") return "THUMBS_UP"
    if (film?.likes[0]?.type === "THUMBS_DOWN") return "THUMBS_DOWN"
    return "NONE"
  }, [film?.likes])

  const options = useMemo(
    () => [
      {
        label: "Play Trailer",
        icon: "play",
        onPress: () => {
          if (trailerIds.length === 0) return
          router.setParams({ trackid: trailerIds[currentTrailer] })
          if (currentTrailer < trailerIds.length - 1) {
            setCurrentTrailer(currentTrailer + 1)
          } else {
            // reset to the first trailer
            setCurrentTrailer(0)
          }
        },
        disabled: trailerIds.length === 0,
        selected: false,
      },
      {
        label: watchlistId ? "Remove Watchlist" : "Watch List",
        icon: watchlistId ? "check" : "plus",
        onPress: () => {
          if (watchlistId) {
            removeItemFromWatchList(watchlistId, film?.id, fetchFilm)
          } else {
            handleAddToWatchlist(film?.id, fetchFilm)
          }
        },
        disabled: false,
        selected: watchlistId,
      },
      {
        label: "Like",
        icon: "thumbs-up",
        onPress: () => {
          if (currentThumbsType === "THUMBS_UP") {
            likeRateFilm(film?.id, "NONE")
          } else {
            likeRateFilm(film?.id, "THUMBS_UP")
          }
        },
        disabled: false,
        selected: currentThumbsType === "THUMBS_UP",
      },
      {
        label: "Not for me",
        icon: "thumbs-down",
        onPress: () => {
          if (currentThumbsType === "THUMBS_DOWN") {
            likeRateFilm(film?.id, "NONE")
          } else {
            likeRateFilm(film?.id, "THUMBS_DOWN")
          }
        },
        disabled: false,
        selected: currentThumbsType === "THUMBS_DOWN",
      },
    ],
    [
      currentThumbsType,
      currentTrailer,
      film?.id,
      film?.likes,
      fetchFilm,
      handleAddToWatchlist,
      likeRateFilm,
      removeItemFromWatchList,
      trailerIds,
      watchlistId,
    ],
  )

  return (
    <View className='w-full space-y-6'>
      <View className='flex flex-row items-center gap-x-2'>
        <Image
          source={require("../../assets/bagheart.png")}
          style={{ width: 26, height: 26 }}
          resizeMode='contain'
        />

        <Text className='text-white font-medium tracking-tight text-lg'>
          {access}
        </Text>
      </View>
      <View>
        <FlatList
          horizontal
          data={film?.video ?? []}
          keyExtractor={(video) => video.id}
          contentContainerStyle={{ gap: 20 }}
          renderItem={({ item: video }) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedResolution(video)
                  }}
                  className='flex flex-row items-center justify-center h-12 w-16 rounded-md p-2'
                  style={{
                    backgroundColor:
                      selectedResolution.id === video?.id
                        ? COLORS.formBg
                        : "transparent",
                  }}
                >
                  <Text className='text-primary-500 font-semibold text-lg'>
                    {video?.resolution}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </View>
      {shouldShowPurchaseBtn ? (
        <TouchableOpacity
          disabled={!selectedResolution}
          onPress={() => {
            if (!selectedResolution) {
              showToast({
                type: "error",
                message: "Please select a resolution to continue",
              })
              return
            }

            router.push({
              pathname: `/(home)/film/${film.id}/purchase`,
              params: {
                videoId: selectedResolution?.id,
              },
            })
          }}
          className='flex flex-row items-center justify-center h-16 border-2 border-primary-500 rounded-3xl w-full'
          style={{
            backgroundColor: COLORS.formBg,
          }}
        >
          <Text className='text-primary-500 font-semibold text-xl'>
            {film?.access === "rent" ? "Rent @ " : "Buy @ "}{" "}
            {`UGX ${numFormat.format(selectedResolution?.videoPrice?.price)}`}
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
          scrollToOverflowEnabled={false}
          renderItem={({ item }) => (
            <View
              key={item?.label}
              className='space-y-3 flex flex-col justify-start items-center max-w-[60px]'
              style={{ opacity: item?.disabled ? 0.5 : 1 }}
            >
              <Pressable
                disabled={item?.disabled}
                className={`flex flex-row items-center justify-center h-14 w-14 rounded-full p-1.5  border border-white ${item?.selected ? "bg-white" : "bg-gray-500/50"}`}
                onPress={item?.onPress}
              >
                <View
                  className={`border border-white rounded-full p-1.5 flex items-center justify-center ${item?.selected ? "bg-white" : "transparent"}`}
                >
                  <Feather
                    name={item.icon}
                    size={18}
                    color={item?.selected ? "black" : "white"}
                  />
                </View>
              </Pressable>
              <Text className='text-white w-full text-center'>
                {item.label}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  )
}

export default FilmActions
