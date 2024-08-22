import React from "react"
import {
  Animated,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native"
import { BallIndicator } from "react-native-indicators"
import { useFormik } from "formik"
import * as yup from "yup"
import AIRTELMONEY from "../../assets/AirtelMoney.png"
import MTNMOMO from "../../assets/MtnMoMo.png"
import PESAPAL from "../../assets/pesapal.png"
import { COLORS } from "../color/VariableColors"
import Checkbox from "./Checkbox"
import RadioGroup from "./RadioGroup"

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

const formattedOptions = options.map((option) => ({
  ...option,
  disabled: option.comingSoon,
}))

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

function PaymentOptions({ onSubmit }) {
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
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  })

  return (
    <>
      <View className='space-y-5 w-full'>
        <Text className='text-white text-base'>Select Payment Method</Text>
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
                  <Text className='text-base text-white '>{option.label}</Text>
                  {option.comingSoon ? (
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
                  <Text className='text-white text-lg font-semibold'>+256</Text>
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
        <View className='flex flex-row items-center justify-start w-full'>
          <Checkbox
            onPress={() => setFieldValue("saveDetails", !values.saveDetails)}
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
