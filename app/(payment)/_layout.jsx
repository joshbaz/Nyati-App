import { Stack } from "expo-router"
import React from "react"

function PaymentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='plans' options={{ headerShown: false }} />
      <Stack.Screen name='options' options={{ headerShown: false }} />
    </Stack>
  )
}

export default PaymentLayout
