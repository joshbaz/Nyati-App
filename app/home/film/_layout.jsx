import { Stack } from "expo-router"
import React from "react"

function FilmLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='[id]'
        options={{ headerShown: false, headerTitle: "Film" }}
      />
      <Stack.Screen name='watch/[id]' options={{ headerShown: false }} />
    </Stack>
  )
}

export default FilmLayout
