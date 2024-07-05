import React from "react"
import { Stack } from "expo-router"

function PaymentLayout() {
   return (
      <Stack>
         <Stack.Screen name='donate' options={{ header: () => null }} />
         <Stack.Screen name='options' options={{ header: () => null }} />
         <Stack.Screen name='complete' options={{ header: () => null }} />
      </Stack>
   )
}

export default PaymentLayout
