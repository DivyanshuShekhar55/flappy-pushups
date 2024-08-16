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
  const [nextPipeHeight, setNextPipeHeight] = useState(height /2.2);
  const bird = new BirdManager(width);
  const game = new GameManager(bird, height);
  const PIPE_SPEED = 1600; // in 1.6s it travels whole screen

  const BIRD_HEIGHT_PERCENT_TO_SCREEN = 0.05; //5% of screen height
  const BIRD_X_POS = width / 4;
  const BIRD_Y_POS = useRef(height / 2);

  // // WebSocket connection and message handling
  // useEffect(() => {
  //   // const ws = new WebSocket('ws://10.0.2.2:6789');
  //   const ws = new WebSocket(
  //     "wss://107a-2401-4900-313c-f0e5-647c-d48e-6b44-9bf4.ngrok-free.app"
  //   );

  //   ws.onopen = () => {
  //     console.log("Connected to WebSocket server");
  //   };

  //   ws.onmessage = (event) => {
  //     const message = event.data;
  //     console.log("Received:", message);

  //     // Handle the received coordinates here, if needed
  //     // Example: Parsing the JSON message and updating state
  //     try {
  //       const data = JSON.parse(message);
  //       console.log("Parsed JSON data:", data);
  //       // Use the received data (e.g., update bird position)
  //     } catch (error) {
  //       console.error("Error parsing JSON:", error);
  //     }
  //   };

  //   ws.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   ws.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, []);

  useEffect(() => {
    if (!isGameOver) {
      // score.current = game.run(width, height);
      update_score();
      detectCollision()

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
            },
            
          ),
          withTiming(width, { duration: 0 })
        ),
        0
      );
    } else {
      cancelAnimation(pipeX)
      

      //router.navigate('../StartGame')
      console.log("gameover");
    }
  }, [isGameOver]);

  const update_score = () => {
    //update score every time a pipe has passed the screen ...
    setInterval(() => {
      if (!isGameOver) {
        score.current++;
      }
    }, PIPE_SPEED);
    // fix : to cover 75% of screen as bird at width/4hould be what??
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      //detectCollision();
    }, 33); // Check for collision every 33 (adjust as needed) around 30fps
  
    return () => {
      clearInterval(intervalId); // Clean up the interval on unmount or when game ends
    };
  }, [isGameOver, nextPipeHeight]);

  const detectCollision = () => {
    let withinPipeXBounds =
      BIRD_X_POS >= pipeX.value && BIRD_X_POS <= pipeX.value + PIPE_WIDTH;
     
    let withinTopPipeYBounds = BIRD_Y_POS.current >= 0 && BIRD_Y_POS.current <= nextPipeHeight;

    let withinBottomPipeYBounds =
      BIRD_Y_POS.current >= nextPipeHeight + (2.9 * BIRD_HEIGHT_PERCENT_TO_SCREEN*height) &&
      BIRD_Y_POS.current <= height;
      // fix : 2.9 is a random magic number

    if (
      withinPipeXBounds &&
      (withinTopPipeYBounds || withinBottomPipeYBounds)
    ) {
      // console.log("hit detected");

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
    //i.e., leave 3 times the gap as of bird size
  }));

  return (
    <View style={{ position: "relative" }}>
      <View style={{ position: "absolute", zIndex: 1 }}>
        {/* @ts-ignore*/}
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

        <View
          style={{
            position: "absolute",
            left: BIRD_X_POS,
            top: BIRD_Y_POS.current,
            height: BIRD_HEIGHT_PERCENT_TO_SCREEN * height,
            zIndex:999
          }}
        >
          <Image source={require("../../assets/images/redbird-upflap.png")} />
        </View>

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

        {/* </ImageBackground> */}
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
