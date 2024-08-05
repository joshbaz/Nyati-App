import { LinearGradient } from "expo-linear-gradient"
import { Link, Redirect, router } from "expo-router"
import React from "react"
import {
  Animated,
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { HStack, VStack } from "@react-native-material/core"
import { useAuth } from "../context/AuthProvider"
import { COLORS, FONTSFAMILIES } from "../src/color/VariableColors"
import SplashScreen from "../src/components/SplashScreen"

const { width } = Dimensions.get("window")

function LandingPage() {
  const { isAuthenticated, isFetching } = useAuth()

  if (!isAuthenticated && isFetching) {
    //TODO: improve on this
    return <SplashScreen hideLogo={true} />
  }

  if (isAuthenticated && !isFetching) {
    return <Redirect href='/(home)' />
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.generalBg }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={require("../assets/nyati-cover.png")}
          style={{
            width: "100%",
            height: 380,
            resizeMode: "cover",
            position: "absolute",
            top: -70,
            left: 0,
            zIndex: -1,
            transform: [
              {
                rotate: "-6deg",
              },
              {
                scale: 1.2,
              },
            ],
          }}
        >
          <LinearGradient
            colors={[
              COLORS.generalOpacity,
              COLORS.generalOpacity2,
              COLORS.generalBg,
            ]}
            style={{ width: "100%", height: "100%" }}
          ></LinearGradient>
        </ImageBackground>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            width: "100%",
            marginTop: 0,
            paddingVertical: 100,
          }}
        >
          <Animated.View
            style={[
              {
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
              },
            ]}
          >
            <VStack
              spacing={30}
              style={{
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Animated.View
                style={[
                  {
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "100%",
                  },
                ]}
              >
                <VStack
                  spacing={40}
                  style={{
                    alignItems: "flex-end",
                    paddingHorizontal: 20,
                  }}
                >
                  <VStack spacing={10} style={{ width, paddingHorizontal: 20 }}>
                    <Text
                      style={{
                        ...styles.formTitle,
                      }}
                    >
                      Creating Authentic African Stories
                    </Text>
                    <Text
                      style={{
                        ...styles.formSubtitle,
                        maxWidth: 250,
                        margin: "auto",
                      }}
                    >
                      Stream Originals like Fate, Fair Play and many more.
                    </Text>
                  </VStack>
                  <VStack
                    spacing={6}
                    style={{
                      width,
                      gap: 6,
                      paddingHorizontal: 20,
                    }}
                  >
                    <View>
                      <Pressable
                        onPress={() => router.push("/(auth)/signin")}
                        style={styles.formBtn}
                      >
                        <Text style={styles.formBtnText}>Sign In</Text>
                      </Pressable>
                    </View>
                    <HStack
                      style={{
                        width: "100%",
                        alignItems: "center",
                        gap: 3,
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.formSubtitle}>
                        Don&apos;t have an account?
                      </Text>
                      <Link href='/(auth)/register' style={styles.formLinks}>
                        <Text style={styles.formLinks}>Sign Up</Text>
                      </Link>
                    </HStack>
                    <Text
                      style={{
                        ...styles.formSubtitle,
                        fontSize: 14,
                      }}
                    >
                      By creating an account or signing in, you agree to our
                      terms of Service and Privacy Policy.
                    </Text>
                  </VStack>
                </VStack>
              </Animated.View>
            </VStack>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default LandingPage

const styles = StyleSheet.create({
  formTitle: {
    color: COLORS.formTitle,
    fontFamily: FONTSFAMILIES.formTitlefont,
    fontSize: 34,
    lineHeight: 36,
    letterSpacing: -0.54,
    textAlign: "center",
  },
  formSubtitle: {
    color: COLORS.formSubTitle,
    fontFamily: FONTSFAMILIES.formSubTitle,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.32,
    textAlign: "center",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 52,
    borderRadius: 100,
    textAlign: "center",
    textAlignVertical: "center",
  },
  formBtnText: {
    fontFamily: FONTSFAMILIES.formBtnText,
    color: COLORS.formBtnText,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: "bold",
  },
})
