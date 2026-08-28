import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

import { loginUser } from "../api/authApi";
import { saveToken } from "../storage/authStorage";
import Loading from "../components/Loading";

export default function LoginScreen({ navigation }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Logowanie:", {
        login,
        password,
      });

      const data = await loginUser(
        login,
        password
      );

      console.log(
        "Odpowiedź serwera:",
        data
      );

      // JWT znajduje się w user
      const token = data.user?.token;

      if (!token) {
        throw new Error(
          "Backend nie zwrócił tokena JWT"
        );
      }

      // Zapisujemy JWT w telefonie
      await saveToken(token);

      // API Key użytkownika
      const apiKey = data.user?.apiKey;

      console.log(
        "API Key:",
        apiKey
      );

      // Przechodzimy do Dashboardu
      navigation.replace("Dashboard", {
        apiKey: apiKey,
      });

    } catch (error) {
      console.log(
        "Błąd logowania:",
        error
      );

      setError(
        error.message ||
          "Nie udało się zalogować"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
      keyboardVerticalOffset={20}
    >

      <ScrollView
        contentContainerStyle={
          styles.scrollContainer
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.container}>

          {/* =========================
              LOGO
          ========================= */}

          <View style={styles.logoContainer}>

            <Text style={styles.logo}>
              🐝
            </Text>

            <Text style={styles.title}>
              HiveSense
            </Text>

            <Text style={styles.subtitle}>
              Monitoring Twoich uli
            </Text>

          </View>

          {/* =========================
              FORMULARZ
          ========================= */}

          <View style={styles.form}>

            <Text style={styles.formTitle}>
              Witaj ponownie 👋
            </Text>

            <Text style={styles.formSubtitle}>
              Zaloguj się, aby zobaczyć
              swoje urządzenia.
            </Text>

            {/* LOGIN */}

            <Text style={styles.label}>
              Login
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Wpisz login"
              placeholderTextColor="#A99A7D"
              value={login}
              onChangeText={setLogin}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            {/* HASŁO */}

            <Text style={styles.label}>
              Hasło
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Wpisz hasło"
              placeholderTextColor="#A99A7D"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            {/* BŁĄD */}

            {error !== "" && (
              <View style={styles.errorBox}>
                <Text style={styles.error}>
                  {error}
                </Text>
              </View>
            )}

            {/* PRZYCISK */}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>
                Zaloguj się
              </Text>
            </Pressable>

          </View>

          {/* =========================
              REJESTRACJA
          ========================= */}

          <View style={styles.registerContainer}>

            <Text style={styles.registerInfo}>
              Nie masz jeszcze konta?
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate(
                  "Register"
                )
              }
            >
              <Text style={styles.registerText}>
                Zarejestruj się
              </Text>
            </Pressable>

          </View>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  // =========================
  // KEYBOARD
  // =========================

  keyboardContainer: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },

  scrollContainer: {
    flexGrow: 1,
  },

  // =========================
  // GŁÓWNY KONTENER
  // =========================

  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",

    paddingHorizontal: 25,

    // było 65
    // zmniejszamy, żeby formularz
    // był trochę wyżej
    paddingTop: 35,

    paddingBottom: 30,
  },

  // =========================
  // LOGO
  // =========================

  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  logo: {
    fontSize: 55,
    marginBottom: 5,
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#2B210F",
  },

  subtitle: {
    fontSize: 15,
    color: "#947C55",
    marginTop: 4,
  },

  // =========================
  // FORMULARZ
  // =========================

  form: {
    backgroundColor: "#FFFDF7",

    borderRadius: 24,

    padding: 22,

    borderWidth: 1,
    borderColor: "#F2D27A",

    shadowColor: "#C58A16",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.1,
    shadowRadius: 10,

    elevation: 4,
    marginTop:-20
  },

  formTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2B210F",
    marginBottom: 5,
  },

  formSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#887858",
    marginBottom: 22,
  },

  // =========================
  // LABEL
  // =========================

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6F572E",
    marginBottom: 7,
  },

  // =========================
  // INPUT
  // =========================

  input: {
    height: 52,

    backgroundColor: "#FFF8E7",

    borderWidth: 1,
    borderColor: "#E8CC83",

    borderRadius: 13,

    paddingHorizontal: 15,

    marginBottom: 16,

    fontSize: 16,
    color: "#332A1A",
  },

  // =========================
  // BŁĄD
  // =========================

  errorBox: {
    backgroundColor: "#FFF0EE",

    borderRadius: 12,

    borderWidth: 1,
    borderColor: "#F3B6AD",

    padding: 12,

    marginBottom: 15,
  },

  error: {
    color: "#C62828",
    fontSize: 14,
  },

  // =========================
  // PRZYCISK
  // =========================

  button: {
    height: 52,

    backgroundColor: "#F4B400",

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 3,
  },

  buttonPressed: {
    opacity: 0.75,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  buttonText: {
    color: "#2B210F",

    fontSize: 16,

    fontWeight: "800",
  },

  // =========================
  // REJESTRACJA
  // =========================

  registerContainer: {
    alignItems: "center",

    marginTop: 25,
  },

  registerInfo: {
    fontSize: 14,

    color: "#887858",
    marginTop:-20,
  },

  registerText: {
    fontSize: 15,

    color: "#D88900",

    fontWeight: "800",

    marginTop: 5,
  },

});