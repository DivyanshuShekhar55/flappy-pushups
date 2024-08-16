import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function StartGame() {
  return (
    <View style={styles.bg}>
      <Text>StartGame</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  bg:{
    backgroundColor:'white',
    flex:1
  }
})