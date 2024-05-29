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
} from "react-native";
import React from "react";

import { Stack, Box, HStack, VStack } from "@react-native-material/core";
import { COLORS, FONTSFAMILIES } from "../color/VariableColors";
import { Octicons } from "@expo/vector-icons";

const CategoryHeader = ({title, viewMoreArrow}) => {
  return (
    <HStack
      style={{
        display: "flex",
        alignItems:'center',
        justifyContent: "space-between",
        marginBottom: 10,
        marginLeft: 16,
        marginRight: 16,
      }}
    >
      <Text style={styles.categoryTitle}>{title}</Text>

      {viewMoreArrow ? (
        <TouchableOpacity style={{height:'100%'}}>
          <Octicons name="arrow-right" size={24} color={COLORS.categoryTitle} />
        </TouchableOpacity>
      ) : null}
    </HStack>
  );
};

export default CategoryHeader;

const styles = StyleSheet.create({
    categoryTitle: {
        color: COLORS.categoryTitle,
        fontSize: 16,
        textTransform: 'capitalize',
        fontFamily: FONTSFAMILIES.categoryTitle
    }
});
