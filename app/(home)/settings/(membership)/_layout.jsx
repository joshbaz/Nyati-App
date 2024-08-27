import { Stack } from "expo-router"
import React from "react"

function MembershipLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='subplans' />
    </Stack>
  )
}

export default MembershipLayout
