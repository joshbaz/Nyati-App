import { StyleSheet, Text, View, Animated, Modal } from "react-native"
import React, { useEffect } from "react"
import { VStack } from "@react-native-material/core"
import { COLORS } from "../../src/color/VariableColors"
import { BallIndicator } from "react-native-indicators"

const RegisterSuccess = ({ navigation }) => {
   const [isSubmittingp, setIsSubmittingp] = React.useState(false)

   useEffect(() => {
      if (isSubmittingp) {
         setTimeout(() => {
            setIsSubmittingp(() => false)
            navigation.navigate("Signin")
         }, 5000)
      } else {
         setTimeout(() => {
            setIsSubmittingp(() => true)
         }, 2000)
      }
   }, [isSubmittingp])
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

                  <Text style={styles.successSubText}>
                     A confirmation email has been sent to{" "}
                     <Text style={styles.successEmail}>email@gmail.com</Text>
                  </Text>
               </VStack>
            </VStack>
         </Animated.View>
         <Modal
            transparent={true}
            visible={isSubmittingp ? true : false}
            animationType='slide'
            style={{
               position: "absolute",
               top: 0,
               bottom: 0,
               left: 0,
               right: 0,
            }}
         >
            <View
               style={[
                  {
                     flex: 1,
                     alignItems: "center",
                     justifyContent: "space-around",
                     backgroundColor: "rgba(21, 21, 21, 0.6)",
                  },
               ]}
            >
               <Animated.View
                  style={{
                     position: "relative",
                     width: 50,
                     height: 50,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                  }}
               >
                  <BallIndicator color='#ED3F62' count={9} />
               </Animated.View>
            </View>
         </Modal>
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
