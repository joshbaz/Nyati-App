import { LinearGradient } from "expo-linear-gradient"
import { Link, useNavigation } from "expo-router"

import React, { useEffect } from "react"
import {
  Animated,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { HStack, VStack } from "@react-native-material/core"

import { COLORS, FONTSFAMILIES } from "../src/color/VariableColors"
import { useAuth } from "../src/context/AuthProvider"

const LandingPage = () => {
  const navigation = useNavigation()
  const [sizeImage] = React.useState({
    width: 199,
    height: 199,
  })

  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate("(home)")
    }
  }, [isAuthenticated])

  return (
    <View>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1720065527129-e50696c384a9?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        <LinearGradient
          colors={["#66000000", COLORS.generalBg, COLORS.generalBg]}
          style={{ flex: 1, width: "100%" }}
        >
          <SafeAreaView style={{ flex: 1 }}>
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
                {/* <Image
              source={{
                uri: "https://images.unsplash.com/photo-1720065527129-e50696c384a9?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            /> */}

                <VStack
                  spacing={30}
                  style={{
                    width: "100%",
                    paddingHorizontal: 20,
                    justifyContent: "center",
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
                      spacing={20}
                      style={{
                        alignItems: "end",
                      }}
                    >
                      <VStack spacing={20}>
                        <Text style={styles.formTitle}>
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
                          width: "100%",
                          gap: 6,
                        }}
                      >
                        <View>
                          <Link href='/signin' style={styles.formBtn}>
                            <Text style={styles.formBtnText}>Sign In</Text>
                          </Link>
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
                          <Link href='/register' style={styles.formLinks}>
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
        </LinearGradient>
      </ImageBackground>
    </View>
  )
}

export default LandingPage

const styles = StyleSheet.create({
  formTitle: {
    color: COLORS.formTitle,
    fontFamily: FONTSFAMILIES.formTitlefont,
    fontSize: 33,
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
    width: "100%",
  },
})
