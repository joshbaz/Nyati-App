import { router } from "expo-router"
import React from "react"
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../../../context/AuthProvider"
import { COLORS } from "../../../../src/color/VariableColors"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import TopNav from "../../../../src/components/TopNav"

const { height } = Dimensions.get("window")

function AccountSettings() {
  const { user } = useAuth()
  const handleAccountDelete = () => {
    console.log("Account deleted")
  }
  return (
    <PageLayoutWrapper>
      <View className='space-y-4 h-full '>
        <TopNav title='Account Settings' hideMenu={true} />

        <View
          className='flex flex-col items-center justify-between pb-3'
          style={{
            height: height - 300,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(home)/settings/(account)/change-password",
              })
            }
            className='w-full rounded-lg'
            style={{
              backgroundColor: COLORS.formBg,
            }}
          >
            <View className='w-full p-6 rounded-md flex flex-row items-center justify-between'>
              <View className='flex flex-row items-center'>
                <Ionicons name='lock-closed-outline' size={24} color='white' />
                <View className='ml-4'>
                  <Text className='text-lg font-medium text-sans text-white '>
                    Change Password
                  </Text>
                </View>
              </View>
              <View>
                <Ionicons name='chevron-forward' size={24} color='white' />
              </View>
            </View>
          </TouchableOpacity>
          <Pressable
            onPress={handleAccountDelete}
            className='h-12 flex items-center justify-center border border-primary-500 rounded w-full'
          >
            <Text className='text-lg text-primary-500 font-medium'>
              Delete Account
            </Text>
          </Pressable>
        </View>
      </View>
    </PageLayoutWrapper>
  )
}

export default AccountSettings
