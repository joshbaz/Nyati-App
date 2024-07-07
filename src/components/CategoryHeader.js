import React from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"

import { HStack } from "@react-native-material/core"

import { Octicons } from "@expo/vector-icons"

import { COLORS, FONTSFAMILIES } from "../color/VariableColors"

const CategoryHeader = ({ title, viewMoreArrow }) => {
  return (
    <HStack
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        marginLeft: 16,
        marginRight: 16,
      }}
    >
      <Text style={styles.categoryTitle}>{title}</Text>

      {viewMoreArrow ? (
        <TouchableOpacity style={{ height: "100%" }}>
          <Octicons name='arrow-right' size={24} color={COLORS.categoryTitle} />
        </TouchableOpacity>
      ) : null}
    </HStack>
  )
}

export default CategoryHeader

const styles = StyleSheet.create({
  categoryTitle: {
    color: COLORS.categoryTitle,
    fontSize: 16,
    textTransform: "capitalize",
    fontFamily: FONTSFAMILIES.categoryTitle,
  },
})
