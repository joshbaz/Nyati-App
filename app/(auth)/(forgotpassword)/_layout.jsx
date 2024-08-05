import { Stack } from "expo-router"
import React from "react"

function ForgotPasswordLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='contactform' />
      <Stack.Screen name='verifyotp' />
      <Stack.Screen name='changepassword' />
    </Stack>
  )
}

export default ForgotPasswordLayout
