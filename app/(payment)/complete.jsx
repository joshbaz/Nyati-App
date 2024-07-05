import {
   StyleSheet,
   Text,
   View,
   Animated,
   TouchableOpacity,
   ActivityIndicator,
   Modal,
} from "react-native"
import React, { useEffect } from "react"
import { HStack, VStack } from "@react-native-material/core"

import { COLORS, FONTSFAMILIES } from "../../src/color/VariableColors"
import { BallIndicator } from "react-native-indicators"

const PaymentComplete = ({ navigation }) => {
   const [isSubmittingp, setIsSubmittingp] = React.useState(false)

   useEffect(() => {
      if (isSubmittingp) {
         setTimeout(() => {
            setIsSubmittingp(() => false)
            navigation.navigate("Home")
         }, 5000)
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
                  <Text style={styles.successTitle}>Payment Complete</Text>
               </VStack>

               <VStack
                  spacing={30}
                  style={{ display: "flex", alignItems: "center" }}
               >
                  <Text style={styles.successSubText}>
                     Your payment has been recieved. Thank you, for making a
                     donation into our projects. if you have any inquires you
                     can contact us on{" "}
                     <Text style={styles.successEmail}>
                        name@nyatifilms.com
                     </Text>
                  </Text>
               </VStack>

               <VStack>
                  <Text style={styles.formTitle}>Payment Details</Text>
                  {/** divider */}
                  <View style={styles.horizontalLine} />
                  <VStack spacing={15} style={{ marginVertical: 20 }}>
                     <HStack style={{ justifyContent: "space-between" }}>
                        <Text style={styles.paydetailTitle}>Receipt Code</Text>
                        <Text style={styles.paydetailTxt}>892774</Text>
                     </HStack>
                     <HStack style={{ justifyContent: "space-between" }}>
                        <Text style={styles.paydetailTitle}>Payment Date</Text>
                        <Text style={styles.paydetailTxt}>
                           03 Jan, 2024, 09:00
                        </Text>
                     </HStack>
                     <HStack style={{ justifyContent: "space-between" }}>
                        <Text style={styles.paydetailTitle}>Payment Type</Text>
                        <Text style={styles.paydetailTxt}>Airtel Money</Text>
                     </HStack>
                     <HStack style={{ justifyContent: "space-between" }}>
                        <Text style={styles.paydetailTitle}>Phone Number</Text>
                        <Text style={styles.paydetailTxt}>+25670000000</Text>
                     </HStack>
                  </VStack>
               </VStack>

               {/** form buttons */}
               <VStack
                  spacing={20}
                  style={{ alignItems: "center", marginTop: "20%" }}
               >
                  {isSubmittingp ? (
                     <View style={styles.formBtn}>
                        <ActivityIndicator size='small' color='white' />
                     </View>
                  ) : (
                     <TouchableOpacity
                        style={styles.formBtn}
                        onPress={() => setIsSubmittingp(() => true)}
                     >
                        <Text style={styles.formBtnText}>Close</Text>
                     </TouchableOpacity>
                  )}
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

export default PaymentComplete

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
      fontFamily: "Inter-ExtraBold",
   },
   formTitle: {
      color: COLORS.formTitle,
      fontFamily: FONTSFAMILIES.formTitlefont,
      fontSize: 20,

      letterSpacing: -0.54,
   },
   horizontalLine: {
      borderBottomColor: "#EE5170",
      borderBottomWidth: 1,
      marginVertical: 20,
   },
   paydetailTitle: {
      color: "#FFFAF6",
      fontFamily: "Inter-SemiBold",
      fontSize: 16,
   },
   paydetailTxt: {
      color: "#FFFAF6",
      fontFamily: "Inter-Regular",
      fontSize: 16,
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
