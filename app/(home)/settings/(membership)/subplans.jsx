import { router, useLocalSearchParams } from "expo-router"
import React, { useCallback } from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { useMembership } from "../../../../context/MembershipProvider"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import SubscriptionPlans from "../../../../src/components/SubscriptionPlans"
import TopNav from "../../../../src/components/TopNav"

function SubPlans() {
  const params = useLocalSearchParams()
  const { assignPlan, subloading } = useMembership()

  const handleSubmit = useCallback(async () => {
    if (!params?.plan) return
    assignPlan(params.plan)

    setTimeout(() => {
      router.replace("/(home)/settings/(membership)")
    }, 1000)
  }, [params?.plan])

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
              selected={params?.plan}
              onSelect={(plan) => router.setParams({ plan: plan.id })}
            />
          </View>
        </View>
        <View className='flex flex-col items-center justify-center gap-y-6 pt-36'>
          <TouchableOpacity
            disabled={subloading || !params?.plan}
            onPress={() => handleSubmit()}
            className='w-full rounded-full bg-primary-500 h-12 flex items-center justify-center px-4'
            style={{
              opacity: subloading || !params?.plan ? 0.5 : 1,
            }}
          >
            {subloading ? (
              <ActivityIndicator size='small' color='white' />
            ) : (
              <Text className='text-white text-lg text-sans font-semibold'>
                Save
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={subloading}
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
