import { Link, Redirect, router, useLocalSearchParams } from "expo-router"
import React, { useEffect } from "react"
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { BallIndicator } from "react-native-indicators"
import { SafeAreaView } from "react-native-safe-area-context"
import { HStack, VStack } from "@react-native-material/core"
import { Ionicons } from "@expo/vector-icons"
import { useFormik } from "formik"
import * as yup from "yup"
import { useAuth } from "../../context/AuthProvider"
import { COLORS, FONTSFAMILIES } from "../../src/color/VariableColors"

function SignIn() {
  const { login, isAuthenticated, loading } = useAuth()
  const params = useLocalSearchParams()
  const [textSecure, setTextSecure] = React.useState(true)
  const onChangeSecure = () => {
    setTextSecure(!textSecure)
  }

  //validation schema
  const validationSchema = yup.object().shape({
    contact: yup
      .string()
      .test("is_valid_contact", "Invalid contact", (value) => {
        const phoneRegex = /^(\+|00)[1-9][0-9 \-\(\)\.]{7,32}$/
        const isEmail = yup.string().email().isValidSync(value)
        const isPhone = phoneRegex.test(value)
        return isEmail || isPhone
      }),
    password: yup.string().required("Password is required"),
  })

  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      password: "",
      isEmail: params?.isEmail ? params?.isEmail : false,
      contact: params?.contact ? params?.contact : "",
    },
    validationSchema,
    onSubmit: async (values, hp) => {
      hp.setSubmitting(true)
      try {
        login({
          contact: values.contact,
          password: values.password,
          isEmail: values.isEmail,
        })

        if (isAuthenticated) {
          hp.resetForm()
          router.push("/(home)")
        }
      } catch (error) {
        showToast({
          type: "error",
          message: error.message,
        })
      } finally {
        hp.setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (values.contact && values.contact.length > 0) {
      const isEmail = yup.string().email().isValidSync(values.contact)
      setFieldValue("isEmail", isEmail)
    }
  }, [values.contact])

  if (isAuthenticated) {
    // redirect to home page if user is authenticated
    return <Redirect href='/(home)' />
  }

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.generalBg,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Animated.View
            style={[
              {
                flex: 1,
                alignItems: "center",
                justifyContent: "space-around",
              },
            ]}
          >
            <VStack
              spacing={30}
              style={{
                width: "85%",
              }}
            >
              {/** form -Titles & subtitle */}
              <VStack
                spacing={5}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Text style={styles.formTitle}>Sign in to your account</Text>
                <HStack spacing={5}>
                  <Text style={styles.formSubtitle}>Login below or</Text>
                  <Link href='/(auth)/register' style={styles.formBtnLink}>
                    <Text style={styles.formLinks}>create an account</Text>
                  </Link>
                </HStack>
              </VStack>

              <VStack spacing={70}>
                <VStack spacing={20}>
                  <VStack spacing={10} alignSelf={"stretch"}>
                    <Text style={styles.formLabel}>
                      Mobile Number, Username or Email
                    </Text>
                    <TextInput
                      style={styles.formInputs}
                      enablesReturnKeyAutomatically
                      keyboardAppearance='dark'
                      value={values.contact}
                      placeholder='some@email.com or 1234567890'
                      placeholderTextColor={COLORS.formBorder}
                      onChangeText={handleChange("contact")}
                      onBlur={handleBlur("contact")}
                    />
                    {touched.username && errors.username && (
                      <Text style={styles.formError}>{errors.username}</Text>
                    )}
                  </VStack>

                  <VStack spacing={10}>
                    <Text style={styles.formLabel}>Password</Text>
                    <HStack style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        secureTextEntry={textSecure}
                        enablesReturnKeyAutomatically
                        keyboardAppearance='dark'
                        value={values.password}
                        placeholder='********'
                        placeholderTextColor={COLORS.formBorder}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
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
                    </HStack>
                    {touched.password && errors.password && (
                      <Text style={styles.formError}>{errors.password}</Text>
                    )}
                  </VStack>
                </VStack>

                <VStack spacing={20} style={{ alignItems: "center" }}>
                  {isSubmitting || loading ? (
                    <View style={styles.formBtn}>
                      <ActivityIndicator size='small' color='white' />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.formBtn}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.formBtnText}>Sign In</Text>
                    </TouchableOpacity>
                  )}

                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => router.push("/(auth)/(forgotpassword)")}
                      style={[
                        styles.formBtnLink,
                        {
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          alignSelf: "flex-start",
                        },
                      ]}
                    >
                      <Text style={[styles.formLinks]}>Forget Password</Text>
                    </TouchableOpacity>
                  </View>
                </VStack>
              </VStack>
            </VStack>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {isSubmitting || loading ? (
        <Modal
          transparent={true}
          visible={isSubmitting || loading ? true : false}
          animationType='slide'
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
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
      ) : null}
    </View>
  )
}

export default SignIn

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
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.28,
  },
  formInputs: {
    height: 48,
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
