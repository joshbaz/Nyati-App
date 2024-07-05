import { Stack } from "expo-router"

import React from "react"

function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ header: () => null }} />
      <Stack.Screen name='film/[id]' options={{ header: () => null }} />
    </Stack>
  )
}

export default HomeLayout
