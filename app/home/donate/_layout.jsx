import { Stack } from "expo-router"
import React from "react"

function PaymentLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ headerShown: false, headerTitle: "Donate" }}
      />
      <Stack.Screen name='options' options={{ headerShown: false }} />
      <Stack.Screen name='complete' options={{ headerShown: false }} />
    </Stack>
  )
}

export default PaymentLayout
