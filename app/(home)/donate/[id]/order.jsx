import { COLORS } from "@/color/VariableColors"
import { useAuth } from "context/AuthProvider"
import { router, useLocalSearchParams } from "expo-router"
import qs from "query-string"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { WebView } from "react-native-webview"

function Order() {
  const { user, userToken } = useAuth()
  const params = useLocalSearchParams()

  const querystring = qs.stringify(
    {
      token: userToken,
      ...params,
      id: "",
    },
    { skipNull: true, skipEmptyString: true },
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.generalBg }}>
      <WebView
        style={{ flex: 1 }}
        source={{
          uri: `http://localhost:5173/donate/process/${user?.id}/${params.id}?${querystring}`,
        }}
        onMessage={(event) => {
          const message = event.nativeEvent.data

          if (!message) return

          switch (message) {
            case "donationclose":
            case "donationRetry":
              router.replace(`/(home)/donate/${params.id}`)
              break
            case "donationcancel":
              router.push(`/(home)/donate`)
              break
            default:
              router.push(`/(home)`)
              break
          }
        }}
      />
    </SafeAreaView>
  )
}

export default Order
