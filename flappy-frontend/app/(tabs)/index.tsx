import {
  Image,
  StyleSheet,
  Platform,
  ImageBackground,
  Dimensions,
  useWindowDimensions,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import { GameManager } from "@/managers/GameManager";
import { BirdManager } from "@/managers/BirdManager";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
const { width, height } = useWindowDimensions();
const bird = new BirdManager(width);
const game = new GameManager(false, bird);

export default function HomeScreen() {
  const [gameOn, setGameOn] = useState(true);
  const pipeX = useSharedValue(width);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: pipeX.value }],
  }));

  useEffect(() => {
    game.movePipe(width, 2000, pipeX)

  }, [])
  

  return (
    <ImageBackground
      source={require("../../assets/images/background-day.png")}
      style={styles.background}
    >
      <View style={styles.bird__container}>
        <Image source={require("../../assets/images/redbird-upflap.png")} />
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  bird__container: {
    position: "absolute",
    left: width / 4,
    height: height / 2,
  },
  pipe: {
    position: "absolute",
  },
});
