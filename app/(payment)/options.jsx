import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import { Animated, Dimensions, Text, View } from "react-native"
import { KeyboardAvoidingView, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useToast } from "../../context/ToastProvider"
import { invoke } from "../../lib/axios"
import { COLORS } from "../../src/color/VariableColors"
import PageLayoutWrapper from "../../src/components/PageLayoutWrapper"
import PaymentOptions from "../../src/components/PaymentOptions"

const { width, height } = Dimensions.get("window")

function Options() {
  const { showToast } = useToast()
  const localParams = useLocalSearchParams()

  // handleSubmit function
  const onSubmit = async (values, hp) => {
    try {
      hp.setSubmitting(true)

      const body = {
        ...values,
        plan: localParams.selectedPlan || "",
        userId: localParams.userId,
      }
      const response = await invoke({
        method: "POST",
        endpoint: "/payment/subscription",
        data: body,
      })

      if (response.error) {
        throw new Error(response.error)
      }

      showToast({
        type: "success",
        message: "Payment processed successfully",
      })

      setTimeout(() => {
        hp.resetForm()
        hp.setSubmitting(false)
        router.push("/(home)")
      }, 3000)
    } catch (e) {
      console.error(e)
      showToast({
        type: "danger",
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
