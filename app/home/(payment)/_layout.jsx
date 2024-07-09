import React from "react"
import { Stack } from "expo-router"

function PaymentLayout() {
   return (
      <Stack>
         <Stack.Screen name='donate' options={{ headerShown: false, headerTitle: "Donate" }} />
         <Stack.Screen name='options' options={{ headerShown: false }} />
         <Stack.Screen name='complete' options={{ headerShown: false }} />
      </Stack>
   )
}

export default PaymentLayout
