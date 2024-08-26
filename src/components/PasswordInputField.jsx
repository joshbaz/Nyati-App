import React from "react"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import useDisclosure from "../../hooks/useDisclosure"
import { COLORS, FONTSFAMILIES } from "../color/VariableColors"

function PasswordInputField({
  value,
  onBlur,
  onChangeText,
  error,
  touched,
  label,
}) {
  const { isOpen: textSecure, onToggle } = useDisclosure(true)

  return (
    <View className='space-y-3 mt-3'>
      <Text style={styles.formLabel}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={textSecure}
          enablesReturnKeyAutomatically
          keyboardAppearance='dark'
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
        />

        <Pressable onPress={onToggle} style={styles.passwordIcon}>
          <Ionicons
            name={textSecure ? "eye-off-outline" : "eye-outline"}
            size={25}
            color={COLORS.formText}
          />
        </Pressable>
      </View>
      {error && touched ? (
        <Text style={{ color: COLORS.formBtnBg }}>{error}</Text>
      ) : null}
    </View>
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
    position: "relative",
  },
  passwordInput: {
    width: "89%",
    paddingLeft: 10,
    color: COLORS.formText,
    height: "100%",
  },
  passwordIcon: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "transparent",
    width: "11%",
    color: COLORS.formText,
    position: "absolute",
    right: 0,
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

export default PasswordInputField
