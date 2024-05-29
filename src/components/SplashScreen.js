import React, {useEffect, useRef} from 'react';
import { View, Animated, Image, Text, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../color/VariableColors';
import Logo from '../../assets/adaptive-icon.png'

import {
  BallIndicator,
} from "react-native-indicators";


export default function SplashScreen() {
  const [spinnerActive, setSpinnerActive] = React.useState(false)
  const [sizeImage, setSizeImage] = React.useState({
    width: 199,
    height: 199,
  });
    // safeArea value
    const edges = useSafeAreaInsets();

    // Animation effects
    const startAnimation = useRef(new Animated.Value(0)).current;
    
 

    useEffect(() => {
        //starts animation after 500ms
      setTimeout(() => {
          
            Animated.sequence([
              Animated.timing(startAnimation, {
                toValue: -130,
                useNativeDriver: true,
               
              }),
            ]).start();  
        }, 500)
        setTimeout(() => {
          setSpinnerActive(() => true);
        }, 510);
    },[])
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
              transform: [
                {
                  translateY: startAnimation,
                },
              ],
            },
          ]}
        >
          <Image
            source={Logo}
            height={sizeImage.height}
            width={sizeImage.width}
            resizeMode="contain"
            style={{ width: sizeImage.width, height: sizeImage.height }}
          ></Image>
        </Animated.View>

        {spinnerActive ? (
          <View style={{display:'flex', alignItems: 'center', position: 'absolute', bottom: 100, left: 0, right: 0}}>
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
        ) : null}
      </View>
    );
}