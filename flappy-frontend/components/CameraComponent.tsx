import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const{width, height} = Dimensions.get('window')
const aspectRatio = width/height

export default function CameraComponent() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.container}>
    <Text style={styles.message}>We need your permission to show the camera</Text>
    <Button onPress={requestPermission} title="grant permission" />
  </View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} >

      </CameraView>
            <Text style={styles.text}>Flip Camera</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor:'white',
    display:'flex',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    //borderWidth:200,
    padding:width, // fix-this, camera doesnt show if not given a padding or border-width

  },
  buttonContainer: {
    position:'absolute',
    top:height/2,
    left:'auto',
    borderWidth:5,
    borderColor:'red',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor:'red'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
