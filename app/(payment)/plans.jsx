import { Link, router, useLocalSearchParams } from "expo-router"
import React from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../../src/color/VariableColors"

const { width, height } = Dimensions.get("window")

const plans = [
  {
    label: "Monthly",
    value: "monthly",
    price: 1530,
    currency: "UGX", // Ugandan Shilling
  },
  {
    label: "Weekly",
    value: "weekly",
    price: 100,
    currency: "UGX",
  },
]
function Plans() {
  const localParams = useLocalSearchParams()

  console.log("Plans localParams", localParams)
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: COLORS.generalBg,
        color: "white",
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View className='space-y-8 p-6'>
          <View className='text-white space-y-5'>
            <Text className='text-white uppercase'>Step 1 of 2</Text>
            <Text className='text-4xl font-bold text-white'>
              Choose a plan that works for you
            </Text>
          </View>
          <View className='space-y-5 py-12'>
            <View className='flex flex-col gap-y-6'>
              {plans.map((plan, idx) => {
                return (
                  <View
                    key={idx}
                    className='flex flex-col justify-between items-start p-6 rounded-lg min-h-[120px]'
                    style={{
                      backgroundColor: COLORS.formBg,
                    }}
                  >
                    <View className='flex flex-row items-start justify-between w-full'>
                      <Text className='text-sm text-white'>{plan.label}</Text>
                      <TouchableOpacity
                        style={{
                          height: 45,
                          backgroundColor: COLORS.formBtnBg,
                        }}
                        onPress={() => {
                          router.push({
                            pathname: "/(payment)/options",
                            params: {
                              selectedPlan: plan.value,
                              userId: localParams.userId,
                            },
                          })
                        }}
                        className='flex items-center justify-center rounded px-4'
                      >
                        <Text className='text-base text-white'>
                          Select Plan
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className='flex flex-row items-end justify-between gap-x-1'>
                      <Text className='text-sm text-white uppercase'>
                        {plan.currency}
                      </Text>
                      <Text className='text-5xl font-bold text-white'>
                        {plan.price}
                      </Text>
                      <Text className='text-sm text-white'>.00</Text>
                    </View>
                  </View>
                )
              })}
            </View>
            <Link
              href='/(home)'
              className='text-center text-lg uppercase'
              style={{ color: COLORS.formBtnBg }}
            >
              Skip
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default Plans
