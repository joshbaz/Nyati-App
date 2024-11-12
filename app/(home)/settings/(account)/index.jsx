import { router } from "expo-router"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../../../context/AuthProvider"
import { Toast, useToast } from "../../../../context/ToastProvider"
import useDisclosure from "../../../../hooks/useDisclosure"
import { invoke } from "../../../../lib/axios"
import { COLORS } from "../../../../src/color/VariableColors"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import TopNav from "../../../../src/components/TopNav"

const { height } = Dimensions.get("window")

function AccountSettings() {
  const { user, logout } = useAuth()
  const { showToast, toast } = useToast()
  const { isOpen, onToggle } = useDisclosure(false)

  const [loading, setLoading] = useState(false)

  const handleAccountDelete = async () => {
    try {
      setLoading(true)

      const response = await invoke({
        method: "DELETE",
        endpoint: `/user/${user.id}`,
      })

      if (response.error) {
        throw new Error(response.error)
      }

      showToast({
        type: "success",
        message: "Account deleted successfully, logging you out...",
      })
      setTimeout(() => {
        logout(user?.id)
      }, 1000)
    } catch (err) {
      showToast({
        type: "error",
        message: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayoutWrapper>
      <View className='space-y-4 h-full '>
        <TopNav title='Account Settings' hideMenu={true} />

        <View
          className='flex flex-col items-center justify-between pb-3'
          style={{
            height: height - 300,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(home)/settings/(account)/change-password",
              })
            }
            className='w-full rounded-lg'
            style={{
              backgroundColor: COLORS.formBg,
            }}
          >
            <View className='w-full p-6 rounded-md flex flex-row items-center justify-between'>
              <View className='flex flex-row items-center'>
                <Ionicons name='lock-closed-outline' size={24} color='white' />
                <View className='ml-4'>
                  <Text className='text-lg font-medium text-sans text-white '>
                    Change Password
                  </Text>
                </View>
              </View>
              <View>
                <Ionicons name='chevron-forward' size={24} color='white' />
              </View>
            </View>
          </TouchableOpacity>
          <Pressable
            onPress={onToggle}
            className='h-12 flex items-center justify-center border border-primary-500 rounded w-full'
          >
            <Text className='text-lg text-primary-500 font-medium'>
              Delete Account
            </Text>
          </Pressable>
        </View>
        <Modal
          transparent={true}
          visible={isOpen}
          animationType='slide'
          style={{
            flex: 1,
            backgroundColor: COLORS.generalBg,
          }}
        >
          <View
            style={{
              flex: 1,
              // alignItems: "center",
              // justifyContent: "center",
              backgroundColor: COLORS.generalOpacity2,
            }}
          >
            <Animated.View
              style={{
                position: "relative",
                width: "100%",
                height: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                marginTop: 70,
              }}
            >
              <View className='h-72 w-full bg-red-100 flex flex-row rounded-md overflow-hidden'>
                <Toast toast={toast} />
                <View className='w-[15%] py-4 flex items-center '>
                  <FontAwesome
                    name='exclamation-circle'
                    size={28}
                    color='red'
                  />
                </View>
                <View className='w-[85%] h-full bg-white p-5 space-y-6'>
                  <View className='space-y-2'>
                    <Text className='text-lg text-black font-semibold'>
                      Please confirm to delete account
                    </Text>
                    <Text className='text-base text-black font-normal'>
                      To delete your account your must press "Confirm" once your
                      account is deleted you will be logged out.
                    </Text>
                  </View>
                  <View className='space-y-4'>
                    <Pressable
                      onPress={handleAccountDelete}
                      className='w-full rounded border-2 border-primary-600 h-12 flex items-center justify-center px-4'
                    >
                      {loading ? (
                        <ActivityIndicator
                          size='small'
                          color={COLORS.formBtnBg}
                        />
                      ) : (
                        <Text className='text-primary-600 text-lg text-sans font-semibold'>
                          Confirm
                        </Text>
                      )}
                    </Pressable>
                    <Pressable
                      onPress={onToggle}
                      className='w-full flex items-center justify-center px-4'
                    >
                      <Text className='text-gray-500 text-base text-sans font-semibold'>
                        Cancel & Go back
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </PageLayoutWrapper>
  )
}

export default AccountSettings
