import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import TitleImage from "../assets/Title.png";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={TitleImage} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>MobileApp</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * 0.3,
    height: height * 0.2,
  },
  title: {
    fontSize: 28,
    fontWeight: 900,
    color: "#000000",
    textAlign: "center",
    fontFamily: "System",
  },
});

export default SplashScreen;
