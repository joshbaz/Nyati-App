import { router, useLocalSearchParams } from "expo-router"
import React, { useMemo } from "react"
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useFormik } from "formik"
import * as yup from "yup"
import { useMembership } from "../../../../context/MembershipProvider"
import { useToast } from "../../../../context/ToastProvider"
import { COLORS } from "../../../../src/color/VariableColors"
import Checkbox from "../../../../src/components/Checkbox"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import TopNav from "../../../../src/components/TopNav"

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
  phoneCode: yup.string().default("+256"),
  defaultStatus: yup.boolean().default(false),
})

function EditMethod() {
  const { showToast } = useToast()
  const params = useLocalSearchParams()
  const {
    payloading,
    updatePaymentMethod,
    savedMethods: methods,
  } = useMembership()

  const method = useMemo(() => {
    return methods?.find((method) => method?.id === params?.id)
  }, [params?.id])

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
      option: method?.details?.option || "",
      defaultStatus: method?.defaultStatus || false,
      phoneCode: "+256",
      paymentNumber:
        method?.details?.paymentNumber &&
        method?.details?.paymentNumber?.includes("+256")
          ? method?.details?.paymentNumber.slice(4)
          : method?.details?.paymentNumber,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, hp) => {
      try {
        hp.setSubmitting(true)
        const body = {
          ...values,
          name: values.option,
          paymentNumber: values.phoneCode + values.paymentNumber,
        }
        delete body.phoneCode

        updatePaymentMethod(method?.id, body)
        setTimeout(() => {
          router.replace("/(home)/settings/(membership)/payment-methods")
        }, 1500)
      } catch (err) {
        const message = err.message || "An error occurred. Please try again"
        showToast({
          message,
          type: "error",
        })
      } finally {
        hp.setSubmitting(false)
      }
    },
  })

  return (
    <PageLayoutWrapper>
      <View className='space-y-4 w-full'>
        <View className='space-y-4'>
          <TopNav title='Edit Payment Method' hideMenu={true} />
          <View className='space-y-6'>
            <Text className='text-lg font-semibold text-white text-sans'>
              Payment Method
            </Text>
            <View className='flex flex-row items-center p-3 rounded-lg bg-secondary-600 border-2 border-border'>
              <Image
                source={{ uri: method?.logo }}
                className='w-24 h-14 rounded bg-cover'
              />
              <Text className='text-white text-lg ml-3'>{method?.label}</Text>
            </View>
            <View className='border-y-2 border-white/70 py-6 space-y-4'>
              <Text className='text-white text-lg font-semibold'>
                Mobile Number
              </Text>
              <View className='flex flex-col items-start w-full space-y-3 '>
                <Text className='text-gray-400 text-sm'>Mobile Number</Text>
                <View
                  className='w-full flex flex-row items-center rounded-md mt-3'
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
                      {values.phoneCode}
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

              <View className='flex flex-row items-center justify-start w-full'>
                <Checkbox
                  onPress={() =>
                    setFieldValue("defaultStatus", !values.defaultStatus)
                  }
                  status={values.defaultStatus ? "checked" : "unchecked"}
                />

                <Text className='text-gray-400 text-sm ml-2'>
                  Make this my default payment method
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <View className='flex flex-col items-center justify-center gap-y-6 pt-36'>
            <TouchableOpacity
              disabled={isSubmitting || !isValid || payloading}
              onPress={() => handleSubmit()}
              className='w-full rounded-full bg-primary-500 h-12 flex items-center justify-center px-4'
              style={{
                opacity: isSubmitting || !isValid || payloading ? 0.5 : 1,
              }}
            >
              {isSubmitting || payloading ? (
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
      </View>
    </PageLayoutWrapper>
  )
}

export default EditMethod
