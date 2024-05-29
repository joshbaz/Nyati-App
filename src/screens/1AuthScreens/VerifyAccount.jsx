import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Stack, Box, HStack, VStack } from "@react-native-material/core";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTSFAMILIES } from "../../color/VariableColors";
import { Formik } from "formik";
import * as yup from "yup";
import { BallIndicator } from "react-native-indicators";

const VerifyAccount = ({ navigation }) => {
  const otp0 = React.useRef(null);
  const otp1 = React.useRef(null);
  const otp2 = React.useRef(null);
  const otp3 = React.useRef(null);
    const [otpnum, setOtpNum] = React.useState(["", "", "", ""]);
     const [phoneToVerify, setPhoneToVerify] = React.useState("");
    const [isSubmittingResend, setIsSubmittingResend] = React.useState(false);
     const [isSubmittingp, setIsSubmittingp] = React.useState(false);

  React.useEffect(() => {
    otp0.current.focus();
  }, []);

  const handleInputOtp = (position, value) => {
    let otpArray = [...otpnum];
    otpArray[position] = value;

    setOtpNum(() => otpArray);

    if (position === 0 && otpArray[position] !== "" && value !== "") {
      otp1.current.focus();
    } else if (position === 0 && value == "") {
      otp0.current.focus();
    }
    if (position === 1 && otpArray[position] !== "" && value !== "") {
      otp2.current.focus();
    } else if (position === 1 && value == "") {
      otp0.current.focus();
    }
    if (position === 2 && otpArray[position] !== "" && value !== "") {
      otp3.current.focus();
    } else if (position === 2 && value == "") {
      otp1.current.focus();
    }
    if (position === 3 && value == "") {
      otp2.current.focus();
    }
    };
    
     const handleSubmitOtp = () => {
       if (
         otpnum[0] === "" ||
         otpnum[1] === "" ||
         otpnum[2] === "" ||
         otpnum[3] === ""
       ) {
        //  let toast = Toast.show("Missing opt field", {
        //    duration: Toast.durations.LONG,
        //    position: 80,
        //    backgroundColor: "red",
        //  });

           /** remove functions when implementing back-end */
            setTimeout(() => {
              setIsSubmittingp(() => true);
              
            }, 10);
            setTimeout(() => {
              setIsSubmittingp(() => false);
              navigation.navigate("RegisterSuccess");
            }, 5000);
        //  setTimeout(function hideToast() {
        // //    Toast.hide(toast);
        //  }, 8000);
       } else {
         let OtpString =
           `${otpnum[0]}` + `${otpnum[1]}` + `${otpnum[2]}` + `${otpnum[3]}`;
         let OSplatform = Platform.OS === "ios" ? "IOS" : "Android";
        //  dispatch(
        //    RegistrationVerify({
        //      platform: OSplatform,
        //      otpString: OtpString,
        //      phoneNumber: phoneToVerify,
        //    })
        //  );
         setIsSubmittingp(() => true);
          setTimeout(() => {
            setIsSubmittingp(() => false);
            navigation.navigate("RegisterSuccess");
          }, 5000);
       }
     };

  /** handle resend otp code */
  const handleReSendOTP = () => {
    if (phoneToVerify !== "") {
      setOtpNum(() => ["", "", "", ""]);
      otp0.current.focus();
    //   dispatch(
    //     ReSendOTPApp({
    //       phoneNumber: phoneToVerify,
    //     })
    //   );
      setIsSubmittingResend(() => true);
    }
  };
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

            marginTop: 0,
            paddingVertical: 100,
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
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
                <VStack style={{ display: "flex", alignItems: "center" }}>
                  <HStack spacing={5}>
                    <Text style={styles.formSubtitle}>
                      Code has been sent to j**@gmail.com
                    </Text>
                  </HStack>
                </VStack>

                <VStack w="100%" items="center" spacing={100}>
                  {/** inputs */}
                  <Stack w="100%" items="center" spacing={40}>
                    <Stack w="100%" spacing={0} style={styles.otpContainer}>
                      {[...Array(4)].map((data, index) => {
                        let otpRef;
                        if (index === 0) {
                          otpRef = otp0;
                        }
                        if (index === 1) {
                          otpRef = otp1;
                        }
                        if (index === 2) {
                          otpRef = otp2;
                        }
                        if (index === 3) {
                          otpRef = otp3;
                        }
                        return (
                          <TextInput
                            key={index}
                            ref={otpRef}
                            autoFocus={index === 0 ? true : false}
                            keyboardType={"number-pad"}
                            maxLength={1}
                            keyboardAppearance="dark"
                            style={[styles.otpInputsText]}
                            value={otpnum[index]}
                            onChangeText={(value) =>
                              handleInputOtp(index, value)
                            }
                          />
                        );
                      })}
                    </Stack>

                    {/** resend code */}
                    {/**
                     *   <HStack items="center" spacing={5}>
                      <Text style={styles.noCodeText}>Resend Code in</Text>
                      {isSubmittingResend ? (
                        <View>
                          <ActivityIndicator size="small" color="black" />
                        </View>
                      ) : (
                        <TouchableOpacity onPress={handleReSendOTP}>
                          <Text style={styles.resendText}>Resend Code</Text>
                        </TouchableOpacity>
                      )}
                    </HStack>
                     *
                     *
                     */}

                    <HStack items="center" spacing={5}>
                      <Text style={styles.formSubtitle}>Resend Code in</Text>
                      {isSubmittingResend ? (
                        <View>
                          <ActivityIndicator size="small" color="black" />
                        </View>
                      ) : (
                        <TouchableOpacity>
                          <Text style={styles.formLinks}>56 s</Text>
                        </TouchableOpacity>
                      )}
                    </HStack>
                  </Stack>

                  {/** button & signup */}
                  <VStack w='100%' spacing={20} style={{ alignItems: "center" }}>
                    {isSubmittingp ? (
                      <View style={styles.formBtn}>
                        <ActivityIndicator size="small" color="white" />
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={handleSubmitOtp}
                        style={styles.formBtn}
                      >
                        <Text style={styles.formBtnText}>Continue</Text>
                      </TouchableOpacity>
                    )}
                  </VStack>
                </VStack>
              </VStack>
            </Animated.View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default VerifyAccount;

const styles = StyleSheet.create({
 
  formSubtitle: {
    color: COLORS.formSubTitle,
    fontFamily: FONTSFAMILIES.formSubTitle,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.32,
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    height: 48,
  },
  otpInputsText: {
    fontFamily: FONTSFAMILIES.formBtnText,
    backgroundColor: COLORS.formBg,
    borderRadius: 6,
    borderColor: COLORS.formBorder,
    borderWidth: 1,
    letterSpacing: 0.1,
    fontSize: 20,
    color: COLORS.formText,

    height: "100%",
    width: 70,
    alignItems: "center",
    justifyContent: "center",

    textAlign: "center",
    color: COLORS.formText,
  },
});

