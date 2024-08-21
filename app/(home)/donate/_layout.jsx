import { Stack } from "expo-router"
import React from "react"

function DonateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='index'
        options={{ headerShown: false, headerTitle: "Donate" }}
      />
      <Stack.Screen name='[id]' />
      <Stack.Screen name='amount' />
      <Stack.Screen name='options' />
      <Stack.Screen name='complete' />
    </Stack>
  )
}

export default DonateLayout
