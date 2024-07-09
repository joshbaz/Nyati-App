import React, { useEffect, useRef } from "react"
import { Animated, Image, View } from "react-native"
import { BallIndicator } from "react-native-indicators"

import { COLORS } from "../color/VariableColors"

export default function SplashScreen({ hideLogo }) {
  const [spinnerActive, setSpinnerActive] = React.useState(false)
  const [sizeImage, setSizeImage] = React.useState({
    width: 300,
    height: 300,
  })

  // Animation effects
  const startAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    //starts animation after 500ms
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(startAnimation, {
          toValue: -130,
          useNativeDriver: true,
        }),
      ]).start()
    }, 500)
    setTimeout(() => {
      setSpinnerActive(() => true)
    }, 510)
  }, [])
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: COLORS.generalBg,
      }}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            alignItems: "center",
            justifyContent: "space-around",
            transform: [
              {
                translateY: startAnimation,
              },
            ],
          },
        ]}
      >
        <Image
          source={require("../../assets/adaptive-icon.png")}
          height={sizeImage.height}
          width={sizeImage.width}
          resizeMode='contain'
          style={{
            width: sizeImage.width,
            height: sizeImage.height,
            opacity: hideLogo ? 0 : 1,
          }}
        />
      </Animated.View>

      {spinnerActive ? (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            bottom: hideLogo ? 400 : 100,
            left: 0,
            right: 0,
          }}
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
      ) : null}
    </View>
  )
}
