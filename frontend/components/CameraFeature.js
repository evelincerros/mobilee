import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

export default function CameraFeature() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const navigation = useNavigation(); 

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleTakePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      const fileUri = `${FileSystem.documentDirectory}photo_${Date.now()}.jpg`;

      try {
        await FileSystem.moveAsync({
          from: photo.uri,
          to: fileUri,
        });
        console.log("Photo saved to:", fileUri);
        setPhotoUri(fileUri);
      } catch (error) {
        console.error("Error saving photo:", error);
      }
    }
  };

  const toggleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Requesting Camera Permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No Camera Permission</Text>
        <Button
          title="Allow Camera"
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Text>Photo Saved at: {photoUri}</Text>
          <Image source={{ uri: photoUri }} style={styles.imagePreview} />
          <Button
            title="Take Another Picture"
            onPress={() => setPhotoUri(null)}
          />
        </View>
      ) : (
        <Camera
          style={styles.camera}
          type={type}
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  imagePreview: {
    width: "100%",
    height: 400,
    marginBottom: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  backButton: {
    padding: 15,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    position: "absolute",
    bottom: 40,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
