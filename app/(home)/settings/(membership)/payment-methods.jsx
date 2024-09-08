import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { Feather, Ionicons } from "@expo/vector-icons"
import { useMembership } from "../../../../context/MembershipProvider"
import { useToast } from "../../../../context/ToastProvider"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import SplashScreen from "../../../../src/components/SplashScreen"
import TopNav from "../../../../src/components/TopNav"
import { breakParams } from "../../../../src/utils/breakParams"

function PaymentMethod() {
  const { showToast } = useToast()
  const params = useLocalSearchParams()
  const {
    loading,
    savedMethods: methods,
    deletePaymentMethod,
  } = useMembership()

  if (loading && !methods) {
    return <SplashScreen hideLogo={true} />
  }

  return (
    <PageLayoutWrapper>
      <View className='space-y-6 w-full'>
        <TopNav title='Payment Options' hideMenu={true} />
        <View className='space-y-4'>
          {methods?.length > 0 &&
            methods.map((method, idx) => (
              <View
                key={`${method?.label}-${idx}`}
                className='p-5 rounded-md w-full bg-secondary-600 space-y-4'
              >
                <View className='flex flex-row items-center justify-between'>
                  <View className='flex flex-row items-center'>
                    <Image
                      source={{ uri: method?.logo }}
                      className='w-24 h-14 rounded bg-cover'
                    />
                    <View className='ml-3'>
                      <Text className='text-white text-lg'>
                        {method?.details?.paymentNumber
                          ? breakParams(method?.details?.paymentNumber)
                          : null}
                      </Text>
                      {method?.defaultStatus ? (
                        <View className='px-2 w-16 rounded bg-primary-500 flex flex-row items-center justify-center'>
                          <Text className='text-white text-sm'>Default</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <TouchableOpacity
                    disabled={method?.defaultStatus}
                    onPress={() => {
                      if (method?.defaultStatus) {
                        showToast({
                          type: "error",
                          message:
                            "Change your default payment method before deleting",
                        })
                        return
                      }
                      deletePaymentMethod(method?.id)
                    }}
                    className={`w-10 h-10 flex flex-row items-center justify-center ${method?.defaultStatus ? "opacity-30" : "opacity-100"}`}
                  >
                    <Feather name='trash-2' size={24} color='white' />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/(home)/settings/(membership)/[method]",
                      params: { id: method?.id },
                    })
                  }}
                  className='w-full h-12 flex flex-row items-center justify-center border-2 rounded-md border-border'
                >
                  <Text className='text-white text-lg'>Update</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(home)/settings/(membership)/addmethod",
              params: { ...params },
            })
          }
          className='flex flex-row items-center justify-start p-5 bg-secondary-600 rounded-md'
        >
          <Ionicons name='add-circle-outline' size={28} color='white' />
          <Text className='text-white text-lg ml-3 font-medium'>
            Add Payment Method
          </Text>
        </TouchableOpacity>
      </View>
    </PageLayoutWrapper>
  )
}

export default PaymentMethod
