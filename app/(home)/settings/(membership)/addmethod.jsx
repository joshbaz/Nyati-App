import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import { View } from "react-native"
import { useMembership } from "../../../../context/MembershipProvider"
import { useToast } from "../../../../context/ToastProvider"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import PaymentOptions from "../../../../src/components/PaymentOptions"
import TopNav from "../../../../src/components/TopNav"

function AddPaymentMethod() {
  const { showToast } = useToast()
  const params = useLocalSearchParams()
  const { addNewPaymentMethod } = useMembership()

  const handleSubmit = async (values, hp) => {
    try {
      hp.setSubmitting(true)

      const body = {
        ...values,
        name: values.option,
        plan: params.plan || "",
        paymentNumber: values.phoneCode + values.paymentNumber,
      }
      delete body.phoneCode
      addNewPaymentMethod(body)
      router.replace("/(home)/settings/(membership)/payment-methods")
    } catch (e) {
      showToast({
        type: "error",
        message: "An error occurred. Please try again",
      })
    } finally {
      hp.setSubmitting(false)
    }
  }

  return (
    <PageLayoutWrapper>
      <View className='space-y-4 w-full'>
        <TopNav title='Add Payment Method' hideMenu={true} />
        <View className='space-y-8'>
          <PaymentOptions
            onSubmit={handleSubmit}
            initial={{
              saveDetails: true,
            }}
          />
        </View>
      </View>
    </PageLayoutWrapper>
  )
}

export default AddPaymentMethod
