import { useLocalSearchParams, useRouter } from "expo-router"
import React from "react"
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { HStack, VStack } from "@react-native-material/core"
import { Ionicons } from "@expo/vector-icons"
import { useFormik } from "formik"
import * as yup from "yup"
import { COLORS, FONTSFAMILIES } from "../../../src/color/VariableColors"

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

const { height } = Dimensions.get("window")

function AmountPage() {
  const router = useRouter()
  const { filmId } = useLocalSearchParams()

  const validationSchema = yup.object().shape({
    amount: yup.string().required("required"),
  })

  const { handleSubmit, isSubmitting, handleBlur, setFieldValue, values } =
    useFormik({
      initialValues: {
        amount: null,
      },
      validationSchema: validationSchema,
      onSubmit: (values, hp) => {
        if (!values.amount) return
        hp.setSubmitting(true)

        router.push({
          pathname: "/(home)/donate/options",
          params: {
            amount: values.amount.replace(/,/g, ""),
            filmId,
          },
        })

        hp.setSubmitting(false)
      },
    })

  const changeValues = (setFieldValue, val) => {
    let changeV = typeof val === "string" ? val.replace(/,/g, "") : val
    let vsi = changeV !== null || changeV !== "" ? parseInt(changeV) : null

    if (isNaN(vsi)) {
      console.log("Not A NUMBER")
      setFieldValue("amount", "")
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
                  <Ionicons name='arrow-back' size={24} color={"#FFFAF6"} />
                </TouchableOpacity>
                <Text style={styles.formTitle}>Donate</Text>
              </HStack>

              <View
                className='flex flex-col items-start justify-between '
                style={{
                  height: height - 200,
                }}
              >
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
                        onChangeText={(e) => changeValues(setFieldValue, e)}
                        onBlur={handleBlur("amount")}
                      />
                    </HStack>
                  </VStack>

                  {/** divider */}
                  <View style={styles.horizontalLine} />
                  {/** amount selector */}
                  <View style={styles.amountSelectorWrap}>
                    {RegularAmounts.map((data) => {
                      const isActive = values.amount
                        ? values.amount?.replace(",", "") ===
                          data.amount.toString()
                        : false

                      return (
                        <TouchableOpacity
                          key={data.key}
                          style={{
                            ...styles.amountSelectorBtn,
                            backgroundColor: isActive
                              ? COLORS.formBtnBg
                              : "transparent",
                          }}
                          onPress={() =>
                            changeValues(setFieldValue, data.amount)
                          }
                        >
                          <Text
                            style={{
                              ...styles.amountSelectorTxt,
                              color: isActive ? COLORS.formBtnText : "#ED3F62",
                            }}
                          >
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
                </View>

                {/** form buttons */}
                <VStack
                  spacing={20}
                  style={{ alignItems: "center", width: "100%" }}
                >
                  {isSubmitting ? (
                    <View style={styles.formBtn}>
                      <ActivityIndicator size='small' color='white' />
                    </View>
                  ) : (
                    <TouchableOpacity
                      disabled={!values.amount}
                      style={{
                        ...styles.formBtn,
                        opacity: values.amount || isSubmitting ? 1 : 0.6,
                      }}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.formBtnText}>Continue</Text>
                    </TouchableOpacity>
                  )}
                </VStack>
              </View>
            </VStack>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

export default AmountPage

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
    height: 60,
    width: "100%",
    backgroundColor: COLORS.formBg,
    borderRadius: 10,
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
    width: 120,
    height: 44,
  },
  amountSelectorTxt: {
    color: "#ED3F62",
    fontFamily: "Inter-ExtraBold",
    fontSize: 15,
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
