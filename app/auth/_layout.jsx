import { Stack } from "expo-router"

import React from "react"

function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name='signin' options={{ headerShown: false }} />
      <Stack.Screen name='register' options={{ headerShown: false }} />
      <Stack.Screen name='registersuccess' options={{ headerShown: false }} />
      <Stack.Screen name='verifyaccount' options={{ headerShown: false }} />
    </Stack>
  )
}

export default AuthLayout
