import { Image, View, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import { Video } from "expo-av";

const LoadingGIF = ({ navigation }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Groups");
    }, 3000); // 2.5 seconds
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Video
        source={require("../assets/loading.mp4")}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
};

export default LoadingGIF;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#46467A",
  },
  video: {
    width: 200,
    height: 200,
  },
});
