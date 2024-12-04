import PaymentOptions from "@/components/PaymentOptions"
import { useToast } from "@context/ToastProvider"
import { COLORS, FONTSFAMILIES } from "@src/color/VariableColors"
import { useAuth } from "context/AuthProvider"
import { router, useLocalSearchParams } from "expo-router"
import { invoke } from "lib/axios"
import React from "react"
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { HStack } from "@react-native-material/core"
import { Octicons } from "@expo/vector-icons"

function Purchase() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const params = useLocalSearchParams() // filmId, videoId

  console.log(user?.id, params.videoId)

  const onSubmit = async (values, hp) => {
    try {
      hp.setSubmitting(true)

      if (values.option === "mtnmomo") {
        router.push({
          pathname: `/(home)/film/${params.id}/purchase/order`,
          params: {
            option: values.option,
            phoneCode: values.phoneCode,
            paymentNumber: values.paymentNumber,
            amount: values.amount,
            videoId: params.videoId,
            filmtitle: params.filmName,
            price: params.amount,
          },
        })

        return
      }

      const { res, error } = await invoke({
        method: "POST",
        endpoint: `/film/purchase/${user?.id}/${params?.videoId}`,
        data: {
          option: values.option,
          phoneCode: values.phoneCode,
          paymentNumber: values.paymentNumber,
        },
      })

      if (error) {
        throw new Error(error)
      }

      if (res?.redirect_url) {
        router.push({
          pathname: `/(home)/film/${params.id}/purchase/order-pesapal`,
          params: {
            option: values.option,
            phoneCode: values.phoneCode,
            paymentNumber: values.paymentNumber,
            amount: values.amount,
            videoId: params.videoId,
            filmtitle: params.filmName,
            price: params.amount,
            redirect_url: res.redirect_url,
          },
        })
      }
    } catch (e) {
      console.log("error", e)
      showToast({
        type: "error",
        message: "An error occurred. Please try again",
      })
    } finally {
      hp.setSubmitting(false)
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
            style={{ flex: 1, width: "100%" }}
          >
            <Animated.View
              style={[
                {
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                  padding: 20,
                },
              ]}
            >
              <View className='w-full space-y-4'>
                {/** form -Titles & subtitle */}
                <HStack
                  spacing={20}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <TouchableOpacity onPress={() => router.back()}>
                    <Octicons name='arrow-left' size={24} color={"#FFFAF6"} />
                  </TouchableOpacity>
                  <Text style={styles.formTitle}>Payment Options</Text>
                </HStack>
                <View>
                  <PaymentOptions onSubmit={onSubmit} loadSaved={true} />
                </View>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default Purchase

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
    fontFamily: "Inter-Regular",
    color: "#FFFAF6",
    fontSize: 16,

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
  radioBtnWrap: {
    borderWidth: 1,
    borderColor: "rgba(255, 250, 246, 0.25)",
    width: "100%",
    flexDirection: "row",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 6,
    paddingVertical: 11,
    paddingHorizontal: 11,
  },
  radioBtn: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: "#EE5170",
    borderRadius: 34,
  },
  radioTxt: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#FFFAF6",
  },
})
