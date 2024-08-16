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
import CameraComponent from "@/components/CameraComponent";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  useDerivedValue,
  runOnJS,
  cancelAnimation,
} from "react-native-reanimated";
import Score from "@/components/Score";
import { FONT_SIZE } from "@/components/Score";
import { router } from "expo-router";

const PIPE_WIDTH = 50;

export default function HomeScreen() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOn, setGameOn] = useState(true);
  const score = useRef(0);
  const { width, height } = useWindowDimensions();
  const pipeX = useSharedValue(width);
  const [nextPipeHeight, setNextPipeHeight] = useState(height / 2.2);
  const bird = new BirdManager(width);
  const game = new GameManager(bird, height);
  const PIPE_SPEED = 1600; // in 1.6s it travels whole screen

  const BIRD_HEIGHT_PERCENT_TO_SCREEN = 0.05; // 5% of screen height
  const BIRD_X_POS = width / 4;
  const BIRD_Y_POS = height / 2;

  const birdY = useSharedValue(BIRD_Y_POS);
  const animatedBirdStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: birdY.value - BIRD_Y_POS }],
  }));

  // WebSocket connection and message handling
  useEffect(() => {
    // const ws = new WebSocket('ws://10.0.2.2:6789');
    const ws = new WebSocket(
      "wss:///000d-106-221-156-137.ngrok-free.app"
    );

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const message = event.data;
      console.log("Received:", message);

      try {
        const data = JSON.parse(message);
        console.log("Parsed JSON data:", data);

        if (data.y !== undefined) {
          // Update BIRD_Y_POS with received y value
          birdY.value = withTiming(data.y, { duration: 50 });
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (!isGameOver) {
      // score.current = game.run(width, height);
      update_score();

      pipeX.value = withRepeat(
        withSequence(
          withTiming(width, { duration: 0 }),
          withTiming(
            -150,
            { duration: PIPE_SPEED, easing: Easing.linear },
            () => {
              const max = height * 0.6;
              const min = height * 0.2;
              let newHeight = Math.floor(Math.random() * (max - min) + min);
              runOnJS(setNextPipeHeight)(newHeight);
            }
          ),
          withTiming(width, { duration: 0 })
        ),
        0
      );
    } else {
      cancelAnimation(pipeX);
      router.navigate('../StartGame');
      console.log("game over flow");
    }
  }, [isGameOver]);

  const update_score = () => {
    // Update score every time a pipe has passed the screen ...
    const update = () => {
      if (!isGameOver) {
        score.current++;
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      //detectCollision();
    }, 50); // Check for collision every 100ms (adjust as needed)

    return () => {
      clearInterval(intervalId); // Clean up the interval on unmount or when game ends
    };
  }, [isGameOver, nextPipeHeight]);

  const detectCollision = () => {
    let withinPipeXBounds =
      BIRD_X_POS >= pipeX.value && BIRD_X_POS <= pipeX.value + PIPE_WIDTH;

    let withinTopPipeYBounds = birdY.value >= 0 && birdY.value <= nextPipeHeight;

    let withinBottomPipeYBounds =
      birdY.value >= nextPipeHeight + (2.9 * BIRD_HEIGHT_PERCENT_TO_SCREEN * height) &&
      birdY.value <= height;

    if (
      withinPipeXBounds &&
      (withinTopPipeYBounds || withinBottomPipeYBounds)
    ) {
      setIsGameOver(true);
    }
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: pipeX.value }, { rotateZ: "180deg" }],
    height: nextPipeHeight,
  }));

  const animatedBottomStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pipeX.value }],
    height:
      height - nextPipeHeight - (3 * BIRD_HEIGHT_PERCENT_TO_SCREEN * height),
    // i.e., leave 3 times the gap as of bird size
  }));

  return (
    <View style={{ position: "relative" }}>
      <View style={{ position: "absolute", zIndex: 1 }}>
        {/* @ts-ignore */}
        <CameraComponent />
      </View>
      <View style={styles.gameView}>
        <View
          style={{
            position: "absolute",
            top: 100,
            left: width / 2 - FONT_SIZE,
            zIndex: 1000,
          }}
        >
          {/* Score Display */}
          <Score points={score.current} />
        </View>

        <Animated.View
          style={[
            {
              position: "absolute",
              left: BIRD_X_POS,
              top: BIRD_Y_POS,
              height: BIRD_HEIGHT_PERCENT_TO_SCREEN * height,
            },
            animatedBirdStyle
          ]}
        >
          <Image source={require("../../assets/images/redbird-upflap.png")} />
        </Animated.View>

        <View>
          <Animated.Image
            source={require("../../assets/images/pipe-green.png")}
            style={[styles.pipe, styles.topPipe, animatedStyles]}
          />
        </View>

        <View>
          <Animated.Image
            source={require("../../assets/images/pipe-green.png")}
            style={[styles.pipe, animatedBottomStyle, { bottom: -height }]}
          />
        </View>

        <View style={{ position: "absolute", flex: 1 }}>
          <Image
            source={require("../../assets/images/base.png")}
            style={{
              position: "absolute",
              height: height * 0.1,
              bottom: -height,
              resizeMode: "stretch",
              width: width,
            }}
          ></Image>
        </View>
      </View>
    </View>
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
    resizeMode: "stretch",
    width: PIPE_WIDTH,
  },

  topPipe: {
    top: 0,
  },

  gameView: {
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});