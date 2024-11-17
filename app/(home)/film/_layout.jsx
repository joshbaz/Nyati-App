import { Stack } from "expo-router"
import React from "react"
import FilmProvider from "../../../context/FilmProvider"

function FilmLayout() {
  return (
    <FilmProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='[id]/index' />
        <Stack.Screen name='[id]/watch/[videoId]' />
        <Stack.Screen name='[id]/purchase' />
      </Stack>
    </FilmProvider>
  )
}

export default FilmLayout
