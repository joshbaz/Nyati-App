import { DrawerActions } from "@react-navigation/native"
import { useNavigation, useRouter } from "expo-router"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Feather } from "@expo/vector-icons"

function TopNav({ title, hideMenu }) {
  const nav = useNavigation()
  const router = useRouter()
  return (
    <View className='w-full py-4 flex flex-row items-center justify-between'>
      <TouchableOpacity
        onPress={() => router.back()}
        className='flex flex-row items-center justify-start w-fit'
      >
        <Feather name='arrow-left' size={24} color='white' />
        <Text className='text-white ml-2 text-lg font-bold'>{title}</Text>
      </TouchableOpacity>
      {hideMenu ? null : (
        <TouchableOpacity
          onPress={() => nav.dispatch(DrawerActions.openDrawer())}
          className='flex flex-row items-center justify-start w-fit'
        >
          <Feather name='menu' size={24} color='white' />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default TopNav
