import Checkbox from "expo-checkbox"
import { useRouter } from "expo-router"

import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { HStack, VStack } from "@react-native-material/core"

import { Octicons } from "@expo/vector-icons"

import { Formik } from "formik"

import * as yup from "yup"

import { COLORS, FONTSFAMILIES } from "../../src/color/VariableColors"

const RegularAmounts = [
  {
    key: "1",
    amount: 10000,
  },
  {
    key: "2",
    amount: 20000,
  },
  {
    key: "3",
    amount: 40000,
  },
  {
    key: "4",
    amount: 100000,
  },
  {
    key: "5",
    amount: 200000,
  },
  {
    key: "6",
    amount: 400000,
  },
]

const Donate = () => {
  const router = useRouter()
  const [editedAmount, setEditedAmount] = useState(null)
  const validationSchema = yup.object().shape({
    amount: yup.string().required("required"),
    donateAnonymously: yup.bool().oneOf([true, false], "Field must be checked"),
    agreeTerms: yup.bool().oneOf([true], "Field must be checked"),
    agreePrivacyPolicy: yup.bool().oneOf([true], "Field must be checked"),
  })

  const [isSubmittingp, setIsSubmittingp] = React.useState(false)
  useEffect(() => {
    if (isSubmittingp) {
      setTimeout(() => {
        setIsSubmittingp(() => false)
        navigation.navigate("PaymentOptions")
      }, 500)
    }
  }, [isSubmittingp])

  const changeValues = (setFieldValue, val) => {
    let changeV = typeof val === "string" ? val.replace(/,/g, "") : val
    let vsi = changeV !== null || changeV !== "" ? parseInt(changeV) : null

    if (isNaN(vsi)) {
      console.log("Not A NUMBER")
      setFieldValue("amount", null)
    } else {
      let transformedTxt = vsi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      setFieldValue("amount", transformedTxt)
    }
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
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",

            width: "100%",

            marginTop: 0,
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
                  justifyContent: "flex-start",
                },
              ]}
            >
              <VStack
                spacing={30}
                style={{
                  width: "95%",
                }}
              >
                {/** form -Titles & subtitle */}
                <HStack
                  spacing={20}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <TouchableOpacity onPress={() => router.back()}>
                    <Octicons name='arrow-left' size={24} color={"#FFFAF6"} />
                  </TouchableOpacity>
                  <Text style={styles.formTitle}>Donate</Text>
                </HStack>
                <Formik
                  initialValues={{
                    amount: null,
                    donateAnonymously: false,
                    agreeTerms: false,
                    agreePrivacyPolicy: false,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values, helpers) => {
                    // setHelperFunctions(helpers)
                    // dispatch(Login(values))
                    setIsSubmittingp(() => true)
                  }}
                >
                  {({
                    values,
                    handleChange,
                    setFieldValue,
                    handleBlur,
                    handleSubmit,
                  }) => (
                    <VStack spacing={60}>
                      {/** form inputs */}
                      <View spacing={20}>
                        <VStack spacing={10}>
                          <Text style={styles.formLabel}>Enter Amount</Text>
                          <HStack style={styles.amountContainer}>
                            <View style={styles.amountIcon}>
                              <Text style={styles.amountIconTxt}>UGX</Text>
                            </View>

                            <TextInput
                              style={styles.amountInput}
                              enablesReturnKeyAutomatically
                              keyboardAppearance='dark'
                              keyboardType='numeric'
                              value={values.amount}
                              onChangeText={(e) =>
                                changeValues(setFieldValue, e)
                              }
                              onBlur={handleBlur("amount")}
                            />
                          </HStack>
                        </VStack>

                        {/** divider */}
                        <View style={styles.horizontalLine} />
                        {/** amount selector */}
                        <View style={styles.amountSelectorWrap}>
                          {RegularAmounts.map((data, index) => {
                            return (
                              <TouchableOpacity
                                key={index}
                                style={styles.amountSelectorBtn}
                                onPress={() =>
                                  changeValues(setFieldValue, data.amount)
                                }
                              >
                                <Text style={styles.amountSelectorTxt}>
                                  {data.amount
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </Text>
                              </TouchableOpacity>
                            )
                          })}
                        </View>

                        {/** divider */}
                        <View style={styles.horizontalLine} />
                        {/** CheckBox policies */}
                        <VStack spacing={20}>
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 10,
                            }}
                          >
                            <Checkbox
                              value={values.donateAnonymously}
                              color={COLORS.formBtnBg}
                              style={{ width: 24, height: 24 }}
                              onValueChange={(e) => {
                                setFieldValue("donateAnonymously", e)
                              }}
                            />

                            <Text style={styles.checkboxTxt}>
                              Donate as anonymous
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              gap: 10,
                            }}
                          >
                            <Checkbox
                              value={values.agreeTerms}
                              color={COLORS.formBtnBg}
                              style={{ width: 24, height: 24 }}
                              onValueChange={(e) => {
                                setFieldValue("agreeTerms", e)
                              }}
                            />
                            <Text style={styles.checkboxTxt}>
                              I agree with the Terms and Conditions
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              gap: 10,
                            }}
                          >
                            <Checkbox
                              value={values.agreePrivacyPolicy}
                              color={COLORS.formBtnBg}
                              style={{ width: 24, height: 24 }}
                              onValueChange={(e) => {
                                setFieldValue("agreePrivacyPolicy", e)
                              }}
                            />
                            <View style={{ flexDirection: "row" }}>
                              <Text style={styles.checkboxTxt}>
                                I agree with Nyati Films{" "}
                              </Text>
                              <TouchableOpacity style={styles.privacyBtnLink}>
                                <Text style={styles.privacyPolicy}>
                                  Privacy Policy
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </VStack>
                      </View>

                      {/** form buttons */}
                      <VStack spacing={20} style={{ alignItems: "center" }}>
                        {isSubmittingp ? (
                          <View style={styles.formBtn}>
                            <ActivityIndicator size='small' color='white' />
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.formBtn}
                            onPress={handleSubmit}
                          >
                            <Text style={styles.formBtnText}>Continue</Text>
                          </TouchableOpacity>
                        )}
                      </VStack>
                    </VStack>
                  )}
                </Formik>
              </VStack>
            </Animated.View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default Donate

const styles = StyleSheet.create({
  formTitle: {
    color: COLORS.formTitle,
    fontFamily: FONTSFAMILIES.formTitlefont,
    fontSize: 20,

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
    borderBottomColor: "#06F",
    borderBottomWidth: 1,
  },
  formLabel: {
    fontFamily: "Inter-SemiBold",
    color: "#FFFAF6",
    fontSize: 16,

    letterSpacing: -0.28,
    textAlign: "center",
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
  amountContainer: {
    height: 48,
    width: "100%",
    backgroundColor: COLORS.formBg,
    borderRadius: 6,
    borderColor: "#EE5170",
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: 10,
  },
  amountInput: {
    width: "80%",
    paddingLeft: 10,
    paddingRight: 10,
    color: COLORS.formText,
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
  },
  amountIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "20%",
    backgroundColor: "transparent",
    alignSelf: "flex-start",
  },
  amountIconTxt: {
    color: COLORS.formText,
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
  },
  amountSelectorWrap: {
    marginHorizontal: "auto",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  amountSelectorBtn: {
    borderWidth: 1,
    borderColor: "#ED3F62",
    borderRadius: 24,
    paddingVertical: 9,
    paddingHorizontal: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  amountSelectorTxt: {
    color: "#ED3F62",
    fontFamily: "Inter-ExtraBold",
    fontSize: 14,
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
  horizontalLine: {
    borderBottomColor: "rgba(242, 242, 242, 0.60)",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  checkboxTxt: {
    color: "rgba(255, 250, 246, 0.60)",
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },
  privacyBtnLink: {
    alignSelf: "flex-start",
    borderBottomColor: "#06F",
    borderBottomWidth: 1,
  },

  privacyPolicy: {
    color: "#06F",
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },
})
