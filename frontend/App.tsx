import { useState, useRef } from "react";
import { View, StyleSheet, Modal, Pressable, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [uri, setUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return null;

  const openCamera = async () => {
    if (!permission.granted) {
      await requestPermission();
      return;
    }
    setShowCamera(true);
  };

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo?.uri) {
      setUri(photo.uri);
      setShowCamera(false);
    }
  };

  return (
    <View style={styles.container}>
      {uri && (
        <Image
          source={{ uri }}
          style={{ width: 300, height: 300, marginBottom: 20 }}
          contentFit="cover"
        />
      )}

      <Pressable onPress={openCamera} style={styles.launchButton}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </Pressable>

      <Modal visible={showCamera} animationType="slide">
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
        >
          <View style={styles.shutterContainer}>
            <Pressable onPress={takePicture}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.shutterBtn,
                    { opacity: pressed ? 0.5 : 1 },
                  ]}
                >
                  <View style={styles.shutterBtnInner} />
                </View>
              )}
            </Pressable>
          </View>
        </CameraView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  launchButton: {
    backgroundColor: "#222",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  shutterContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
  },
});