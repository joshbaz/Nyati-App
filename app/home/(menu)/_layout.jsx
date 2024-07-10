import { Drawer } from "expo-router/drawer"

import React from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"

function MenuLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name='menu'
          options={{ headerShown: false, headerTitle: "Menu" }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}

export default MenuLayout
