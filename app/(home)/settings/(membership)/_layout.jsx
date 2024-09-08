import { Stack } from "expo-router"
import React from "react"

function MembershipLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='subplans' />
      <Stack.Screen name='payment-methods' />
      <Stack.Screen name='addmethod' />
      <Stack.Screen name='[method]' />
      <Stack.Screen name='payment-history' />
    </Stack>
  )
}

export default MembershipLayout
