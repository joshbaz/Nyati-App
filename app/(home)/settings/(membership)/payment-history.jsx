import React from "react"
import { Text, View } from "react-native"
import { useMembership } from "../../../../context/MembershipProvider"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import TopNav from "../../../../src/components/TopNav"

function PaymentHistory() {
  const { currentPlan, history } = useMembership()

  return (
    <PageLayoutWrapper>
      <View className='space-y-4 w-full'>
        <TopNav title='Your Payments' hideMenu={true} />
        <View className='space-y-8'>
          <View className='bg-secondary-600 p-4 rounded-lg'>
            <Text className='text-lg font-semibold text-white text-sans'>
              Plan
            </Text>
            <Text></Text>
          </View>
        </View>
      </View>
    </PageLayoutWrapper>
  )
}

export default PaymentHistory
