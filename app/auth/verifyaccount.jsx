import { router, useLocalSearchParams } from "expo-router"
import { jwtDecode } from "jwt-decode"
import React, { useCallback, useEffect } from "react"
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { OtpInput } from "react-native-otp-entry"
import { SafeAreaView } from "react-native-safe-area-context"
import { HStack, Stack, VStack } from "@react-native-material/core"
import { useFormik } from "formik"
import * as yup from "yup"
import { useAuth } from "../../context/AuthProvider"
import { Toast, useToast } from "../../context/ToastProvider"
import { invoke } from "../../lib/axios"
import { COLORS, FONTSFAMILIES } from "../../src/color/VariableColors"

const breakParams = (param, isEmail) => {
  // replace some of the characters in the string with ***
  let str = param
  let newStr = ""
  if (isEmail) {
    const splitEmail = str.split("@")
    str = splitEmail[0]
    let strArray = str ? str.split("") : []
    for (let i = 0; i < strArray?.length; i++) {
      if (i < 2) {
        newStr += strArray[i]
      } else {
        newStr += "*"
      }
    }
    return `${newStr}@${splitEmail[1]}`
  }
  // This is in case of phone number
  let strArray = str.split("")
  for (let i = 0; i < strArray.length; i++) {
    if (i < 4 || i > strArray.length - 4) {
      newStr += strArray[i]
    } else {
      newStr += "*"
    }
  }

  return newStr
}

const validationSchema = yup.object().shape({
  otp: yup.string().required("OTP is required"),
})

const VerifyAccount = () => {
  const { setToken } = useAuth()
  const localParams = useLocalSearchParams()
  const { showToast, toast } = useToast()
  const [isSubmitResending, setIsSubmitResending] = React.useState(false)

  const { handleSubmit, values, setFieldValue, isSubmitting } = useFormik({
    initialValues: {
      otp: "",
      timer: 0,
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
            contact: localParams.contact,
            isEmail: localParams.isEmail,
          },
        })

        if (response.error) {
          hp.setSubmitting(false)
          showToast({
            type: "danger",
            message: "Something went wrong, please try again",
          })
          return
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
            type: "danger",
            message: "Something went wrong, please try again",
          })
          hp.setSubmitting(false)
          return
        }

        hp.setSubmitting(false)
        hp.resetForm()
        router.push({
          pathname: "/auth/registersuccess",
          params: {
            contact: localParams.contact,
            isEmail: localParams.isEmail,
            userId: userId,
          },
        })
      } catch (error) {
        showToast({
          type: "danger",
          message: "Something went wrong, please try again",
        })
        hp.setSubmitting(false)
        return
      }
    },
  })

  // make a request to send the otp when the component mounts
  const makeOTPRequest = useCallback(
    async (isResending = false) => {
      if (!localParams.contact || !localParams.isEmail) return
      if (isResending) {
        setIsSubmitResending(true)
      }
      console.log
      try {
        const response = await invoke({
          method: "POST",
          endpoint: "/user/sendotp",
          data: {
            contact: localParams.contact,
            isEmail: localParams.isEmail,
          },
        })

        if (response.error) {
          // setFieldValue("timer", 0)
          throw new Error(response.error)
        }
        console.log("OTP sent")

        // start the timer
        if (isResending) {
          setFieldValue("timer", 60 * 2)
          setIsSubmitResending(false)
        } else {
          setFieldValue("timer", 60)
        }
      } catch (error) {
        setFieldValue("timer", 0)
        console.error("error", error)
        setIsSubmitResending(false)
        showToast({
          type: "danger",
          message: "Error sending OTP code",
        })
        return
      }
    },
    [localParams.isEmail, localParams.contact],
  )

  useEffect(() => {
    console.log("I need to on run once")
    makeOTPRequest()
  }, [makeOTPRequest])

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
          <Toast toast={toast} />
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
                  <HStack spacing={5}>
                    <Text style={styles.formSubtitle}>
                      Code has been sent to{" "}
                      {breakParams(localParams.contact, localParams.isEmail)}
                    </Text>
                  </HStack>
                </VStack>

                <VStack w='100%' items='center' spacing={100}>
                  {/** inputs */}
                  <Stack w='100%' items='center' spacing={40}>
                    <OtpInput
                      numberOfDigits={4}
                      onFilled={(code) => console.log("code", code)}
                      onTextChange={(otp) => {
                        console.log("otp", otp)
                        setFieldValue("otp", otp)
                      }}
                      focusColor={COLORS.formBtnBg}
                      blurOnFilled={true}
                      theme={{
                        pinCodeContainerStyle: {
                          width: 70,
                          height: 70,
                          borderColor: COLORS.formBorder,
                          borderRadius: 6,
                          backgroundColor: COLORS.formBg,
                        },
                        pinCodeTextStyle: {
                          color: COLORS.formText,
                          fontSize: 24,
                          fontFamily: FONTSFAMILIES.formBtnText,
                        },
                      }}
                    />

                    <HStack
                      items='center'
                      spacing={5}
                      style={{ marginTop: 20 }}
                    >
                      <Text style={styles.formSubtitle}>Resend Code in</Text>
                      {isSubmitResending ? (
                        <View>
                          <ActivityIndicator
                            size='small'
                            color={COLORS.formBtnBg}
                          />
                        </View>
                      ) : (
                        <TouchableOpacity
                          disabled={values.timer > 0 || isSubmitResending}
                          onPress={async () => await makeOTPRequest(true)}
                        >
                          {values.timer > 0 ? (
                            <MemoizedTimer
                              time={values.timer}
                              setTime={(time) => setFieldValue("timer", time)}
                            />
                          ) : (
                            <Text style={styles.formLinks}>Resend</Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </HStack>
                  </Stack>

                  {/** button & signup */}
                  <VStack
                    w='100%'
                    spacing={20}
                    style={{ alignItems: "center" }}
                  >
                    {isSubmitting ? (
                      <View style={styles.formBtn}>
                        <ActivityIndicator size='small' color='white' />
                      </View>
                    ) : (
                      <TouchableOpacity
                        disabled={
                          isSubmitting || !values.otp || values.otp.length < 4
                        }
                        onPress={() => handleSubmit()}
                        style={styles.formBtn}
                      >
                        <Text style={styles.formBtnText}>Continue</Text>
                      </TouchableOpacity>
                    )}
                  </VStack>
                </VStack>
              </VStack>
            </Animated.View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

function Timer({ time, setTime }) {
  // update the timer every second
  useEffect(() => {
    if (time >= 0) {
      const interval = setInterval(() => {
        setTime(time - 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [time])
  return (
    <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.formBtnBg }}>
      {time} s
    </Text>
  )
}

const MemoizedTimer = React.memo(Timer)

export default VerifyAccount

const styles = StyleSheet.create({
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    height: 60,
  },
  otpInputsText: {
    fontFamily: FONTSFAMILIES.formBtnText,
    backgroundColor: COLORS.formBg,
    borderRadius: 6,
    borderColor: COLORS.formBorder,
    borderWidth: 1,
    letterSpacing: 0.1,
    fontSize: 20,
    color: COLORS.formText,

    height: "100%",
    width: 70,
    alignItems: "center",
    justifyContent: "center",

    textAlign: "center",
    color: COLORS.formText,
  },
})
