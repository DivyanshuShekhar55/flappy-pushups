import { View, Text } from 'react-native'
import React from 'react'
import CameraComponent from '@/components/CameraComponent'
import Score from '@/components/Score'

export default function leaderboard() {
  return (
    <View style={{backgroundColor:'white', flex:1, marginTop:100}}>
      <Score/>
    </View>
  )
}