import React from "react";
import { StatusBar, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenStyles } from "./Screen.style";

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  backgroundColor = "#ffffff",
  ...rest
}) => {
  return (
    <SafeAreaView style={[ScreenStyles.container, { backgroundColor }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={true}
      />
      <View style={[ScreenStyles.view, { backgroundColor }, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default Screen;
