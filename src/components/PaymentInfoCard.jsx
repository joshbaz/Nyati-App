import React from "react"
import { Image, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useMembership } from "../../context/MembershipProvider"
import { COLORS } from "../color/VariableColors"
import { breakParams } from "../utils/breakParams"

function PaymentInfoCard() {
  const {
    currentPlan: subscription,
    paymentOptions: methods,
    defaultPaymentMethod: method,
  } = useMembership()

  if (methods.length === 0) {
    return (
      <View className='bg-blue-100 w-full rounded-lg p-4 flex flex-row items-center'>
        <Ionicons name='information-circle' size={30} color={COLORS.formBg} />
        <Text className='ml-3 text-gray-700'>
          Navigate to manage payment method to add a payment method
        </Text>
      </View>
    )
  }

  return (
    <View
      className='w-full rounded-lg p-4 space-y-4'
      style={{
        backgroundColor: COLORS.formBg,
      }}
    >
      <View className='space-y-4'>
        <View>
          <Text className='text-white text-lg text-sans'>Next Payment</Text>
          <Text className='text-gray-300 text-base text-sans'>
            {subscription?.nextPayment
              ? subscription?.nextPayment
              : "No payment due"}
          </Text>
        </View>
        <View className='flex flex-row items-center justify-start'>
          <Image
            source={{ uri: method?.logo }}
            className='w-24 h-14 rounded bg-cover'
          />
          <Text className='text-white text-lg ml-3'>
            {method?.details?.paymentNumber
              ? breakParams(method.details?.paymentNumber)
              : "No payment method"}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default PaymentInfoCard
