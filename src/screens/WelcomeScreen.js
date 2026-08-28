import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/bee-background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Przyciemnienie zdjęcia */}
      <View style={styles.overlay}>

        {/* GÓRA */}
        <View style={styles.top}>
          <Text style={styles.bee}>🐝</Text>

          <Text style={styles.logo}>
            HiveSense
          </Text>

          <Text style={styles.subtitle}>
            Inteligentny monitoring uli
          </Text>
        </View>

        {/* ŚRODEK */}
        <View style={styles.center}>
          <View style={styles.iconCircle}>
            <Text style={styles.temperatureIcon}>
              🌡️
            </Text>
          </View>

          <Text style={styles.title}>
            Monitoruj temperaturę
          </Text>

          <Text style={styles.description}>
            Sprawdzaj temperaturę swoich uli
            i obserwuj jej zmiany w ciągu dnia.
          </Text>
        </View>

        {/* DÓŁ */}
        <View style={styles.bottom}>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              navigation.navigate("Login")
            }
          >
            <Text style={styles.loginText}>
              Zaloguj się
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              navigation.navigate("Register")
            }
          >
            <Text style={styles.registerText}>
              Utwórz konto
            </Text>
          </Pressable>

          <Text style={styles.footer}>
            🐝 Twoje ule. Twoje dane. Twoja kontrola.
          </Text>

        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.38)",
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: "space-between",
  },

  // GÓRA

  top: {
    alignItems: "center",
  },

  bee: {
    fontSize: 42,
    marginBottom: 5,
  },

  logo: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 18,
    color: "#FFF4C7",
    marginTop: 5,
  },

  // ŚRODEK

  center: {
    alignItems: "center",
    paddingHorizontal: 20,
  },

  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "rgba(255, 193, 7, 0.92)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  temperatureIcon: {
    fontSize: 38,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },

  description: {
    fontSize: 16,
    lineHeight: 23,
    color: "#F5F5F5",
    textAlign: "center",
    marginTop: 12,
  },

  // PRZYCISKI

  bottom: {
    width: "100%",
  },

  loginButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#E5A900",
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  registerButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },

  registerText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  buttonPressed: {
    opacity: 0.7,
  },

  footer: {
    textAlign: "center",
    color: "#FFF4C7",
    fontSize: 14,
    marginTop: 30,
    marginBottom:30,
  },
});