import { Stack } from "expo-router"
import React from "react"

function DonateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='index'
        options={{ headerShown: false, headerTitle: "Donate" }}
      />
      <Stack.Screen name='[id]/index' />
      <Stack.Screen name='[id]/amount' />
      <Stack.Screen name='[id]/options' />
      <Stack.Screen name='[id]/order' />
    </Stack>
  )
}

export default DonateLayout
