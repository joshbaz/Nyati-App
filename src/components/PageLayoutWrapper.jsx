import React from "react"
import { ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../color/VariableColors"

function PageLayoutWrapper({ children }) {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.generalBg,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            marginTop: 0,
            paddingHorizontal: 20,
          }}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default PageLayoutWrapper
