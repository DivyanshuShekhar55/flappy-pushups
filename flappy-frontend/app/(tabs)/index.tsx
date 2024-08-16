import {
  Image,
  StyleSheet,
  Platform,
  ImageBackground,
  Dimensions,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";

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
} from "react-native-reanimated";
import { Fragment } from "react";
import Score from "@/components/Score";
import { FONT_SIZE } from "@/components/Score";

export default function HomeScreen() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOn, setGameOn] = useState(true);
  const score = useRef(0);
  const { width, height } = useWindowDimensions();
  const pipeX = useSharedValue(width);
  const [nextPipeHeight, setNextPipeHeight] = useState(height / 4);
  const bird = new BirdManager(width);
  const game = new GameManager(bird, height);
  const PIPE_SPEED = 1600; // in 1.6s it travels whole screen

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
    }
  }, [isGameOver]);

  const update_score = () => {
    //update score every time a pipe has passed the screen ...
    setInterval(() => {
      if (!isGameOver) {
        score.current++;
      }
    }, PIPE_SPEED );
    // to cover 75% of screen as bird at width/4
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: pipeX.value}, {rotateZ:'180deg' }],
    height: nextPipeHeight,
  }));
  const animatedBottomStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pipeX.value}],
    height: 200,
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
            zIndex:1000
          }}
        >
          {/* Score Display */}
          <Score points={score.current} />
        </View>

        <View
          style={{
            position: "absolute",
            left: width / 4,
            top: height / 2,
            height: 0.05 * height,
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
            style={[styles.pipe, animatedBottomStyle, {bottom:-height}]}
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
  },

  topPipe:{
    top:0
  },

  gameView: {
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
