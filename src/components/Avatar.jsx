import React from "react"
import { Text, View } from "react-native"

import { useAuth } from "../../context/AuthProvider"
import { COLORS } from "../../src/color/VariableColors"

function Avatar({ hideInfo }) {
  const { user } = useAuth()
  console.log("Avatar user", user)
  const formatName = () => {
    const { firstname, lastname } = user
    const [firstLetter, ...rest] = firstname
    const [lastLetter, ...rest2] = lastname
    if (firstLetter && lastLetter) {
      return `${firstLetter.toUpperCase()}${lastLetter.toUpperCase()}`
    }
    return ""
  }
  return (
    <View className='flex flex-row gap-x-3 items-center  px-5'>
      <View
        className='w-14 h-14 rounded-full flex justify-center items-center'
        style={{ backgroundColor: COLORS.formBtnBg }}
      >
        <Text className='text-white text-2xl font-bold'>{formatName()}</Text>
      </View>
      {hideInfo ? null : (
        <View className='flex flex-col'>
          <Text className='text-white font-semibold text-xl text-sans'>
            Hi, {user.firstname}
          </Text>
          <Text className='text-gray-400 text-base text-sans '>
            you can partner with us today ...
          </Text>
        </View>
      )}
    </View>
  )
}

export default Avatar
