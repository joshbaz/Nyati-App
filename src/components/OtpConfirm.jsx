import React, { useEffect } from "react"
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { OtpInput } from "react-native-otp-entry"
import { COLORS, FONTSFAMILIES } from "../color/VariableColors"

function OtpConfirm({
  timer,
  resendCode,
  isResending,
  onCodeChange,
  handleTimeChange,
}) {
  return (
    <View className='w-full flex flex-col items-center justify-center'>
      <OtpInput
        numberOfDigits={4}
        onTextChange={onCodeChange}
        focusColor={COLORS.formBtnBg}
        blurOnFilled={true}
        theme={{
          pinCodeContainerStyle: {
            width: 70,
            height: 70,
            borderColor: COLORS.formBorder,
            borderRadius: 6,
            backgroundColor: COLORS.formBg,
          },
          pinCodeTextStyle: {
            color: COLORS.formText,
            fontSize: 24,
            fontFamily: FONTSFAMILIES.formBtnText,
          },
        }}
      />

      <View className='flex flex-row items-center' style={{ marginTop: 20 }}>
        <Text className='mr-1' style={styles.formSubtitle}>
          Resend code in
        </Text>
        {isResending ? (
          <View>
            <ActivityIndicator size='small' color={COLORS.formBtnBg} />
          </View>
        ) : (
          <TouchableOpacity
            disabled={timer > 0 || isResending}
            onPress={async () => resendCode()}
          >
            {timer > 0 ? (
              <MemoizedTimer
                time={timer}
                setTime={(time) => handleTimeChange(time)}
              />
            ) : (
              <Text style={styles.formLinks}>resend</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

function Timer({ time, setTime }) {
  // update the timer every second
  useEffect(() => {
    if (time >= 0) {
      const interval = setInterval(() => {
        setTime(time - 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [time])
  return (
    <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.formBtnBg }}>
      {time} s
    </Text>
  )
}

const MemoizedTimer = React.memo(Timer)

export default OtpConfirm

const styles = StyleSheet.create({
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    height: 60,
  },
  otpInputsText: {
    fontFamily: FONTSFAMILIES.formBtnText,
    backgroundColor: COLORS.formBg,
    borderRadius: 6,
    borderColor: COLORS.formBorder,
    borderWidth: 1,
    letterSpacing: 0.1,
    fontSize: 20,
    color: COLORS.formText,

    height: "100%",
    width: 70,
    alignItems: "center",
    justifyContent: "center",

    textAlign: "center",
    color: COLORS.formText,
  },
})
