import { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { getToken } from "../storage/authStorage";

export default function AuthLoadingScreen({ navigation }) {
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = await getToken();

      // Nie ma tokena
      if (!token) {
        navigation.replace("Login");
        return;
      }

      // JWT składa się z:
      // header.payload.signature
      const parts = token.split(".");

      if (parts.length !== 3) {
        console.log("Nieprawidłowy JWT");

        navigation.replace("Login");
        return;
      }

      const payload = parts[1];

      // Odczytujemy payload JWT
      const decodedPayload = JSON.parse(
        decodeURIComponent(
          atob(payload)
            .split("")
            .map(
              (char) =>
                "%" +
                ("00" + char.charCodeAt(0).toString(16))
                  .slice(-2)
            )
            .join("")
        )
      );

      console.log("JWT payload:", decodedPayload);

      // JWT powinien mieć exp
      if (!decodedPayload.exp) {
        console.log("JWT nie posiada daty wygaśnięcia");

        navigation.replace("Login");
        return;
      }

      // exp jest w sekundach Unix
      const currentTime = Math.floor(
        Date.now() / 1000
      );

      console.log("Aktualny czas:", currentTime);
      console.log("JWT exp:", decodedPayload.exp);

      // Token wygasł
      if (decodedPayload.exp <= currentTime) {
        console.log("JWT wygasł");

        navigation.replace("Login");
        return;
      }

      // Token jest ważny
      console.log("JWT jest ważny");

      navigation.replace("Dashboard");

    } catch (error) {
      console.log(
        "Błąd sprawdzania JWT:",
        error
      );

      navigation.replace("Login");
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});