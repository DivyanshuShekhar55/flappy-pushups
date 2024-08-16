import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
export const FONT_SIZE = 32;
export default function Score({ points }) {
  const [loaded, error] = useFonts({
    "PressStart2P-Regular": require("../assets/fonts/PressStart2P-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <View>
      <Text
        style={{
          fontFamily: "PressStart2P-Regular",
          fontSize: FONT_SIZE,
          color: "white",
        }}
      >
        {points}
      </Text>
    </View>
  );
}
