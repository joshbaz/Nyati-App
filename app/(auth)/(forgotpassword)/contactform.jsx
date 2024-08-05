import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useFormik } from "formik"
import * as yup from "yup"
import { Toast, useToast } from "../../../context/ToastProvider"
import { invoke } from "../../../lib/axios"
import { COLORS, FONTSFAMILIES } from "../../../src/color/VariableColors"

const { width, height } = Dimensions.get("window")

function ContactForm() {
  const params = useLocalSearchParams()
  const { toast, showToast } = useToast()

  //validation schema
  const validationSchema = yup.object().shape({
    contact: yup
      .string()
      .test(
        params.contact === "email" ? "is_email" : "is_phone",
        `Please enter a valid ${params.contact}`,
        (value) => {
          const phoneRegex = /^(\+|00)[1-9][0-9 \-\(\)\.]{7,32}$/
          if (params.contact === "email") {
            return yup.string().email().isValidSync(value)
          }
          const isPhone = phoneRegex.test(value)
          return isPhone
        },
      )
      .required("Contact is required"),
    isEmail: yup.boolean().default(false),
  })

  const {
    values,
    errors,
    isValid,
    handleBlur,
    handleChange,
    isSubmitting,
    handleSubmit,
  } = useFormik({
    initialValues: {
      contact: params.contact === "email" ? "" : "+256",
      isEmail: params.contact === "email",
    },
    validationSchema,
    onSubmit: async (values, hp) => {
      try {
        hp.setSubmitting(true)

        const response = await invoke({
          method: "POST",
          endpoint: "/user/sendotp",
          data: {
            contact: values.contact.toLowerCase(),
            isEmail: values.isEmail,
          },
        })

        if (response.error) {
          throw new Error(response.error)
        }

        hp.setSubmitting(false)
        hp.resetForm()
        router.push({
          pathname: "/(auth)/(forgotpassword)/verifyotp",
          params: {
            contact: values.contact.toLowerCase(),
            isEmail: values.isEmail,
          },
        })
      } catch (error) {
        console.log(error)
        showToast({
          type: "danger",
          message: "Something went wrong, please try again",
        })
        hp.setSubmitting(false)
        return
      }
    },
  })

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.generalBg,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Toast toast={toast} />
          <Animated.View className='flex flex-1 items-center justify-between p-6 h-full w-full my-4 '>
            <View className='w-full '>
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
            <View className='flex flex-col flex-1 items-center justify-between w-full'>
              <View className='w-full h-32'></View>
              <View className='w-full space-y-6 flex-1'>
                <Text className='text-white text-lg'>
                  Enter your account details below
                </Text>
                <View className='w-full'>
                  <View className='flex flex-col items-start justify-start w-full space-y-3 '>
                    <Text className='text-secondary-50 text-lg'>
                      {params.contact === "email"
                        ? "Email Address"
                        : "Phone Number"}
                    </Text>
                    <TextInput
                      style={styles.formInputs}
                      enablesReturnKeyAutomatically
                      keyboardAppearance='dark'
                      keyboardType={
                        params.contact === "email"
                          ? "email-address"
                          : "phone-pad"
                      }
                      value={values.contact}
                      placeholder={
                        params.contact === "email"
                          ? "Enter your email"
                          : "Enter your number"
                      }
                      placeholderTextColor={COLORS.formBorder}
                      onChangeText={handleChange("contact")}
                      onBlur={handleBlur("contact")}
                    />
                    {errors.contact && (
                      <Text className='text-primary-main text-lg font-medium'>
                        {errors.contact}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <Pressable
                disabled={isSubmitting || !values.contact || !isValid}
                onPress={() => handleSubmit()}
                className='flex flex-row items-center justify-center w-full p-4 mt-4 rounded-full h-auto bg-primary-main active:opacity-70 disabled:opacity-50'
                style={{
                  opacity:
                    isSubmitting || !values.contact || !isValid ? 0.5 : 1,
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator color='white' size={20} />
                ) : (
                  <Text className='text-white text-lg font-medium'>
                    Continue
                  </Text>
                )}
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

export default ContactForm

const styles = StyleSheet.create({
  formTitle: {
    color: COLORS.formTitle,
    fontFamily: FONTSFAMILIES.formTitlefont,
    fontSize: 27,
    lineHeight: 36,
    letterSpacing: -0.54,
  },
  formSubtitle: {
    color: COLORS.formSubTitle,
    fontFamily: FONTSFAMILIES.formSubTitle,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.32,
  },
  formLinks: {
    color: COLORS.formLinks,
    fontFamily: FONTSFAMILIES.formLinks,
    fontSize: 16,
    lineHeight: 22,

    letterSpacing: -0.32,
  },
  formBtnLink: {
    borderBottomColor: COLORS.formLinks,
    borderBottomWidth: 1,
  },
  formLabel: {
    fontFamily: FONTSFAMILIES.formLabel,
    color: COLORS.formLabel,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.28,
  },
  formInputs: {
    height: 50,
    width: "100%",
    backgroundColor: COLORS.formBg,
    borderRadius: 6,
    borderColor: COLORS.formBorder,
    borderWidth: 1,
    color: COLORS.formText,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: FONTSFAMILIES.formText,
  },
  passwordContainer: {
    height: 48,
    backgroundColor: COLORS.formBg,
    borderRadius: 6,
    borderColor: COLORS.formBorder,
    borderWidth: 1,
  },
  passwordInput: {
    width: "89%",
    paddingLeft: 10,
    color: COLORS.formText,
  },
  passwordIcon: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "transparent",
    width: "11%",
    color: COLORS.formText,
  },
  formBtn: {
    backgroundColor: COLORS.formBtnBg,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 52,

    borderRadius: 100,
  },
  formBtnText: {
    fontFamily: FONTSFAMILIES.formBtnText,
    color: COLORS.formBtnText,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: "bold",
  },
  formError: {
    color: COLORS.formBtnBg,
    fontFamily: FONTSFAMILIES.formError,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.28,
  },
})
