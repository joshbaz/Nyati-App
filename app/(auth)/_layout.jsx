import { Stack } from "expo-router"
import React from "react"

function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='signin' />
      <Stack.Screen name='register' />
      <Stack.Screen name='registersuccess' />
      <Stack.Screen name='verifyaccount' />
      <Stack.Screen name='(forgotpassword)' />
    </Stack>
  )
}

export default AuthLayout
