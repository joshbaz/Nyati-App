import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { VStack } from "@react-native-material/core"
import { COLORS, FONTSFAMILIES } from "../../src/color/VariableColors"

function RegisterSuccess() {
  const localParams = useLocalSearchParams()

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.generalBg,
      }}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            alignItems: "center",
            justifyContent: "space-around",
          },
        ]}
      >
        <VStack
          spacing={37}
          style={{
            width: "85%",
          }}
        >
          <VStack
            spacing={20}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Animated.Image
              source={require("../../assets/Fonts/arcticons_ticktick.png")}
              style={{ height: 50, width: 50 }}
            />
            <Text style={styles.successTitle}>Congratulations</Text>
          </VStack>

          <VStack
            spacing={30}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Text style={styles.successSubText}>
              Thank you, your account has successfully been created
            </Text>

            {localParams.isEmail && (
              <Text style={styles.successSubText}>
                A confirmation email has been sent to{" "}
                <Text style={styles.successEmail}>{localParams.contact}</Text>
              </Text>
            )}
          </VStack>
          <View className='flex flex-row items-center justify-start w-full'>
            <TouchableOpacity
              onPress={() => {
                router.replace({
                  pathname: "/(payment)/plans",
                  params: {
                    userId: localParams.userId,
                  },
                })
              }}
              className='w-full h-12 rounded-full flex items-center justify-center'
              style={{
                backgroundColor: COLORS.formBtnBg,
              }}
            >
              <Text
                className='text-base font-bold'
                style={{
                  fontFamily: FONTSFAMILIES.formBtnText,
                  color: COLORS.formBtnText,
                }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </VStack>
      </Animated.View>
    </View>
  )
}

export default RegisterSuccess

const styles = StyleSheet.create({
  successTitle: {
    color: "#06CC6B",
    fontFamily: "Inter-SemiBold",
    fontSize: 25,

    letterSpacing: -0.5,
  },
  successSubText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#d0cbca",
    textAlign: "center",
  },
  successEmail: {
    color: COLORS.formSubTitle,
  },
})
