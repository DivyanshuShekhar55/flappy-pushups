import {
  Image,
  StyleSheet,
  Platform,
  ImageBackground,
  Dimensions,
  useWindowDimensions,
  View,
} from "react-native";
import { useEffect, useState, useRef } from "react";

import { GameManager } from "@/managers/GameManager";
import { BirdManager } from "@/managers/BirdManager";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  useDerivedValue,
  runOnJS
} from "react-native-reanimated";


export default function HomeScreen() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOn, setGameOn] = useState(true);
  const score = useRef(0);
  const { width, height } = useWindowDimensions();
  const pipeX = useSharedValue(width);
  const [nextPipeHeight, setNextPipeHeight] = useState(height / 4);
  const bird = new BirdManager(width);
  const game = new GameManager(false, bird, height / 4, height, pipeX);
  const duration = 1600;
  //setIsGameOver(game.isGameOver)

  useEffect(() => {
    if (!isGameOver) {
      pipeX.value = withRepeat(
        withSequence(
          withTiming(width, { duration: 0 }),
          withTiming(-150, { duration: duration, easing: Easing.linear },()=>{
            let newHeight= Math.floor(Math.random() * height * 0.6);
            runOnJS(setNextPipeHeight)(newHeight)
          }),
          withTiming(width, { duration: 0 })
        ),
        0
      );
    }
  }, [isGameOver]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: pipeX.value }],
    height: nextPipeHeight,
  }));

  return (
    <ImageBackground
      source={require("../../assets/images/background-day.png")}
      style={styles.background}
    >
      {/* Score Display */}
      <View></View>

      <View
        style={{
          position: "absolute",
          left: width / 4,
          top: height / 2,
          borderColor: "red",
          borderWidth: 2,
          height: 0.05 * height,
        }}
      >
        <Image
          source={require("../../assets/images/redbird-upflap.png")}
          
        />
      </View>

      <View>
        <Animated.Image
          source={require("../../assets/images/pipe-green.png")}
          style={[styles.pipe, animatedStyles]}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    position: "relative",
  },
  pipe: {
    position: "absolute",
    bottom: -100,
    borderWidth: 4,
    borderColor: "red",
    resizeMode:"stretch"
  },

});
