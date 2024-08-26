import { router } from "expo-router"
import React from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { useFormik } from "formik"
import * as yup from "yup"
import { useAuth } from "../../../../context/AuthProvider"
import { useToast } from "../../../../context/ToastProvider"
import useDisclosure from "../../../../hooks/useDisclosure"
import { invoke } from "../../../../lib/axios"
import PageLayoutWrapper from "../../../../src/components/PageLayoutWrapper"
import PasswordInputField from "../../../../src/components/PasswordInputField"
import TopNav from "../../../../src/components/TopNav"

//validation schema
const validationSchema = yup.object().shape({
  currentPassword: yup.string().required("Current Password is required"),
  newPassword: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
})

function ChangePassword() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { isOpen, onToggle } = useDisclosure()

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    isValid,
  } = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, hp) => {
      try {
        hp.setSubmitting(true)

        const details = {
          //   currentPassword: values.currentPassword,
          password: values.newPassword,
        }

        const response = await invoke({
          method: "PUT",
          endpoint: `/user/${user.id}`,
          data: details,
        })

        if (response.error) {
          throw new Error(response.error)
        }
        // Figure out if we need to update the user cookie, or logout the user and ask them to login again
        showToast({
          type: "success",
          message: "Successfully saved",
        })
        setTimeout(() => {
          router.back()
        }, 1000)
      } catch (error) {
        console.log("Error", error)
        showToast({
          type: "danger",
          message: error.message,
        })
      } finally {
        hp.setSubmitting(false)
      }
    },
  })

  return (
    <PageLayoutWrapper>
      <View className='space-y-4 w-full flex flex-col justify-between'>
        <View className='space-y-6'>
          <TopNav title='Change Password' hideMenu={true} />

          <View className='h-auto w-full space-y-4'>
            <Text className='text-white text-base'>
              Protect your account with a unique password atleast 6 characters
              long.
            </Text>
          </View>

          <View className='w-full space-y-8'>
            <PasswordInputField
              label='Current Password'
              value={values.currentPassword}
              error={errors.currentPassword}
              touched={touched.currentPassword}
              onBlur={handleBlur("currentPassword")}
              onChangeText={handleChange("currentPassword")}
            />
            <PasswordInputField
              label='New Password'
              value={values.newPassword}
              error={errors.newPassword}
              touched={touched.newPassword}
              onBlur={handleBlur("newPassword")}
              onChangeText={handleChange("newPassword")}
            />
            <PasswordInputField
              label='Confirm Password'
              value={values.confirmPassword}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              onBlur={handleBlur("confirmPassword")}
              onChangeText={handleChange("confirmPassword")}
            />
          </View>
        </View>

        <View className='flex flex-col items-center justify-center gap-y-6 pt-36'>
          <TouchableOpacity
            disabled={isSubmitting || !isValid}
            onPress={() => handleSubmit()}
            className='w-full rounded-full bg-primary-500 h-12 flex items-center justify-center px-4'
            style={{
              opacity: isSubmitting || !isValid ? 0.5 : 1,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator size='small' color='white' />
            ) : (
              <Text className='text-white text-lg text-sans font-semibold'>
                Save
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            className='w-fit h-fit flex items-center justify-center px-4'
          >
            <Text className='text-primary-500 text-lg text-sans font-semibold'>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </PageLayoutWrapper>
  )
}

export default ChangePassword
