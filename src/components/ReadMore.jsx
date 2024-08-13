import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import useDisclosure from "../../hooks/useDisclosure"
import { COLORS } from "../color/VariableColors"

const ReadMoreCard = ({ content, linesToShow }) => {
  const { isOpen: expanded, onToggle } = useDisclosure()
  return (
    <View style={styles.container}>
      <Text
        numberOfLines={expanded ? undefined : linesToShow}
        style={styles.text}
      >
        {content}
      </Text>

      {!expanded && (
        <LinearGradient
          colors={[
            "transparent",
            COLORS.generalOpacity,
            COLORS.generalOpacity2,
            COLORS.generalOpacity2,
            COLORS.generalBg,
          ]}
          style={styles.gradient}
        />
      )}

      <TouchableOpacity
        onPress={onToggle}
        className={`flex items-end justify-end ${!expanded && "-top-7"}`}
      >
        <Text className='text-primary-main text-lg '>
          {expanded ? "Read Less" : "Read More"}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
    color: COLORS.formText,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  readMoreText: {
    marginTop: 10,
    color: "#0066cc",
    fontWeight: "bold",
    textAlign: "right",
  },
})

export default ReadMoreCard
