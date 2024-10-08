import { Stack } from "expo-router"
import React from "react"

function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='profile' />
      <Stack.Screen name='(membership)' />
      <Stack.Screen name='(account)' />
    </Stack>
  )
}

export default SettingsLayout
