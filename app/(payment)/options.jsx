import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import { Animated, Text, View } from "react-native"
import { useMembership } from "../../context/MembershipProvider"
import { useToast } from "../../context/ToastProvider"
import PageLayoutWrapper from "../../src/components/PageLayoutWrapper"
import PaymentOptions from "../../src/components/PaymentOptions"

function Options() {
  const { showToast } = useToast()
  const { addNewPaymentMethod } = useMembership()
  const localParams = useLocalSearchParams()

  // handleSubmit function
  const onSubmit = async (values, hp) => {
    try {
      hp.setSubmitting(true)

      const body = {
        ...values,
        plan: localParams.selectedPlan || "",
        paymentNumber: values.phoneCode + values.paymentNumber,
      }

      delete body.phoneCode

      addNewPaymentMethod(body)
      setTimeout(() => {
        hp.resetForm()
        hp.setSubmitting(false)
        router.push("/(home)")
      }, 2000)
    } catch (e) {
      showToast({
        type: "error",
        message: "An error occurred trying to process your payment",
      })
      return
    } finally {
      hp.setSubmitting(false)
    }
  }

  return (
    <PageLayoutWrapper>
      <Animated.View className='space-y-8 py-6'>
        <View className='text-white space-y-5'>
          <Text className='text-white uppercase'>Step 2 of 2</Text>
          <Text className='text-4xl font-bold text-white'>
            Select a payment option
          </Text>
        </View>
        <PaymentOptions onSubmit={onSubmit} />
      </Animated.View>
    </PageLayoutWrapper>
  )
}

export default Options
