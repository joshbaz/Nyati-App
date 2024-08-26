import { router } from "expo-router"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../../../context/AuthProvider"
import { COLORS } from "../../../../src/color/VariableColors"
import Avatar from "../../../../src/components/Avatar"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import TopNav from "../../../../src/components/TopNav"

function Membership() {
  const { user } = useAuth()
  const fullname = `${user.firstname} ${user.lastname}`
  return (
    <PageLayoutWrapper>
      <View className='space-y-4'>
        <TopNav title='Your Account' hideMenu={true} />
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(home)/settings/profile",
              params: { edit: false },
            })
          }
          className='w-full rounded-lg'
          style={{
            backgroundColor: COLORS.formBg,
          }}
        >
          <View className='w-full p-6 rounded-md flex flex-row items-center justify-between'>
            <View className='flex flex-row items-center'>
              <Avatar hideInfo={true} />
              <View className='ml-4'>
                <Text className='text-lg font-medium text-sans text-white '>
                  {fullname}
                </Text>
                <Text className='text-gray-400 text-base text-sans'>
                  View Profile
                </Text>
              </View>
            </View>
            <View>
              <Ionicons name='chevron-forward' size={24} color='white' />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(home)/settings/profile",
              params: { edit: false },
            })
          }
          className='w-full rounded-lg'
          style={{
            backgroundColor: COLORS.formBg,
          }}
        >
          <View className='w-full p-6 rounded-md flex flex-row items-center justify-between'>
            <View className='flex flex-row items-center'>
              <Avatar hideInfo={true} />
              <View className='ml-4'>
                <Text className='text-lg font-medium text-sans text-white '>
                  {fullname}
                </Text>
                <Text className='text-gray-400 text-base text-sans'>
                  View Profile
                </Text>
              </View>
            </View>
            <View>
              <Ionicons name='chevron-forward' size={24} color='white' />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </PageLayoutWrapper>
  )
}

export default Membership
