import CustomBtn from "@/components/CustomBtn"
import PageLayoutWrapper from "@/components/PageLayoutWrapper"
import { useToast } from "context/ToastProvider"
import { router, useLocalSearchParams } from "expo-router"
import { invoke } from "lib/axios"
import { CircleCheckBig, CircleX, Clock2, Clock9 } from "lucide-react-native"
import React, { useCallback, useEffect, useState } from "react"
import { Animated, Text, View } from "react-native"
import { BallIndicator } from "react-native-indicators"

function PurchaseStatus() {
  const params = useLocalSearchParams() // {id, orderId}

  const { status, isLoading, showCheckStatusBtn, checkStatus } = useCheckStatus(
    params.orderId,
  )
  return (
    <PageLayoutWrapper>
      <Animated.View className='h-full py-10'>
        <StatusBlock
          status={status}
          isLoading={isLoading}
          checkStatus={checkStatus}
          showCheckStatusBtn={showCheckStatusBtn}
        />
      </Animated.View>
    </PageLayoutWrapper>
  )
}

/**
 * @typedef {Object} StatusBlockProps
 * @property {string} status - The status of the payment.
 * @property {boolean} isLoading - Determines if the loading indicator should be shown.
 * @property {boolean} showCheckStatusBtn - Determines if the check status button should be shown.
 * @property {() => void} checkStatus - A function to check the status of the payment.
 * */

/**
 * @name StatusBlock
 * @description A component that displays the status of the payment.
 * @param {StatusBlockProps} props
 * @returns {React.ReactElement}
 */

function StatusBlock({ status, isLoading, showCheckStatusBtn, checkStatus }) {
  const { id } = useLocalSearchParams() // {id, orderId}
  switch (status) {
    case "PENDING":
      return (
        <View className='flex items-center justify-center gap-y-24 h-full'>
          <View className='flex items-center justify-center gap-y-5'>
            <Clock2 size={50} className='text-amber-500' />
            <Text className='font-bold text-amber-500 text-3xl'>
              Payment Pending
            </Text>
          </View>
          <View className='space-y-5'>
            <Text className='text-white text-lg text-center'>
              Hang tight! We're verifying your transaction for {"The film"}
            </Text>
            <Text className='text-white text-lg text-center'>
              Once the payment is complete, you'll be automatically directed to
              the confirmation page.
            </Text>
            <Text className='text-white text-lg text-center'>
              If you have any inquiries, reach out to us at:
              info@nyatimotionpictures.com
            </Text>
          </View>

          <View className='w-full'>
            {isLoading && !showCheckStatusBtn && (
              <View className='h-12'>
                <BallIndicator color='#ED3F62' count={9} />
              </View>
            )}
            {showCheckStatusBtn && (
              <CustomBtn
                disabled={isLoading}
                onPress={checkStatus}
                isLoading={isLoading}
              >
                Check Status
              </CustomBtn>
            )}
          </View>
        </View>
      )
    case "SUCCESSFUL":
      return (
        <View className='flex items-center justify-center gap-y-24 h-full'>
          <View className='flex items-center justify-center gap-y-5'>
            <CircleCheckBig size={50} className='text-green-600' />
            <Text className='font-bold text-green-500 text-3xl'>
              Payment Successful
            </Text>
          </View>

          <View className='space-y-5'>
            <Text className='text-white text-lg text-center'>
              Your payment is confirmed. Enjoy watching Film Title
            </Text>

            <Text className='text-white text-lg text-center'>
              You have 72 hours to view the purchased film. If you have any
              inquiries, reach out to us at:
            </Text>
            <Text className='text-white text-lg text-center font-bold'>
              info@nyatimotionpictures.com
            </Text>
          </View>

          <View className='w-full'>
            <CustomBtn
              onPress={() => {
                // push to the film page
                router.replace(`/(home)/film/${id}`)
              }}
            >
              Continue
            </CustomBtn>
          </View>
        </View>
      )
    case "FAILED":
      return (
        <View className='flex items-center justify-center gap-y-24 h-full'>
          <View className='flex items-center justify-center gap-y-5'>
            <CircleX size={50} className='text-red-500' />
            <Text className='font-bold text-red-500 text-3xl'>
              Payment Failed
            </Text>
          </View>

          <View className='space-y-5'>
            <Text className='text-white text-lg text-center'>
              Your payment failed because you may have insufficient funds.
            </Text>

            <Text className='text-white text-lg text-center'>
              You can try the payment again here. Be sure to top-up the right
              amount before submitting your transfer.
            </Text>
          </View>

          <View className='w-full'>
            <CustomBtn
              onPress={() => {
                router.back()
              }}
            >
              Retry
            </CustomBtn>
          </View>
        </View>
      )
    case "TIMEOUT":
      return (
        <View className='flex items-center justify-center gap-y-24 h-full'>
          <View className='flex items-center justify-center gap-y-5'>
            <Clock9 size={50} className='text-gray-400' />
            <Text className='font-bold text-gray-400 text-3xl'>
              Payment Timed Out
            </Text>
          </View>

          <View className='space-y-5'>
            <Text className='text-white text-lg text-center'>
              It seems your payment didn't go through in time.
            </Text>

            <Text className='text-white text-lg text-center'>
              Please try again to complete your purchase. If the issue persists,
              feel free to contact us at:
            </Text>
            <Text className='text-white text-lg text-center font-bold'>
              info@nyatimotionpictures.com
            </Text>
          </View>

          <View className='w-full'>
            <CustomBtn
              onPress={() => {
                router.back()
              }}
            >
              Retry
            </CustomBtn>
          </View>
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
          break
        case "FAILED":
          setStatus("FAILED")
          break
        case "TIMEOUT":
          setStatus("FAILED")
          break
        default:
          setStatus("PENDING")
          break
      }
    } catch (error) {
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

    // on first render, check the status immediately and then start the timer
    if (timerCount === 1) {
      checkStatus()
    }

    if (timerCount <= 5) {
      const timer = setInterval(() => {
        setTimerCount((prev) => prev + 1)
        checkStatus()
      }, 10000) // check status every 10 seconds
      return () => clearInterval(timer)
    }
  }, [timerCount, status, checkStatus])

  return {
    status,
    isLoading,
    transaction,
    checkStatus,
    showCheckStatusBtn: timerCount <= 5,
  }
}

export default PurchaseStatus
