import React, { useMemo } from "react"
import { View } from "react-native"

function OtpInput({ inputLength, onChange, value }) {
  const [otpString, setOtpString] = React.useState(value)

  const inputs = useMemo(() => {
    const inputs = []

    Array.from({ length: inputLength }).forEach((_, i) => {
      inputs.push(
        <View key={i}>
          <View>{otpString[i] || ""}</View>
        </View>,
      )
    })

    return inputs
  })

  return <View className='flex flex-row gap-x-2'>{inputs}</View>
}

export default OtpInput
