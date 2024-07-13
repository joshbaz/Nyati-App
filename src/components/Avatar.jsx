import React from "react"
import { Text, View } from "react-native"
import { useAuth } from "../../context/AuthProvider"
import { COLORS } from "../../src/color/VariableColors"

function Avatar({ hideInfo, isSmall }) {
  const { user } = useAuth()
  const formatName = () => {
    if (!user) return ""
    const [firstLetter, ...rest] = user?.firstname
    const [lastLetter, ...rest2] = user?.lastname
    if (firstLetter && lastLetter) {
      return `${firstLetter.toUpperCase()}${lastLetter.toUpperCase()}`
    }
    return ""
  }

  if (!user) return null
  return (
    <View
      className={`flex flex-row gap-x-3 items-center ${hideInfo ? "px-0" : "px-5"}`}
    >
      <View
        className={`rounded-full flex justify-center items-center ${isSmall ? "w-12 h-12" : "w-14 h-14"}`}
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
