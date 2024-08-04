import { Stack } from "expo-router"
import React from "react"

function FilmLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='[id]'
        options={{ headerTitle: "Film" }}
      />
      <Stack.Screen name='watch/[id]' />
    </Stack>
  )
}

export default FilmLayout
