import { COLORS } from "@/color/VariableColors"
import React from "react"
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  View,
} from "react-native"

/**
 * A custom button component styled for consistent usage.
 *
 * @typedef {Object} CustomBtnProps
 * @property {boolean} isValid - Determines if the button is valid (enabled or disabled state).
 * @property {boolean} isLoading - Determines if the loading indicator should be shown.
 * @property {React.ReactNode} children - The content to display inside the button.
 **/

/**
 * @typedef {PressableProps & CustomBtnProps} ExtendedPressableProps
 */

/**
 * @name CustomBtn
 * @description A custom button component styled for consistent usage.
 * @param {ExtendedPressableProps} props
 * @returns {React.ReactElement}
 */
function CustomBtn({ children, invalid, isLoading, ...props }) {
  return (
    <Pressable
      className='flex items-center justify-center h-12 rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 px-6 w-full'
      style={{
        opacity: invalid ? 0.5 : 1,
        backgroundColor: COLORS.formBtnBg,
        cursor: invalid ? "not-allowed" : "pointer",
      }}
      {...props}
    >
      <View className='flex flex-row'>
        {isLoading && <ActivityIndicator size='small' color='white' />}
        <Text className='text-white text-lg ml-3'>{children}</Text>
      </View>
    </Pressable>
  )
}

export default CustomBtn
