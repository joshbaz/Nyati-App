import { Stack } from "expo-router"

import React from "react"

function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ headerShown: false, headerTitle: "Home" }}
      />
      <Stack.Screen name='film/[id]' options={{ headerShown: false }} />
      <Stack.Screen name='film/watch/[id]' options={{ headerShown: false }} />
      <Stack.Screen name='(payment)' options={{ headerShown: false }} />
    </Stack>
  )
}

export default HomeLayout
