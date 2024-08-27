import { router } from "expo-router"
import React from "react"
import { Pressable, Text, TouchableOpacity, View } from "react-native"
import { BallIndicator } from "react-native-indicators"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../../../context/AuthProvider"
import useSubscription from "../../../../hooks/useSubscription"
import { COLORS } from "../../../../src/color/VariableColors"
import Avatar from "../../../../src/components/Avatar"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import TopNav from "../../../../src/components/TopNav"

function Membership() {
  const { user } = useAuth()
  const { subscription, loading } = useSubscription()
  const fullname = `${user?.firstname} ${user?.lastname}` ?? "User"

  return (
    <PageLayoutWrapper>
      <View className='space-y-4'>
        <TopNav title='Membership' hideMenu={true} />

        <View
          style={{ backgroundColor: COLORS.formBg }}
          className='p-5 rounded-md space-y-3'
        >
          <Text className='text-lg font-medium text-white text-sans'>
            {subscription?.plan
              ? `Subscribed to the ${subscription?.plan} plan`
              : "Subscribe to a plan"}
          </Text>
          {loading ? (
            <View className='flex items-center justify-center'>
              <BallIndicator color={COLORS.formBtnBg} size={32} />
            </View>
          ) : (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(home)/settings/(membership)/subplans",
                  params: { new: subscription?.plan ? false : true },
                })
              }
              className='flex items-center justify-center h-12 border-2 border-border rounded-md'
            >
              <Text className='text-gray-300 text-base text-sans font-semibold'>
                Update
              </Text>
            </Pressable>
          )}
        </View>
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
