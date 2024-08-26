import { Stack } from "expo-router"
import React from "react"

function AccountSettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='change-password' />
    </Stack>
  )
}

export default AccountSettingsLayout
