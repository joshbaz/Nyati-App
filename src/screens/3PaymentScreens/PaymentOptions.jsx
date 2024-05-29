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
  Dimensions,
  FlatList,
  Image,
} from "react-native";

import React, { useEffect, useState, useRef } from "react";
import { Stack, Box, HStack, VStack } from "@react-native-material/core";
import Checkbox from "expo-checkbox";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTSFAMILIES } from "../../color/VariableColors";
import { Formik } from "formik";
import * as yup from "yup";
import { BallIndicator } from "react-native-indicators";
import CategoryHeader from "../../components/CategoryHeader";
const { width, height } = Dimensions.get("window");
import MoviesDB from "../../../assets/data/db.json";
import UpcomingMovieCard from "../../components/UpcomingMovieCard";
import ContinueWatchCard from "../../components/ContinueWatchCard";
import FilmFundCard from "../../components/FilmFundCard";
import FeaturedMovieCard from "../../components/FeaturedMovieCard";
import { Entypo, Octicons } from "@expo/vector-icons";

import MomoPayImage from '../../../assets/MtnMoMo.png'
import AirtelMMImage from '../../../assets/AirtelMoney.png'

const PaymentOptions = ({ navigation }) => {
     const [editedAmount, setEditedAmount] = useState(null);
     const validationSchema = yup.object().shape({
       phoneNumber: yup.string().required("required"),
       payOption: yup.string().required("required"),
       savePayment: yup
         .bool()
         .oneOf([true, false], "Field must be checked"),
      
     });

     const [isSubmittingp, setIsSubmittingp] = React.useState(false);
     useEffect(() => {
       if (isSubmittingp) {
         setTimeout(() => {
           setIsSubmittingp(() => false);
           navigation.navigate("PaymentComplete");
         }, 5000);
       }
     }, [isSubmittingp]);

     const changeValues = (setFieldValue, val) => {
       let changeV = val.toString();
       let vsi = changeV !== "" || changeV !== "+256" ? changeV : "";

       if (vsi === "") {
         console.log("Not A Value");
         setFieldValue("phoneNumber", "");
       } else {
         let transformedTxt =  vsi
        
         setFieldValue("phoneNumber", transformedTxt);
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
            alignItems: "center",
            justifyContent: "flex-start",

            width: "100%",

            marginTop: 0,
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
                  justifyContent: "flex-start",
                },
              ]}
            >
              <VStack
                spacing={30}
                style={{
                  width: "95%",
                }}
              >
                {/** form -Titles & subtitle */}
                <HStack
                  spacing={20}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Octicons name="arrow-left" size={24} color={"#FFFAF6"} />
                  </TouchableOpacity>
                  <Text style={styles.formTitle}>Payment Options</Text>
                </HStack>
                <Formik
                  initialValues={{
                    phoneNumber: "",
                    payOption: "",
                    savePayment: false,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values, helpers) => {
                    // setHelperFunctions(helpers)
                    // dispatch(Login(values))
                    setIsSubmittingp(() => true);
                  }}
                >
                  {({
                    values,
                    handleChange,
                    setFieldValue,
                    handleBlur,
                    handleSubmit,
                  }) => (
                    <VStack spacing={60}>
                      {/** form inputs */}
                      <View spacing={20}>
                        {/** payment selector */}
                        <VStack spacing={23}>
                          <Text style={styles.formTitle}>
                            Select Payment Method
                          </Text>
                          <View style={styles.amountSelectorWrap}>
                            <View
                              style={{
                                marginBottom: 10,

                                width: "100%",
                              }}
                            >
                              <TouchableOpacity
                                style={[
                                  styles.radioBtnWrap,
                                  { marginBottom: 10 },
                                ]}
                                onPress={() =>
                                  setFieldValue("payOption", "Mtn")
                                }
                              >
                                <HStack
                                  spacing={21}
                                  style={{ alignItems: "center" }}
                                >
                                  <View>
                                    <Image source={MomoPayImage} />
                                  </View>
                                  <Text style={styles.radioTxt}>MTN MOMO</Text>
                                </HStack>

                                <View
                                  value="Mtn"
                                  style={[
                                    styles.radioBtn,
                                    values.payOption === "Mtn"
                                      ? {
                                          backgroundColor: "#EE5170",
                                        }
                                      : {},
                                  ]}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.radioBtnWrap}
                                onPress={() =>
                                  setFieldValue("payOption", "Airtel")
                                }
                              >
                                <HStack
                                  spacing={21}
                                  style={{ alignItems: "center" }}
                                >
                                  <View>
                                    <Image source={AirtelMMImage} />
                                  </View>
                                  <Text style={styles.radioTxt}>
                                    Airtel Money
                                  </Text>
                                </HStack>
                                <View
                                  style={[
                                    styles.radioBtn,
                                    values.payOption === "Airtel"
                                      ? {
                                          backgroundColor: "#EE5170",
                                        }
                                      : {},
                                  ]}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </VStack>

                        {/** divider */}
                        <View style={styles.horizontalLine} />

                        {/** Mobile Number */}
                        <VStack spacing={23} style={{ marginBottom: 20 }}>
                          <Text style={styles.formTitle}>
                            Add Mobile Number
                          </Text>

                          <VStack spacing={10}>
                            <Text style={styles.formLabel}>Mobile Number</Text>
                            <HStack style={styles.amountContainer}>
                              <View style={styles.amountIcon}>
                                <Text style={styles.amountIconTxt}>+256</Text>
                              </View>

                              <TextInput
                                style={styles.amountInput}
                                enablesReturnKeyAutomatically
                                keyboardAppearance="dark"
                                keyboardType="number-pad"
                                value={values.phoneNumber}
                                onChangeText={(e) =>
                                  changeValues(setFieldValue, e)
                                }
                                onBlur={handleBlur("phoneNumber")}
                              />
                            </HStack>
                          </VStack>
                        </VStack>

                        {/** CheckBox policies */}
                        <VStack spacing={20}>
                          <View style={{ flexDirection: "row", gap: 10 }}>
                            <Checkbox
                              value={values.savePayment}
                              color={COLORS.formBtnBg}
                              style={{ width: 24, height: 24 }}
                              onValueChange={(e) => {
                                setFieldValue("savePayment", e);
                              }}
                            />

                            <Text style={styles.checkboxTxt}>
                              Keep the info for the next payment
                            </Text>
                          </View>
                        </VStack>
                      </View>

                      {/** form buttons */}
                      <VStack spacing={20} style={{ alignItems: "center" }}>
                        {isSubmittingp ? (
                          <View style={styles.formBtn}>
                            <ActivityIndicator size="small" color="white" />
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.formBtn}
                            onPress={handleSubmit}
                          >
                            <Text style={styles.formBtnText}>Continue</Text>
                          </TouchableOpacity>
                        )}
                      </VStack>
                    </VStack>
                  )}
                </Formik>
              </VStack>
            </Animated.View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>

      <Modal
        transparent={true}
        visible={isSubmittingp ? true : false}
        animationType="slide"
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
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
            <BallIndicator color="#ED3F62" count={9} />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentOptions;

const styles = StyleSheet.create({
  formTitle: {
    color: COLORS.formTitle,
    fontFamily: FONTSFAMILIES.formTitlefont,
    fontSize: 20,

    letterSpacing: -0.54,
  },
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
  formBtnLink: {
    borderBottomColor: "#06F",
    borderBottomWidth: 1,
  },
  formLabel: {
    fontFamily: "Inter-Regular",
    color: "#FFFAF6",
    fontSize: 16,

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
  amountContainer: {
    height: 48,
    width: "100%",
    backgroundColor: COLORS.formBg,
    borderRadius: 6,
    borderColor: "#EE5170",
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: 10,
  },
  amountInput: {
    width: "80%",
    paddingLeft: 10,
    paddingRight: 10,
    color: COLORS.formText,
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
  },
  amountIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "20%",
    backgroundColor: "transparent",
    alignSelf: "flex-start",
  },
  amountIconTxt: {
    color: COLORS.formText,
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
  },
  amountSelectorWrap: {
    marginHorizontal: "auto",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  amountSelectorBtn: {
    borderWidth: 1,
    borderColor: "#ED3F62",
    borderRadius: 24,
    paddingVertical: 9,
    paddingHorizontal: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  amountSelectorTxt: {
    color: "#ED3F62",
    fontFamily: "Inter-ExtraBold",
    fontSize: 14,
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
  horizontalLine: {
    borderBottomColor: "rgba(242, 242, 242, 0.60)",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  checkboxTxt: {
    color: "rgba(255, 250, 246, 0.60)",
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },
  privacyBtnLink: {
    alignSelf: "flex-start",
    borderBottomColor: "#06F",
    borderBottomWidth: 1,
  },

  privacyPolicy: {
    color: "#06F",
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },
  radioBtnWrap: {
    borderWidth: 1,
    borderColor: "rgba(255, 250, 246, 0.25)",
    width: "100%",
    flexDirection: "row",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 6,
    paddingVertical: 11,
    paddingHorizontal: 11,
  },
  radioBtn: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: "#EE5170",
    borderRadius: 34,
    
  },
  radioTxt: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#FFFAF6",
  },
});


