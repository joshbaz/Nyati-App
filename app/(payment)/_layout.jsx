import { Stack } from "expo-router"
import React from "react"
import MembershipProvider from "../../context/MembershipProvider"

function PaymentLayout() {
  return (
    <MembershipProvider disableFetchOnMount={true}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='plans' options={{ headerShown: false }} />
        <Stack.Screen name='options' options={{ headerShown: false }} />
      </Stack>
    </MembershipProvider>
  )
}

export default PaymentLayout
