import {
   Text,
   View,
   Animated,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
} from "react-native"
import React from "react"
import { HStack, VStack } from "@react-native-material/core"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS, FONTSFAMILIES } from "../../color/VariableColors"

const LandingPage = ({ navigation }) => {
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
         <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
               contentContainerStyle={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "center",

                  width: "100%",
                  backgroundColor: COLORS.generalBg,
                  marginTop: 0,
                  paddingVertical: 100,
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
                     spacing={30}
                     style={{
                        width: "85%",
                     }}
                  >
                     {/** form -Titles & subtitle */}
                     <VStack
                        spacing={20}
                        style={{
                           alignItems: "end",
                        }}
                     >
                        <VStack>
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
                              Stream Originals like Fate, Fair Play and many
                              more.
                           </Text>
                        </VStack>
                        <VStack spacing={6} style={{ width: "100%", gap: 6 }}>
                           <TouchableOpacity
                              style={styles.formBtn}
                              onPress={() => navigation.navigate("Signin")}
                           >
                              <Text style={styles.formBtnText}>Sign In</Text>
                           </TouchableOpacity>
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
                              <TouchableOpacity
                                 style={styles.formBtnLink}
                                 onPress={() => navigation.navigate("Signin")}
                              >
                                 <Text style={styles.formLinks}>Sign Up</Text>
                              </TouchableOpacity>
                           </HStack>
                           <Text
                              style={{
                                 ...styles.formSubtitle,
                                 fontSize: 14,
                              }}
                           >
                              By creating an account or signing in, you agree to
                              our terms of Service and Privacy Policy.
                           </Text>
                        </VStack>
                     </VStack>
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
   formBtnLink: {
      borderBottomColor: COLORS.formLinks,
      borderBottomWidth: 1,
   },
   formLabel: {
      fontFamily: FONTSFAMILIES.formLabel,
      color: COLORS.formLabel,
      fontSize: 14,
      lineHeight: 22,
      letterSpacing: -0.28,
   },
   formInputs: {
      height: 48,
      backgroundColor: COLORS.formBg,
      borderRadius: 6,
      borderColor: COLORS.formBorder,
      borderWidth: 1,
      color: COLORS.formText,
      paddingLeft: 10,
      paddingRight: 10,
   },
   passwordContainer: {
      height: 48,
      backgroundColor: COLORS.formBg,
      borderRadius: 6,
      borderColor: COLORS.formBorder,
      borderWidth: 1,
   },
   passwordInput: {
      width: "89%",
      paddingLeft: 10,
      color: COLORS.formText,
   },
   passwordIcon: {
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      backgroundColor: "transparent",
      width: "11%",
      color: COLORS.formText,
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
})
