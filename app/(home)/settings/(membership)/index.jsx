import { router } from "expo-router"
import React from "react"
import { Pressable, Text, TouchableOpacity, View } from "react-native"
import { BallIndicator } from "react-native-indicators"
import { Ionicons } from "@expo/vector-icons"
import { useMembership } from "../../../../context/MembershipProvider"
import { COLORS } from "../../../../src/color/VariableColors"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import PaymentInfoCard from "../../../../src/components/PaymentInfoCard"
import TopNav from "../../../../src/components/TopNav"

function Membership() {
  const { currentPlan, loading } = useMembership()

  return (
    <PageLayoutWrapper>
      <View className='space-y-4'>
        <TopNav title='Membership' hideMenu={true} />

        <View className='space-y-8'>
          <View
            style={{ backgroundColor: COLORS.formBg }}
            className='p-5 rounded-md space-y-3'
          >
            <Text className='text-lg font-medium text-white text-sans'>
              {currentPlan?.plan
                ? `Subscribed to the ${currentPlan?.plan?.name} plan`
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
                    params: { new: currentPlan?.plan ? false : true },
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
          <View className='space-y-4'>
            <Text className='text-lg font-medium text-white text-sans'>
              Payment Info.
            </Text>
            <View>
              <PaymentInfoCard />
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(home)/settings/(membership)/payment-methods",
                  params: { plan: currentPlan?.plan },
                })
              }
              className='w-full rounded-lg'
              style={{
                backgroundColor: COLORS.formBg,
              }}
            >
              <View className='w-full p-6 rounded-md flex flex-row items-center justify-between'>
                <View className='flex flex-row items-center'>
                  <Text className='text-lg font-medium text-sans text-white '>
                    Manage Payment Method
                  </Text>
                </View>
                <View>
                  <Ionicons name='chevron-forward' size={24} color='gray' />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(home)/settings/(membership)/payment-history",
                  params: { plan: currentPlan?.plan },
                })
              }
              className='w-full rounded-lg'
              style={{
                backgroundColor: COLORS.formBg,
              }}
            >
              <View className='w-full p-6 rounded-md flex flex-row items-center justify-between'>
                <View className='flex flex-row items-center'>
                  <Text className='text-lg font-medium text-sans text-white '>
                    View payment history
                  </Text>
                </View>
                <View>
                  <Ionicons name='chevron-forward' size={24} color='gray' />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </PageLayoutWrapper>
  )
}

export default Membership
