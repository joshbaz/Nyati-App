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
          uri: `http://localhost:5173/film/process/${user?.id}/${params.videoId}?${querystring}`,
        }}
        onMessage={(event) => {
          const message = event.nativeEvent.data

          if (!message) return

          switch (message) {
            case "returntofilm":
              router.replace(`/(home)/film/${params.id}`)
              break
            case "failedretry":
              router.back()
              break
            case "failedcancel":
              router.push(`/(home)`)
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
