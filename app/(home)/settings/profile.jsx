import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useFormik } from "formik"
import * as yup from "yup"
import { useAuth } from "../../../context/AuthProvider"
import { useToast } from "../../../context/ToastProvider"
import { invoke } from "../../../lib/axios"
import { COLORS, FONTSFAMILIES } from "../../../src/color/VariableColors"
import Avatar from "../../../src/components/Avatar"
import PageLayoutWrapper from "../../../src/components/PageLayoutWrapper"
import TopNav from "../../../src/components/TopNav"

//validation schema
const validationSchema = yup.object().shape({
  contact: yup
    .string()
    .test("is-email-or-phone", "Invalid email or phone", (value) => {
      // phone number regex with the country code
      const phoneRegex = /^(\+|00)[1-9][0-9 \-\(\)\.]{7,32}$/
      const isEmail = yup.string().email().isValidSync(value)
      const isPhone = phoneRegex.test(value)
      return isEmail || isPhone
    })
    .required("Number or Email is required"),
  fullname: yup.string().required("Your fullname is required"),
  username: yup.string().required("Please enter a username"),
  isEmail: yup.boolean().when("contact", {
    is: (contact) => contact && yup.string().email().isValidSync(contact),
    then: (schema) => schema.default(true),
    otherwise: (schema) => schema.default(false),
  }),
})

function Profile() {
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()
  const params = useLocalSearchParams()

  const {
    values,
    isSubmitting,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      username: user.username,
      fullname: `${user.firstname} ${user.lastname}` || "",
      contact: user.email || user.phoneNumber,
      isEmail: user.email ? true : false,
    },
    validationSchema,
    onSubmit: async (values, hp) => {
      if (!params.edit) return // if not in edit mode, return
      try {
        hp.setSubmitting(true)
        const details = {
          username: values.username,
          firstname: values.fullname.split(" ")[0],
          lastname: values.fullname.split(" ")[1],
          email: values.isEmail ? values.contact : "",
          phoneNumber: values.isEmail ? "" : values.contact,
        }

        const response = await invoke({
          method: "PUT",
          endpoint: `/user/${user.id}`,
          data: details,
        })

        if (response.error) {
          throw new Error(response.error)
        }
        updateUser(response.res.user)
        showToast({
          type: "success",
          message: "Successfully saved",
        })
        router.setParams({ edit: false })
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
  const shouldEdit = params?.edit === "true"

  return (
    <PageLayoutWrapper>
      <View className='space-y-4 w-full flex flex-col justify-between'>
        <View className='space-y-6'>
          <TopNav title='Profile Settings' hideMenu={true} />
          <View className='w-full h-36 flex items-center justify-center'>
            <Avatar hideInfo={true} size='2xl' />
          </View>

          <View className='h-auto w-full space-y-4'>
            <View className='space-y-3'>
              <Text style={styles.formLabel}>Username</Text>
              <TextInput
                editable={shouldEdit}
                style={{
                  ...styles.formInputs,
                  borderColor:
                    params?.edit === "true"
                      ? COLORS.formBtnBg
                      : COLORS.formBorder,
                }}
                enablesReturnKeyAutomatically
                keyboardAppearance='dark'
                value={values.username}
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
              />
              {errors.username && touched.username ? (
                <Text style={{ color: COLORS.formBtnBg }}>
                  {errors.username}
                </Text>
              ) : null}
            </View>
            <View className='space-y-3'>
              <Text style={styles.formLabel}>Mobile Number or Email</Text>
              <TextInput
                editable={shouldEdit}
                style={{
                  ...styles.formInputs,
                  borderColor: shouldEdit
                    ? COLORS.formBtnBg
                    : COLORS.formBorder,
                }}
                enablesReturnKeyAutomatically
                keyboardAppearance='dark'
                value={values.contact}
                onChangeText={handleChange("contact")}
                onBlur={handleBlur("contact")}
              />
              {errors.contact && touched.contact ? (
                <Text className='text-primary-500'>{errors.contact}</Text>
              ) : null}
            </View>
            <View className='space-y-3'>
              <Text style={styles.formLabel}>Full Name</Text>
              <TextInput
                editable={shouldEdit}
                style={{
                  ...styles.formInputs,
                  borderColor: shouldEdit
                    ? COLORS.formBtnBg
                    : COLORS.formBorder,
                }}
                enablesReturnKeyAutomatically
                keyboardAppearance='dark'
                value={values.fullname}
                onChangeText={handleChange("fullname")}
                onBlur={handleBlur("fullname")}
              />
              {errors.fullname && touched.fullname ? (
                <Text className='text-primary-500'>{errors.fullname}</Text>
              ) : null}
            </View>
          </View>
          {shouldEdit ? null : (
            <View>
              <TouchableOpacity
                onPress={() => router.setParams({ edit: true })}
                className='w-full rounded-md border border-gray-300 h-12 flex items-center justify-center px-4 mt-6'
              >
                <Text className='text-white text-lg text-sans'>
                  Edit Details
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {shouldEdit ? (
          <View className='flex flex-col items-center justify-center gap-y-6 pt-24'>
            <TouchableOpacity
              onPress={() => handleSubmit()}
              className='w-full rounded-full bg-primary-500 h-12 flex items-center justify-center px-4'
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
              onPress={() => router.setParams({ edit: false })}
              className='w-fit h-fit flex items-center justify-center px-4'
            >
              <Text className='text-primary-500 text-lg text-sans font-semibold'>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </PageLayoutWrapper>
  )
}

const styles = StyleSheet.create({
  formTitle: {
    color: COLORS.formTitle,
    fontFamily: FONTSFAMILIES.formTitlefont,
    fontSize: 27,
    lineHeight: 36,
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
    borderBottomColor: COLORS.formLinks,
    borderBottomWidth: 1,
  },
  formLabel: {
    fontFamily: FONTSFAMILIES.formLabel,
    color: COLORS.formLabel,
    fontSize: 14,
    lineHeight: 22,
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
    fontSize: 16,
  },
  passwordContainer: {
    height: 48,
    backgroundColor: COLORS.formBg,
    borderRadius: 6,
    borderColor: COLORS.formBorder,
    borderWidth: 1,
  },
  passwordInput: {
    width: "89%",
    paddingLeft: 10,
    color: COLORS.formText,
  },
  passwordIcon: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "transparent",
    width: "11%",
    color: COLORS.formText,
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

export default Profile
