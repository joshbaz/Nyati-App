import { router, useLocalSearchParams } from "expo-router"
import React, { useCallback, useState } from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { useAuth } from "../../../../context/AuthProvider"
import { useToast } from "../../../../context/ToastProvider"
import { invoke } from "../../../../lib/axios"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import SubscriptionPlans from "../../../../src/components/SubscriptionPlans"
import TopNav from "../../../../src/components/TopNav"

function SubPlans() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const params = useLocalSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true)
      // some code here

      let response = null

      if (params?.new === "true") {
        response = await invoke({
          method: "POST",
          endpoint: "/payment/subscription",
          data: {
            plan: params?.plan,
            userId: user?.id,
            paymentNumber: null,
            saveDetails: false,
          },
        })
      } else {
        response = await invoke({
          method: "PUT",
          endpoint: `/user/${user?.id}/subscription`,
          data: {
            plan: params?.plan,
          },
        })
      }

      if (response.error) {
        throw new Error(response.error)
      }

      showToast({
        type: "success",
        message: "Successfully saved",
      })

      router.replace("/(home)/settings/(membership)")
    } catch (error) {
      console.error(error)
      showToast({
        type: "danger",
        message: "An error occurred try again, later",
      })
      return
    } finally {
      setIsSubmitting(false)
    }
  }, [params?.plan])

  console.log(params)

  return (
    <PageLayoutWrapper>
      <View className='w-full space-y-4'>
        <View className='space-y-4'>
          <TopNav
            title={
              params?.new === "true"
                ? "Select streaming plan"
                : "Change Streaming Plan"
            }
            hideMenu={true}
          />
          <View>
            <SubscriptionPlans
              onSelect={(plan) => router.setParams({ plan: plan.value })}
              selected={params?.plan}
            />
          </View>
        </View>
        <View className='flex flex-col items-center justify-center gap-y-6 pt-36'>
          <TouchableOpacity
            disabled={isSubmitting || !params?.plan}
            onPress={() => handleSubmit()}
            className='w-full rounded-full bg-primary-500 h-12 flex items-center justify-center px-4'
            style={{
              opacity: isSubmitting || !params?.plan ? 0.5 : 1,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator size='small' color='white' />
            ) : (
              <Text className='text-white text-lg text-sans font-semibold'>
                Save
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            className='w-fit h-fit flex items-center justify-center px-4'
          >
            <Text className='text-primary-500 text-lg text-sans font-semibold'>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </PageLayoutWrapper>
  )
}

export default SubPlans
