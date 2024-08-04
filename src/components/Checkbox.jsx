import React, { useState } from "react"
import { Pressable } from "react-native"
import { Feather } from "@expo/vector-icons"
import { COLORS } from "../color/VariableColors"

const SIZES = {
  sm: "w-6 h-6 rounded",
  md: "w-8 h-8 rounded-md",
  lg: "w-10 h-10 rounded-lg",
}

/**
 * @name Checkbox
 * @description Checkbox component
 * @param {{
 *  onPress: (checked: boolean) => void,
 *  status: "checked" | "unchecked"
 * }} props
 * @returns {JSX.Element}
 */
function Checkbox({ onPress, status, size = "sm", disabled }) {
  const [checked, setChecked] = useState(status === "checked")
  const sizeStyle = SIZES[size]

  const handlePress = () => {
    setChecked(!checked)
    onPress(checked)
  }

  return (
    <Pressable
      onPress={handlePress}
      className={`flex items-center justify-center border ${sizeStyle} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      style={{
        borderColor: checked ? COLORS.formBtnBg : COLORS.formLabel,
      }}
    >
      {checked ? (
        <Feather
          name='check'
          size={16}
          color={checked ? COLORS.formBtnBg : COLORS.formLabel}
          onPress={() => {
            setChecked(!checked)
            onPress(checked)
          }}
        />
      ) : null}
    </Pressable>
  )
}

export default Checkbox
