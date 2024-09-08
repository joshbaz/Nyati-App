import { router } from "expo-router"
import React, { useEffect } from "react"
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
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
import { useToast } from "../../context/ToastProvider"
import { invoke } from "../../lib/axios"
import { COLORS, FONTSFAMILIES } from "../../src/color/VariableColors"

const Register = () => {
  const { showToast } = useToast()
  const [textSecure, setTextSecure] = React.useState(true)
  const onChangeSecure = () => {
    setTextSecure(!textSecure)
  }

  //validation schema
  const validationSchema = yup.object().shape({
    contact: yup
      .string()
      .test("is-email-or-phone", "Invalid email or phone", (value) => {
        // phone number regex with the country code
        const phoneRegex = /^(\+|00)[1-9][0-9 \-\(\)\.]{7,32}$/
        const isEmail = yup.string().email().isValidSync(value)
        const isPhone = phoneRegex.test(value)
        return isEmail || isPhone
      })
      .required("Number or Email is required"),
    fullName: yup.string().required("Your fullname is required"),
    username: yup.string().required("Please enter a username"),
    password: yup.string().required("Password is required"),
    isEmail: yup.boolean().when("contact", {
      is: (contact) => contact && yup.string().email().isValidSync(contact),
      then: (schema) => schema.default(true),
      otherwise: (schema) => schema.default(false),
    }),
  })

  const {
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      contact: "",
      fullName: "",
      username: "",
      password: "",
      isEmail: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, hp) => {
      hp.setSubmitting(true)

      values.contact = values.contact.toLowerCase()
      values.username = values.username.toLowerCase()

      // modify the values
      const newValues = {
        ...values,
        firstName: values.fullName.split(" ")[0],
        lastName: values.fullName.split(" ")[1],
        role: "user",
        email: values.isEmail ? values.contact : "",
        phoneNumber: values.isEmail ? "" : values.contact,
      }
      delete newValues.fullName
      try {
        const response = await invoke({
          method: "POST",
          endpoint: "/user/register",
          data: newValues,
        })

        if (response.error) {
          throw new Error(response.error)
        }

        hp.setSubmitting(false)
        hp.resetForm()
        router.push({
          pathname: "/(auth)/verifyaccount",
          params: {
            isEmail: values.isEmail ?? true,
            contact: values.contact ?? "mymbugua@gmail.com",
          },
        })
      } catch (error) {
        console.log(error)
        showToast({
          type: "error",
          message: "Error creating account, try again",
        })
      }
    },
  })

  useEffect(() => {
    if (values.contact && values.contact.length > 0) {
      const isEmail = yup.string().email().isValidSync(values.contact)
      setFieldValue("isEmail", isEmail)
    }
  }, [values.contact])

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
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            width: "100%",
            marginTop: 0,
            paddingVertical: 100,
          }}
        >
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
                <VStack style={{ display: "flex", alignItems: "center" }}>
                  <Text style={styles.formTitle}>Create account</Text>
                  <HStack spacing={5}>
                    <Text style={styles.formSubtitle}>
                      Enter your account details below or
                    </Text>
                    <TouchableOpacity
                      style={styles.formBtnLink}
                      onPress={() => router.replace("/(auth)/signin")}
                    >
                      <Text style={styles.formLinks}>log in</Text>
                    </TouchableOpacity>
                  </HStack>
                </VStack>

                <VStack spacing={60}>
                  {/** form inputs */}
                  <VStack spacing={20}>
                    <VStack spacing={4}>
                      <Text style={styles.formLabel}>
                        Mobile Number or Email
                      </Text>
                      <TextInput
                        style={styles.formInputs}
                        enablesReturnKeyAutomatically
                        keyboardAppearance='dark'
                        value={values.contact}
                        onChangeText={handleChange("contact")}
                        onBlur={handleBlur("contact")}
                      />
                      {errors.contact && touched.contact ? (
                        <Text style={{ color: COLORS.formBtnBg }}>
                          {errors.contact}
                        </Text>
                      ) : null}
                    </VStack>

                    <VStack spacing={4}>
                      <Text style={styles.formLabel}>Full Name</Text>
                      <TextInput
                        style={styles.formInputs}
                        enablesReturnKeyAutomatically
                        keyboardAppearance='dark'
                        value={values.fullName}
                        onChangeText={handleChange("fullName")}
                        onBlur={handleBlur("fullName")}
                      />
                      {errors.fullName && touched.fullName ? (
                        <Text style={{ color: COLORS.formBtnBg }}>
                          {errors.fullName}
                        </Text>
                      ) : null}
                    </VStack>

                    <VStack spacing={4}>
                      <Text style={styles.formLabel}>Username</Text>
                      <TextInput
                        style={styles.formInputs}
                        enablesReturnKeyAutomatically
                        keyboardAppearance='dark'
                        value={values.username}
                        onChangeText={handleChange("username")}
                        onBlur={handleBlur("username")}
                      />
                      {errors.username && touched.username ? (
                        <Text style={{ color: COLORS.formBtnBg }}>
                          {errors.username}
                        </Text>
                      ) : null}
                    </VStack>

                    <VStack spacing={4}>
                      <Text style={styles.formLabel}>Password</Text>
                      <HStack style={styles.passwordContainer}>
                        <TextInput
                          style={styles.passwordInput}
                          secureTextEntry={textSecure}
                          enablesReturnKeyAutomatically
                          keyboardAppearance='dark'
                          value={values.password}
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
                      {errors.password && touched.password ? (
                        <Text style={{ color: COLORS.formBtnBg }}>
                          {errors.password}
                        </Text>
                      ) : null}
                    </VStack>
                  </VStack>

                  {/** form buttons */}
                  <VStack spacing={20} style={{ alignItems: "center" }}>
                    {isSubmitting ? (
                      <View style={styles.formBtn}>
                        <ActivityIndicator size='small' color='white' />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.formBtn}
                        onPress={handleSubmit}
                      >
                        <Text style={styles.formBtnText}>Create account</Text>
                      </TouchableOpacity>
                    )}
                  </VStack>
                  <Modal
                    transparent={true}
                    visible={isSubmitting}
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
                </VStack>
              </VStack>
            </Animated.View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default Register

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
    height: 48,
    backgroundColor: COLORS.formBg,
    borderRadius: 6,
    borderColor: COLORS.formBorder,
    borderWidth: 1,
    color: COLORS.formText,
    paddingLeft: 10,
    paddingRight: 10,
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
})
