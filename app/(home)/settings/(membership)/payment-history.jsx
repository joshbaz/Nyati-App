import { format } from "date-fns"
import React from "react"
import { Text, View } from "react-native"
import { useMembership } from "../../../../context/MembershipProvider"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import SplashScreen from "../../../../src/components/SplashScreen"
import TopNav from "../../../../src/components/TopNav"

function PaymentHistory() {
  const { currentPlan, history, loading } = useMembership()

  if (loading) {
    return <SplashScreen hideLogo={true} />
  }

  return (
    <PageLayoutWrapper>
      <View className='space-y-4 w-full'>
        <TopNav title='Payment History' hideMenu={true} />
        <View className='space-y-5'>
          <View className='bg-secondary-600 p-4 rounded-lg space-y-3'>
            <View className='space-y-1'>
              <Text className='text-lg font-semibold text-white text-sans'>
                Plan
              </Text>
              <Text className='text-gray-200'>
                {currentPlan?.plan?.currency} {currentPlan?.plan?.price}/
                {currentPlan?.plan?.duration === "WEEK"
                  ? "week"
                  : currentPlan?.plan?.duration === "MONTH"
                    ? "Month"
                    : null}
              </Text>
            </View>
            <View className='space-y-1'>
              <Text className='text-lg font-semibold text-white text-sans'>
                Next Payment Date
              </Text>
              <Text className='text-gray-200'>
                {currentPlan?.nextPaymentDate
                  ? format(currentPlan?.nextPaymentDate, "dd MMM yyyy")
                  : "N/A"}
              </Text>
            </View>
          </View>

          <Text className='text-lg font-semibold text-white text-sans'>
            Payment Info.
          </Text>
          <View>
            {history.length > 0 ? (
              history.map((item, index) => (
                <View className='bg-secondary-600 p-4 rounded-md'>
                  <Text key={index} className='text-gray-200'>
                    {item.amount} - {format(item.date, "dd MMM yyyy")}
                  </Text>
                </View>
              ))
            ) : (
              <View className='bg-secondary-600 p-4 rounded-md'>
                <Text className='text-gray-200'>No payment history found</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </PageLayoutWrapper>
  )
}

export default PaymentHistory
