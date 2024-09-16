import { Stack } from "expo-router"
import React from "react"
import FilmProvider from "../../../context/FilmProvider"

function FilmLayout() {
  return (
    <FilmProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='[id]' options={{ headerTitle: "Film" }} />
        <Stack.Screen name='purchase' />
      </Stack>
    </FilmProvider>
  )
}

export default FilmLayout
