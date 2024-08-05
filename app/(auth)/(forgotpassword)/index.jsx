import { router } from "expo-router"
import React from "react"
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather, SimpleLineIcons } from "@expo/vector-icons"
import { COLORS } from "../../../src/color/VariableColors"

const { width, height } = Dimensions.get("window")

const Options = [
  {
    label: "Email",
    value: "email",
    icon: <Feather name='mail' size={24} color={COLORS.formBtnBg} />,
  },
  {
    label: "Phone Number",
    value: "phone",
    icon: (
      <SimpleLineIcons
        name='screen-smartphone'
        size={28}
        color={COLORS.formBtnBg}
      />
    ),
  },
]

function ForgotPasswordMain() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.generalBg }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          className='flex items-center justify-start p-6'
          style={{ width, height }}
        >
          <View className='w-full'>
            <TouchableOpacity
              onPress={() => router.back()}
              className='flex flex-row items-center justify-start'
            >
              <Feather name='arrow-left' size={24} color='white' />
              <Text className='text-white ml-2 text-lg font-bold'>
                Forgot Password
              </Text>
            </TouchableOpacity>
          </View>
          <View className='flex flex-1 items-center justify-start w-full py-40'>
            <Text className='text-white text-lg'>
              Please select which contact details we will use to reset your
              password.
            </Text>
            <View className='w-full'>
              {Options.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    router.push({
                      pathname: "/(auth)/(forgotpassword)/contactform",
                      params: {
                        contact: option.value,
                      },
                    })
                  }}
                  className='flex flex-row items-center justify-start w-full p-4 mt-4 rounded-3xl h-24 border border-border active:bg-secondary-600'
                >
                  <View className='h-16 w-16 bg-secondary-600 rounded-2xl flex items-center justify-center'>
                    {option.icon}
                  </View>
                  <Text className='text-white text-lg font-bold ml-6'>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default ForgotPasswordMain
