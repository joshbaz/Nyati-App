import { COLORS } from "@/color/VariableColors"
import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { WebView } from "react-native-webview"

function OrderPesapal() {
  const params = useLocalSearchParams()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.generalBg }}>
      <WebView
        style={{ flex: 1 }}
        source={{
          uri: params?.redirect_url,
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

export default OrderPesapal
