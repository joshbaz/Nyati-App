import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native"
import { KeyboardAvoidingView, Platform } from "react-native"
import { BallIndicator } from "react-native-indicators"
// import { Checkbox } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useFormik } from "formik"
import * as yup from "yup"
import AIRTELMONEY from "../../assets/AirtelMoney.png"
import MTNMOMO from "../../assets/MtnMoMo.png"
import PESAPAL from "../../assets/pesapal.png"
import { useAuth } from "../../context/AuthProvider"
import { Toast, useToast } from "../../context/ToastProvider"
import { invoke } from "../../lib/axios"
import { COLORS } from "../../src/color/VariableColors"
import Checkbox from "../../src/components/Checkbox"
import RadioGroup from "../../src/components/RadioGroup"

const { width, height } = Dimensions.get("window")

const validationSchema = yup.object().shape({
  option: yup.string().required("Select a payment option"),
  paymentNumber: yup
    .string()
    .test("is-email-or-phone", "Invalid phone number", (value) => {
      // phone number regex with the country code
      const phoneRegex = /^(\+|00)[1-9][0-9 \-\(\)\.]{7,32}$/
      const isPhone = phoneRegex.test(value)
      return isPhone
    }),
  saveDetails: yup.boolean().default(false),
})

const options = [
  {
    label: "MTN MOMO",
    value: "mtnmomo",
    comingSoon: false,
    logo: Image.resolveAssetSource(MTNMOMO).uri,
  },
  {
    label: "Airtel Money",
    value: "airtelmoney",
    comingSoon: true,
    logo: Image.resolveAssetSource(AIRTELMONEY).uri,
  },
  {
    label: "Visa | Mastercard",
    value: "pesapal",
    comingSoon: true,
    logo: Image.resolveAssetSource(PESAPAL).uri,
  },
]

function Options() {
  const { toast, showToast } = useToast()
  const localParams = useLocalSearchParams()

  const {
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    values,
    isSubmitting,
    errors,
    touched,
    isValid,
  } = useFormik({
    initialValues: {
      option: options[0].value,
      paymentNumber: "",
      saveDetails: false,
      plan: localParams.selectedPlan || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, hp) => {
      try {
        hp.setSubmitting(true)

        const body = {
          ...values,
          userId: localParams.userId,
        }
        const response = await invoke({
          method: "POST",
          endpoint: "/payment/subscription",
          data: body,
        })

        if (response.error) {
          showToast({
            type: "danger",
            message: response.error?.message,
          })
          return
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
        hp.setSubmitting(false)
        showToast({
          type: "danger",
          message: "An error occurred trying to process your payment",
        })
      }
    },
  })

  const formattedOptions = options.map((option) => ({
    ...option,
    disabled: option.comingSoon,
  }))
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
        <Toast toast={toast} />
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
            <View className='space-y-3'>
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
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Modal transparent={true} visible={isSubmitting} animationType='slide'>
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
      </Modal>
    </View>
  )
}

export default Options
