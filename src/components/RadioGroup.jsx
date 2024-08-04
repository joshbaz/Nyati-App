import React, { useEffect, useState } from "react"
import { Pressable, Text, View } from "react-native"
import { RadioButton } from "react-native-paper"
import { COLORS } from "../color/VariableColors"

const SIZES = {
  sm: "w-6 h-6 ",
  md: "w-8 h-8",
  lg: "w-10 h-10",
}

const RadioSizes = {
  sm: "w-3 h-3",
  md: "w-5 h-5",
  lg: "w-7 h-7",
}

/**
 * @typedef {Object} Option
 * @property {string} label
 * @property {string} value
 */

/**
 * @name RadioGroup
 * @description RadioGroup component
 * @param {{options: Option[], onSelect: (value: string)=> void, value: string, initialValue: number}} props
 * @returns
 */
function RadioGroup({
  options,
  onSelect,
  value,
  initialValue,
  children,
  size = "sm",
}) {
  const [selected, setSelected] = useState(() => {
    if (Array.isArray(options)) {
      return value || options[initialValue]?.value
    }
  })

  const handleSelect = (option) => {
    onSelect(option)
    setSelected(option)
  }

  const sizeStyle = SIZES[size]
  const radioSize = RadioSizes[size]

  return (
    <View className='flex flex-col gap-y-3'>
      {options.map((option) => (
        <Pressable
          key={option.label}
          disabled={option.disabled}
          onPress={() => {
            if (!option.disabled) handleSelect(option.value)
          }}
          className={`border-2 p-4 rounded-md flex flex-row items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{
            borderColor:
              selected === option.value ? COLORS.formBtnBg : COLORS.formBorder,
            opacity: option.disabled ? 0.6 : 1,
          }}
        >
          {children(option)}
          <View
            className={`flex flex-row items-center rounded-full justify-center border-2 ${sizeStyle} ${selected === option.value ? "border-pink-600" : "border-gray-400"}`}
          >
            <View
              className={`${radioSize} rounded-full`}
              style={{
                backgroundColor:
                  selected === option.value ? COLORS.formBtnBg : "transparent",
              }}
            ></View>
          </View>
        </Pressable>
      ))}
    </View>
  )
}

export default RadioGroup
