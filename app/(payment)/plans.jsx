import { Link, router, useLocalSearchParams } from "expo-router"
import React from "react"
import { Text, View } from "react-native"
import { useMembership } from "../../context/MembershipProvider"
import { COLORS } from "../../src/color/VariableColors"
import PageLayoutWrapper from "../../src/components/PageLayoutWrapper"
import SplashScreen from "../../src/components/SplashScreen"
import SubscriptionPlans from "../../src/components/SubscriptionPlans"

function Plans() {
  const localParams = useLocalSearchParams()
  const { subloading, plans } = useMembership()

  if (!plans.length > 0 && subloading) {
    return <SplashScreen hideLogo={true} />
  }
  return (
    <PageLayoutWrapper>
      <View className='space-y-6 py-6'>
        <View className='text-white space-y-5'>
          <Text className='text-white uppercase'>Step 1 of 2</Text>
          <Text className='text-4xl font-bold text-white'>
            Choose a plan that works for you
          </Text>
        </View>
        <View className='space-y-5 py-2'>
          <SubscriptionPlans
            onSelect={(plan) =>
              router.push({
                pathname: "/(payment)/options",
                params: {
                  selectedPlan: plan.id,
                  userId: localParams.userId,
                },
              })
            }
          />

          <Link
            href='/(home)'
            className='text-center text-lg uppercase'
            style={{ color: COLORS.formBtnBg }}
          >
            Skip
          </Link>
        </View>
      </View>
    </PageLayoutWrapper>
  )
}

export default Plans
