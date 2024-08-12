import {
  Image,
  StyleSheet,
  Platform,
  ImageBackground,
  Dimensions,
  useWindowDimensions,
  View
} from "react-native";
import { useState } from "react";

import { GameManager } from "@/managers/GameManager";
import { BirdManager } from "@/managers/BirdManager";
const { width, height } = useWindowDimensions();
const bird = new BirdManager(width);
const game = new GameManager(false, bird);

export default function HomeScreen() {
  
  const [gameOn, setGameOn] = useState(true)

  return (
    <ImageBackground
      source={require("../../assets/images/background-day.png")}
      style={styles.background}
    >
      <View style={styles.bird__container}>
        <Image source={require("../../assets/images/redbird-upflap.png")} />
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
  bird__container:{
    position:'absolute',
    left:width/4,
    height:height/2
  }
});
