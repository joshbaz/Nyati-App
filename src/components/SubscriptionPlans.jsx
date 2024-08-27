import React from "react"
import { Pressable, Text, View } from "react-native"
import useSubscription from "../../hooks/useSubscription"
import { COLORS } from "../color/VariableColors"

function SubscriptionPlans({ onSelect, selected = "" }) {
  const { plans } = useSubscription()
  return (
    <View className='space-y-6'>
      {plans.map((plan, idx) => {
        const isSelected = selected === plan.value ? true : false
        return (
          <View
            key={idx}
            className='flex flex-col justify-between items-start p-6 rounded-lg min-h-[120px]'
            style={{
              backgroundColor: COLORS.formBg,
            }}
          >
            <View className='flex flex-row items-start justify-between w-full'>
              {plan.selected ? (
                <View className='flex flex-row items-center'>
                  <Text className='text-base text-primary-500'>
                    Current Plan:
                  </Text>
                  <Text className='text-base text-white ml-2'>
                    {plan.label}
                  </Text>
                </View>
              ) : (
                <Text className='text-base text-white'>{plan.label}</Text>
              )}
              <Pressable
                disabled={plan.selected}
                onPress={() => onSelect(plan)}
                className={`flex items-center justify-center rounded px-4 h-11 ${isSelected ? "bg-primary-600" : "bg-primary-500"}`}
              >
                <Text
                  className={`text-base text-white ${isSelected ? "font-semibold" : "font-normal"}`}
                >
                  {isSelected || plan?.selected ? "Selected" : "Select Plan"}
                </Text>
              </Pressable>
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
  )
}

export default SubscriptionPlans
