import LinearGradient from "expo-linear-gradient"

import React, { useEffect } from "react"
import { LayoutAnimation, Platform, StyleSheet, View } from "react-native"
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder"

import { COLORS } from "../color/VariableColors"

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

function Loader({ isLoading, children }) {
  useEffect(() => {
    if (Platform.OS === "android") {
      LayoutAnimation.Presets.linear.duration = 1000 // Adjust animation duration for Android
    }
  }, [])

  const renderSkeleton = () => (
    <View style={styles.container}>
      <View style={styles.imageSkeleton} />
      <View style={styles.textSkeletonWide} />
      <View style={styles.textSkeleton} />
      <View style={styles.textSkeletonNarrow} />
      <View
        style={{
          width: "100%",
          marginTop: 20,
        }}
      >
        <View style={styles.textSkeletonBtn} />
      </View>
    </View>
  )

  const renderContent = () => children

  return isLoading ? renderSkeleton() : renderContent()
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: COLORS.generalBg,
    padding: 20,
    paddingTop: 70,
    gap: 10,
  },
  imageSkeleton: {
    width: "100%",
    height: 300,
    backgroundColor: COLORS.formBg,
    marginBottom: 10,
    borderRadius: 10,
    // Add shimmer animation if desired
  },
  textSkeleton: {
    width: 150,
    height: 15,
    backgroundColor: COLORS.formBg,
    marginBottom: 5,
    borderRadius: 5,
  },
  textSkeletonWide: {
    width: 300,
    height: 20,
    backgroundColor: COLORS.formBg,
    marginBottom: 5,
    borderRadius: 5,
  },
  textSkeletonNarrow: {
    width: 100,
    height: 15,
    backgroundColor: COLORS.formBg,
    borderRadius: 5,
  },
  textSkeletonBtn: {
    width: "100%",
    height: 50,
    borderRadius: 100,
    backgroundColor: COLORS.formBg,
  },
  // ... other styles for your actual content
})

export default Loader
