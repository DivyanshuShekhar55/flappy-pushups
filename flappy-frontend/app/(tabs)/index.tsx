import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
  View,
} from "react-native";
import { GameManager } from "@/managers/GameManager";
import { BirdManager } from "@/managers/BirdManager";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
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

  // WebSocket connection and message handling
  useEffect(() => {
    // const ws = new WebSocket('ws://10.0.2.2:6789');
    const ws = new WebSocket('wss://107a-2401-4900-313c-f0e5-647c-d48e-6b44-9bf4.ngrok-free.app');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const message = event.data;
      console.log('Received:', message);

      // Handle the received coordinates here, if needed
      // Example: Parsing the JSON message and updating state
      try {
        const data = JSON.parse(message);
        console.log('Parsed JSON data:', data);
        // Use the received data (e.g., update bird position)
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (!isGameOver) {
      pipeX.value = withRepeat(
        withSequence(
          withTiming(width, { duration: 0 }),
          withTiming(-150, { duration: duration, easing: Easing.linear }, () => {
            let newHeight = Math.floor(Math.random() * height * 0.6);
            runOnJS(setNextPipeHeight)(newHeight);
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
    resizeMode: "stretch",
  },
});
