import { Stack } from "expo-router"

import React from "react"

import AuthProvider from "../../src/context/AuthProvider"

function AuthLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name='signin' options={{ header: () => null }} />
        <Stack.Screen name='register' options={{ header: () => null }} />
        <Stack.Screen name='registersuccess' options={{ header: () => null }} />
        <Stack.Screen name='verifyaccount' options={{ header: () => null }} />
      </Stack>
    </AuthProvider>
  )
}

export default AuthLayout
