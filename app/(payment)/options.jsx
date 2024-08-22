import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import { Animated, Dimensions, Text, View } from "react-native"
import { KeyboardAvoidingView, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useToast } from "../../context/ToastProvider"
import { invoke } from "../../lib/axios"
import { COLORS } from "../../src/color/VariableColors"
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
    <View
      style={{
        width,
        height,
        backgroundColor: COLORS.generalBg,
        color: "white",
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Animated.View className='space-y-8 p-6'>
            <View className='text-white space-y-5'>
              <Text className='text-white uppercase'>Step 2 of 2</Text>
              <Text className='text-4xl font-bold text-white'>
                Select a payment option
              </Text>
            </View>
            <PaymentOptions onSubmit={onSubmit} />
            {/* <View className='space-y-3'>
              <Text className='text-white text-base'>
                Select Payment Method
              </Text>
              <View className='flex flex-col gap-y-4 py-2'>
                <RadioGroup
                  options={formattedOptions}
                  value={values.option}
                  onSelect={(value) => {
                    setFieldValue("option", value)
                  }}
                >
                  {(option) => (
                    <View className='flex flex-row items-center justify-between w-auto '>
                      <Image
                        source={{ uri: option.logo }}
                        className='w-24 h-14 rounded bg-cover'
                      />
                      <View className='flex flex-col items-start ml-4'>
                        <Text className='text-base text-white '>
                          {option.label}
                        </Text>
                        {option.comingSoon ? (
                          <Text className='text-red-400 text-sm'>
                            Coming Soon
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  )}
                </RadioGroup>
                {errors.option && touched.option ? (
                  <Text className='text-red-400 text-sm'>{errors.option}</Text>
                ) : null}
              </View>
              <View className='w-full border-t-2 border-gray-400' />
              <View className='flex flex-col gap-y-2 py-2'>
                <View className='space-y-2'>
                  <Text className='text-white text-base'>
                    Add Mobile Number
                  </Text>
                  <View className='flex flex-col items-start gap-x-3 w-full space-y-2 '>
                    <Text className='text-gray-400 text-sm'>Mobile Number</Text>
                    <TextInput
                      type='text'
                      id='paymentNumber'
                      name='paymentNumber'
                      enablesReturnKeyAutomatically
                      keyboardAppearance='dark'
                      onChangeText={handleChange("paymentNumber")}
                      onBlur={handleBlur("paymentNumber")}
                      value={values.paymentNumber}
                      className='w-full rounded-md text-white text-base h-12 px-4 pb-2'
                      style={{
                        borderColor: values.paymentNumber
                          ? COLORS.formBtnBg
                          : "transparent",
                        backgroundColor: COLORS.formBg,
                        color: COLORS.formLabel,
                      }}
                    />
                    {errors.paymentNumber && touched.paymentNumber ? (
                      <Text className='text-red-400 text-sm'>
                        {errors.paymentNumber}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
              <View className='w-full border-t-2 border-gray-400' />
              <View className='flex flex-row items-center justify-start w-full'>
                <Checkbox
                  onPress={() =>
                    setFieldValue("saveDetails", !values.saveDetails)
                  }
                  status={values.saveDetails ? "checked" : "unchecked"}
                />

                <Text className='text-gray-400 text-sm ml-2'>
                  Keep the info for the next payment
                </Text>
              </View>
              <View>
                <Pressable
                  onPress={handleSubmit}
                  disabled={!isValid}
                  className='flex items-center justify-center w-full h-12 rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50'
                  style={{ backgroundColor: COLORS.formBtnBg }}
                >
                  <Text className='text-white text-lg'>Continue</Text>
                </Pressable>
              </View>
            </View> */}
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {/* <Modal transparent={true} visible={isSubmitting} animationType='slide'>
        <View
          style={[
            {
              flex: 1,
              alignItems: "center",
              justifyContent: "space-around",
              backgroundColor: "rgba(21, 21, 21, 0.6)",
            },
          ]}
        >
          <Animated.View
            style={{
              position: "relative",
              width: 50,
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BallIndicator color='#ED3F62' count={9} />
          </Animated.View>
        </View>
      </Modal> */}
    </View>
  )
}

export default Options
