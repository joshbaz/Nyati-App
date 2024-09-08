import { Stack } from "expo-router"
import React from "react"
import MembershipProvider from "../../../../context/MembershipProvider"

function MembershipLayout() {
  return (
    <MembershipProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='subplans' />
        <Stack.Screen name='payment-methods' />
        <Stack.Screen name='addmethod' />
        <Stack.Screen name='[method]' />
        <Stack.Screen name='payment-history' />
      </Stack>
    </MembershipProvider>
  )
}

export default MembershipLayout
