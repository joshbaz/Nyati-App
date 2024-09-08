import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import {
  ActivityIndicator,
  Animated,
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
import { Ionicons } from "@expo/vector-icons"
import { useFormik } from "formik"
import * as yup from "yup"
import { useAuth } from "../../../context/AuthProvider"
import { useToast } from "../../../context/ToastProvider"
import { invoke } from "../../../lib/axios"
import { COLORS, FONTSFAMILIES } from "../../../src/color/VariableColors"

function ChangePassword() {
  const {} = useAuth()
  const { showToast } = useToast()
  const params = useLocalSearchParams()
  const [textSecure, setTextSecure] = React.useState(true)

  const onChangeSecure = () => {
    setTextSecure(!textSecure)
  }

  //validation schema
  const validationSchema = yup.object().shape({
    newpassword: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmpassword: yup
      .string()
      .oneOf([yup.ref("newpassword"), null], "Passwords do not match")
      .required("Confirm password is required"),
  })

  const {
    values,
    errors,
    touched,
    isValid,
    handleBlur,
    handleChange,
    isSubmitting,
    handleSubmit,
  } = useFormik({
    initialValues: {
      newpassword: "",
      confirmpassword: "",
    },
    validationSchema,
    onSubmit: async (values, hp) => {
      try {
        hp.setSubmitting(true)

        const response = await invoke({
          method: "PUT",
          endpoint: `/user/${params.userId}`,
          data: {
            password: values.newpassword,
          },
        })

        if (response.error) {
          hp.setSubmitting(false)
          throw new Error(response.error)
        }

        hp.setSubmitting(false)
        showToast({
          type: "success",
          message: "Password changed successfully",
        })
        setTimeout(() => {
          hp.resetForm()
          router.push({
            pathname: "/(auth)/signin",
            params: {
              contact: params.contact,
            },
          })
        }, 2000)
      } catch (error) {
        showToast({
          type: "error",
          message: "Something went wrong, please try again",
        })
        hp.setSubmitting(false)
        return
      }
    },
  })

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.generalBg }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Animated.View className='flex flex-col flex-1 items-center justify-between p-6 h-full w-full my-4 space-y-12'>
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
              <View className='flex flex-col items-start justify-start w-full space-y-12 flex-1'>
                <Text className='text-white text-lg text-center'>
                  Create a new password
                </Text>
                <View className='w-full space-y-6'>
                  {["newpassword", "confirmpassword"].map((field) => (
                    <View className='w-full space-y-2' key={field}>
                      <Text style={styles.formLabel}>
                        {field === "newpassword"
                          ? "New Password"
                          : "Confirm Password"}
                      </Text>
                      <View
                        className='flex flex-row'
                        style={styles.passwordContainer}
                      >
                        <TextInput
                          style={styles.passwordInput}
                          secureTextEntry={textSecure}
                          enablesReturnKeyAutomatically
                          keyboardAppearance='dark'
                          value={values[field]}
                          placeholder='********'
                          placeholderTextColor={COLORS.formBorder}
                          onChangeText={handleChange(field)}
                          onBlur={handleBlur(field)}
                        />
                        {textSecure ? (
                          <Pressable
                            onPress={onChangeSecure}
                            style={styles.passwordIcon}
                          >
                            <Ionicons
                              name='eye-off-outline'
                              size={25}
                              color={COLORS.formText}
                            />
                          </Pressable>
                        ) : (
                          <Pressable
                            onPress={onChangeSecure}
                            style={styles.passwordIcon}
                          >
                            <Ionicons
                              name='eye-outline'
                              size={25}
                              color={COLORS.formText}
                            />
                          </Pressable>
                        )}
                      </View>
                      {errors[field] && (
                        <Text style={styles.formError}>{errors[field]}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
              <Pressable
                disabled={isSubmitting || !values.newpassword || !isValid}
                onPress={() => handleSubmit()}
                className='flex flex-row items-center justify-center w-full p-4 mt-4 rounded-full h-auto bg-primary-main active:opacity-70 disabled:opacity-50'
                style={{
                  opacity:
                    isSubmitting || !values.newpassword || !isValid ? 0.5 : 1,
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

export default ChangePassword

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
