import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer"
import { Redirect, router } from "expo-router"
import { Drawer } from "expo-router/drawer"
import React from "react"
import { Pressable, Text, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AntDesign } from "@expo/vector-icons"
import { useAuth } from "../../context/AuthProvider"
import { COLORS } from "../../src/color/VariableColors"
import Avatar from "../../src/components/Avatar"

function CustomDrawerContent(props) {
  const { top, bottom } = useSafeAreaInsets()
  const { logout } = useAuth()
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.generalBg,
        paddingVertical: 20 + top,
        borderBottomEndRadius: 10,
      }}
    >
      <View
        className='flex flex-row items-center justify-between px-4'
        style={{ zIndex: 100 }}
      >
        <Pressable
          onPress={() => props.navigation.closeDrawer()}
          className='flex flex-row items-center justify-center border border-white rounded-full h-12 w-12 bg-slate-50/20 z-50'
        >
          <AntDesign name='close' size={24} color='white' />
        </Pressable>
        <Pressable onPress={() => router.push("/(home)/settings")}>
          <Avatar hideInfo={true} isSmall />
        </Pressable>
      </View>
      <View style={{ flex: 1 }} className='flex flex-col gap-y-20'>
        <DrawerContentScrollView
          {...props}
          scrollEnabled={false}
          style={{ display: "flex", gap: 20 }}
        >
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      </View>
      <View style={{ paddingBottom: 20 + bottom, paddingHorizontal: 20 }}>
        <Pressable
          className='flex flex-row items-center justify-center h-14 w-full rounded-full border border-gray-400 bg-slate-50/20 p-2'
          onPress={() => logout()}
        >
          <Text className='text-gray-300 font-semibold text-xl'>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  )
}

function HomeLayout() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Redirect href='/' />
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: "#36323E66", //"#36323E66",
          drawerInactiveBackgroundColor: "transparent",
          drawerActiveTintColor: COLORS.formBtnBg,
          drawerInactiveTintColor: COLORS.formLabel,
          drawerItemStyle: {
            borderRadius: 5,
            paddingVertical: 10,
            marginVertical: 5,
            marginHorizontal: 20,
          },
          drawerLabelStyle: {
            fontSize: 20,
            fontWeight: "semibold",
            textAlign: "center",
          },
          drawerAllowFontScaling: true,
          drawerStyle: {
            backgroundColor: "transparent",
            width: "80%",
            borderEndEndRadius: 20,
          },
        }}
      >
        <Drawer.Screen
          name='index'
          options={{
            headerShown: false,
            drawerLabel: "Movies",
          }}
        />
        <Drawer.Screen
          name='watchlist'
          options={{
            headerShown: false,
            drawerLabel: "My List",
          }}
        />
        <Drawer.Screen
          name='ongoing_projects'
          options={{
            headerShown: false,
            drawerLabel: "Ongoing Projects",
          }}
        />
        <Drawer.Screen
          name='settings'
          options={{
            headerShown: false,
            drawerLabel: "Profile & Accounts",
          }}
        />
        <Drawer.Screen
          name='donate'
          options={{
            headerShown: false,
            drawerLabel: "Donate to Nyati",
            drawerItemStyle: {
              backgroundColor: COLORS.formBtnBg,
              borderRadius: 100,
              marginHorizontal: 20,
            },
            drawerLabelStyle: {
              color: "white",
              fontSize: 20,
              width: "fit-content",
              fontWeight: "semibold",
              textAlign: "center",
            },
          }}
        />
        <Drawer.Screen
          name='film'
          options={{
            headerShown: false,
            drawerItemStyle: { display: "none" },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}

export default HomeLayout
