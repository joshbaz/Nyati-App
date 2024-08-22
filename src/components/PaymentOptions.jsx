import { router } from "expo-router"
import React from "react"
import {
  Animated,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { BallIndicator } from "react-native-indicators"
import { useFormik } from "formik"
import * as yup from "yup"
import usePayments from "../../hooks/usePayments"
import { COLORS } from "../color/VariableColors"
import Checkbox from "./Checkbox"
import RadioGroup from "./RadioGroup"

const validationSchema = yup.object().shape({
  option: yup.string().required("Select a payment option"),
  paymentNumber: yup
    .string()
    .test("is-phone-number", "Invalid phone number", (value) => {
      if (!value) return false
      const phoneRegex = /^(\+|00)?[1-9][0-9 \-\(\)\.]{7,32}$/
      const isPhone = phoneRegex.test(value)
      return isPhone
    }),
  saveDetails: yup.boolean().default(false),
})

function PaymentOptions({ onSubmit, loadSaved }) {
  const { methods } = usePayments(loadSaved)
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
      option: methods[0].value,
      paymentNumber: "",
      saveDetails: false,
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  })

  return (
    <>
      <View
        className='space-y-5 w-full flex flex-col items-start justify-between'
        style={{
          height: "95%",
        }}
      >
        <View className='w-full space-y-5'>
          <Text className='text-white text-base'>Select Payment Method</Text>
          <View className='flex flex-col gap-y-4 py-2'>
            <RadioGroup
              options={methods}
              value={values.option}
              onSelect={(value) => {
                setFieldValue("option", value)
              }}
            >
              {(method) => (
                <View className='flex flex-row items-center justify-between w-auto '>
                  <Image
                    source={{ uri: method.logo }}
                    className='w-24 h-14 rounded bg-cover'
                  />
                  <View className='flex flex-col items-start ml-4'>
                    <Text className='text-base text-white '>
                      {method.label}
                    </Text>
                    {method.comingSoon ? (
                      <Text className='text-red-400 text-sm'>Coming Soon</Text>
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
            <View className='space-y-4'>
              <Text className='text-white text-base'>Add Mobile Number</Text>
              <View className='flex flex-col items-start gap-x-3 w-full space-y-2 '>
                <Text className='text-gray-400 text-sm'>Mobile Number</Text>
                <View
                  className='w-full flex flex-row items-center rounded-md'
                  style={{
                    backgroundColor: COLORS.formBg,
                  }}
                >
                  <View
                    className='flex items-center justify-center rounded-l-md'
                    style={{
                      width: "20%",
                      height: 54,
                      backgroundColor: COLORS.formBg,
                    }}
                  >
                    <Text className='text-white text-lg font-semibold'>
                      +256
                    </Text>
                  </View>

                  <TextInput
                    type='phone-pad'
                    id='paymentNumber'
                    name='paymentNumber'
                    enablesReturnKeyAutomatically
                    keyboardAppearance='dark'
                    onChangeText={handleChange("paymentNumber")}
                    onBlur={handleBlur("paymentNumber")}
                    placeholder='Enter your number'
                    value={values.paymentNumber}
                    className='w-full rounded-r-md text-white text-lg h-12 pr-4 pb-2'
                    style={{
                      borderColor: values.paymentNumber
                        ? COLORS.formBtnBg
                        : "transparent",
                      backgroundColor: COLORS.formBg,
                      color: "white",
                      width: "80%",
                      height: 54,
                    }}
                  />
                </View>
                {errors.paymentNumber && touched.paymentNumber ? (
                  <Text className='text-red-400 text-sm'>
                    {errors.paymentNumber}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
          <View className='w-full border-t-2 border-gray-400' />
          {loadSaved ? null : (
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
          )}

          {loadSaved ? (
            <View className='w-full py-4 '>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(home)/settings/membership",
                  })
                }
                className='border border-gray-400 rounded-lg p-4 flex flex-row items-center justify-center'
              >
                <Text className='text-white text-lg'>Edit Details</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <View className='w-full'>
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
    </>
  )
}

export default PaymentOptions
