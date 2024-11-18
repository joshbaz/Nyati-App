import { useToast } from "context/ToastProvider"
import { set } from "date-fns"
import { router, useLocalSearchParams } from "expo-router"
import { invoke } from "lib/axios"
import React, { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Animated,
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { BallIndicator } from "react-native-indicators"
import { HStack, VStack } from "@react-native-material/core"
import { COLORS, FONTSFAMILIES } from "../../../../../src/color/VariableColors"

function PurchaseStatus() {
  const { orderId } = useLocalSearchParams()
  const { status, isLoading, isCompleted, transaction, checkStatus } =
    useCheckStatus(orderId)
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
          spacing={37}
          style={{
            width: "85%",
          }}
        >
          <VStack
            spacing={20}
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* <Animated.Image
              source={require("../../../../assets/Fonts/arcticons_ticktick.png")}
              style={{ height: 50, width: 50 }}
            /> */}
            {isLoading && (
              <View className='h-12'>
                <BallIndicator color='#ED3F62' count={9} />
              </View>
            )}
            {/* <Text style={styles.successTitle}>Payment Complete</Text> */}
            <Text style={styles.successTitle}>{status}</Text>
          </VStack>

          <VStack
            spacing={30}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Text style={styles.successSubText}>
              Your payment has been recieved. Thank you, for making a donation
              into our projects. if you have any inquires you can contact us on{" "}
              <Text style={styles.successEmail}>name@nyatifilms.com</Text>
            </Text>
          </VStack>

          <VStack>
            <Text style={styles.formTitle}>Payment Details</Text>
            {/** divider */}
            <View style={styles.horizontalLine} />
            <VStack spacing={15} style={{ marginVertical: 20 }}>
              <HStack style={{ justifyContent: "space-between" }}>
                <Text style={styles.paydetailTitle}>Receipt Code</Text>
                <Text style={styles.paydetailTxt}>892774</Text>
              </HStack>
              <HStack style={{ justifyContent: "space-between" }}>
                <Text style={styles.paydetailTitle}>Payment Date</Text>
                <Text style={styles.paydetailTxt}>03 Jan, 2024, 09:00</Text>
              </HStack>
              <HStack style={{ justifyContent: "space-between" }}>
                <Text style={styles.paydetailTitle}>Payment Type</Text>
                <Text style={styles.paydetailTxt}>Airtel Money</Text>
              </HStack>
              <HStack style={{ justifyContent: "space-between" }}>
                <Text style={styles.paydetailTitle}>Phone Number</Text>
                <Text style={styles.paydetailTxt}>+25670000000</Text>
              </HStack>
            </VStack>
          </VStack>

          <Button
            title='Check Status'
            onPress={checkStatus}
            style={{ width: "100%", backgroundColor: COLORS.formBtnBg }}
          />

          {/** form buttons */}
          {/* <VStack
            spacing={20}
            style={{ alignItems: "center", marginTop: "20%" }}
          >
            {isSubmittingp ? (
              <View style={styles.formBtn}>
                <ActivityIndicator size='small' color='white' />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.formBtn}
                onPress={() => setIsSubmittingp(() => true)}
              >
                <Text style={styles.formBtnText}>Close</Text>
              </TouchableOpacity>
            )}
          </VStack> */}
        </VStack>
      </Animated.View>
      {/* <Modal
        transparent={true}
        visible={isSubmittingp ? true : false}
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
      </Modal> */}
    </View>
  )
}

function StatusBlock({ status }) {
  switch (status) {
    case "PENDING":
      return (
        <View className=''>
          {/* <Animated.Image
              source={require("../../../../assets/Fonts/arcticons_ticktick.png")}
              style={{ height: 50, width: 50 }}
            /> */}
          <Text style={styles.successTitle}>Payment Complete</Text>
          <Text style={styles.successTitle}>{status}</Text>
        </View>
      )
  }
}

function useCheckStatus(orderTrackingId) {
  const { showToast } = useToast()
  const [status, setStatus] = useState("PENDING")
  const [transaction, setTransaction] = useState(null)
  const [timerCount, setTimerCount] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)

  const checkStatus = useCallback(async () => {
    if (!orderTrackingId) {
      setStatus("FAILED")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await invoke({
        endpoint: `/film/checkpaymentstatus/${orderTrackingId}`,
      })

      if (response.error) {
        throw new Error(response.error)
      }

      switch (response.res.status) {
        case "SUCCESSFUL":
          if (response.res?.transaction?.id) {
            setTransaction(response.res.transaction)
          }
          setStatus("SUCCESSFUL")
          setIsCompleted(true)
          break
        case "FAILED":
          setStatus("FAILED")

          // clear the timer
          break
        case "TIMEOUT":
          setStatus("FAILED")
          break
        default:
          setStatus("PENDING")
          break
      }
    } catch (error) {
      console.log(error)
      setStatus("FAILED")
      showToast({
        type: "error",
        message: "An error occurred. Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }, [orderTrackingId])

  useEffect(() => {
    if (!orderTrackingId) {
      setStatus("FAILED")
      setIsLoading(false)
      return
    }

    // checkStatus()

    // if (timerCount <= 5) {
    //   const timer = setInterval(() => {
    //     setTimerCount((prev) => prev + 1)
    //     checkStatus()
    //   }, 10000) // check status every 10 seconds
    //   return () => clearInterval(timer)
    // }
  }, [timerCount, status, checkStatus])

  return { status, isLoading, isCompleted, transaction, checkStatus }
}

export default PurchaseStatus

const styles = StyleSheet.create({
  successTitle: {
    color: "#06CC6B",
    fontFamily: "Inter-SemiBold",
    fontSize: 25,

    letterSpacing: -0.5,
  },
  successSubText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#d0cbca",
    textAlign: "center",
  },
  successEmail: {
    color: COLORS.formSubTitle,
    fontFamily: "Inter-ExtraBold",
  },
  formTitle: {
    color: COLORS.formTitle,
    fontFamily: FONTSFAMILIES.formTitlefont,
    fontSize: 20,

    letterSpacing: -0.54,
  },
  horizontalLine: {
    borderBottomColor: "#EE5170",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  paydetailTitle: {
    color: "#FFFAF6",
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
  },
  paydetailTxt: {
    color: "#FFFAF6",
    fontFamily: "Inter-Regular",
    fontSize: 16,
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
