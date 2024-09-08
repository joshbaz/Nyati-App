import { Stack } from "expo-router"
import React from "react"
import MembershipProvider from "../../../context/MembershipProvider"

function FilmLayout() {
  return (
    <MembershipProvider disableFetchOnMount>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='[id]' options={{ headerTitle: "Film" }} />
        <Stack.Screen name='purchase' />
      </Stack>
    </MembershipProvider>
  )
}

export default FilmLayout
