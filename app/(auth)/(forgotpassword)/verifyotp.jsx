import { router, useLocalSearchParams } from "expo-router"
import { jwtDecode } from "jwt-decode"
import React from "react"
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useFormik } from "formik"
import * as yup from "yup"
import { useAuth } from "../../../context/AuthProvider"
import { useToast } from "../../../context/ToastProvider"
import { invoke } from "../../../lib/axios"
import { COLORS } from "../../../src/color/VariableColors"
import OtpConfirm from "../../../src/components/OtpConfirm"
import { breakParams } from "../../../src/utils/breakParams"

function VerifyOtp() {
  const params = useLocalSearchParams()
  const { showToast } = useToast()
  const { setToken } = useAuth()

  //validation schema
  const validationSchema = yup.object().shape({
    otp: yup.string().required("OTP is required"),
    timer: yup.number(),
    isResending: yup.boolean().default(false),
  })

  const { values, isValid, isSubmitting, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        otp: "",
        timer: 60,
        isResending: false,
      },
      validationSchema,
      onSubmit: async (values, hp) => {
        try {
          hp.setSubmitting(true)
          if (!values.otp) {
            showToast({
              type: "warning",
              message: "Please enter the OTP code",
            })
            hp.setSubmitting(false)
            return
          }

          const response = await invoke({
            method: "POST",
            endpoint: "/user/verifyotp",
            data: {
              otp: values.otp,
              contact: params.contact,
              isEmail: params.isEmail,
            },
          })

          if (response.error) {
            console.log("Errors", response.error)
            hp.setSubmitting(false)
            throw new Error(response.error)
          }

          // get the token and save it to secure storage & fetch the user's profile
          setToken(response.res?.token)

          // get the id from the token
          const payload = response.res?.token
            ? jwtDecode(response.res.token)
            : null
          const userId = payload?.id ?? ""

          if (!userId) {
            showToast({
              type: "error",
              message: "Something went wrong, please try again",
            })
            hp.setSubmitting(false)
            return
          }

          hp.setSubmitting(false)
          hp.resetForm()
          router.push({
            pathname: "/(auth)/(forgotpassword)/changepassword",
            params: {
              contact: params.contact,
              isEmail: params.isEmail,
              userId: userId,
            },
          })
        } catch (error) {
          console.log("Errors", error)
          showToast({
            type: "error",
            message: "Something went wrong, please try again",
          })
          hp.setSubmitting(false)
          return
        }
      },
    })

  const handleOtpResend = async () => {
    let count = 1
    try {
      setFieldValue("isResending", true)
      setFieldValue("otp", "")
      const response = await invoke({
        method: "POST",
        endpoint: "/user/sendotp",
        data: {
          contact: params.contact,
          isEmail: params.isEmail,
        },
      })

      if (response.error) {
        showToast({
          type: "error",
          message: "Something went wrong, please try again",
        })
        setFieldValue("isResending", false)
        return
      }

      showToast({
        type: "success",
        message: "OTP code has been resent",
      })
      setFieldValue("timer", 60 * count)
      setFieldValue("isResending", false)
      count += 1
    } catch (error) {
      console.log("error", error)
      count = 1 // reset the count
      setFieldValue("timer", 0) // reset the timer
      showToast({
        type: "error",
        message: "Something went wrong, please try again",
      })
      setFieldValue("isResending", false)
      return
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.generalBg }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* <Toast toast={toast} /> */}
          <Animated.View className='flex flex-col flex-1 items-center justify-between p-6 h-full w-full my-4'>
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
            <View className='flex flex-col flex-1 items-center justify-between w-full'>
              <View className='w-full h-32'></View>
              <View className='flex flex-col items-center justify-start w-full space-y-8 flex-1'>
                <Text className='text-white text-lg text-center'>
                  Code has been sent to{" "}
                  {breakParams(params.contact, params.isEmail)}
                </Text>
                <View className='w-full'>
                  <OtpConfirm
                    timer={values.timer}
                    resendCode={handleOtpResend}
                    isResending={values.isResending}
                    onCodeChange={(code) => setFieldValue("otp", code)}
                    handleTimeChange={(time) => setFieldValue("timer", time)}
                  />
                </View>
              </View>
              <Pressable
                disabled={isSubmitting || !values.otp || !isValid}
                onPress={() => handleSubmit()}
                className='flex flex-row items-center justify-center w-full p-4 mt-4 rounded-full h-auto bg-primary-main active:opacity-70 disabled:opacity-50'
                style={{
                  opacity: isSubmitting || !values.otp || !isValid ? 0.5 : 1,
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

export default VerifyOtp
