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

import { registerUser } from "../api/authApi";
import Loading from "../components/Loading";

export default function RegisterScreen({ navigation }) {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {

    if (password !== confirmPassword) {
    setError("Hasła nie są takie same.");
    return;
     }

     if (!login || !email || !password || !confirmPassword) {
    setError("Uzupełnij wszystkie pola.");
    return;
      }


    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      console.log("Rejestracja:", {
        login,
        email,
        password,
      });

      const data = await registerUser(
        login,
        email,
        password
      );

      console.log(
        "Odpowiedź serwera:",
        data
      );

      // Rejestracja zakończona sukcesem
      setSuccess(true);

    } catch (error) {
      console.log(
        "Błąd rejestracji:",
        error
      );

      setError(
        error.message ||
          "Nie udało się zarejestrować"
      );

    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  if (loading) {
    return <Loading />;
  }

  const isFormValid =
  login.trim() !== "" &&
  email.trim() !== "" &&
  password !== "" &&
  confirmPassword !== "" &&
  password === confirmPassword;

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
              Utwórz konto 🐝
            </Text>

            <Text style={styles.formSubtitle}>
              Zacznij monitorować swoje ule.
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
              editable={!success}
              returnKeyType="next"
            />

            {/* EMAIL */}

            <Text style={styles.label}>
              Email
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Wpisz adres email"
              placeholderTextColor="#A99A7D"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!success}
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
              editable={!success}
              returnKeyType="done"
              onSubmitEditing={
                handleRegister
              }
            />

            {/* BŁĄD */}

            {error !== "" && (
              <View style={styles.errorBox}>
                <Text style={styles.error}>
                  {error}
                </Text>
              </View>
            )}

            {/* POWTÓRZ HASŁO */}

<Text style={styles.label}>
  Powtórz hasło
</Text>

<TextInput
  style={[
    styles.input,
    confirmPassword !== "" &&
      password !== confirmPassword &&
      styles.inputError,
  ]}
  placeholder="Wpisz ponownie hasło"
  placeholderTextColor="#A99A7D"
  value={confirmPassword}
  onChangeText={setConfirmPassword}
  secureTextEntry
  editable={!success}
  returnKeyType="done"
  onSubmitEditing={handleRegister}
/>

{confirmPassword !== "" &&
  password !== confirmPassword && (
    <Text style={styles.passwordError}>
      Hasła nie są takie same.
    </Text>
  )}

            {/* =========================
                PRZYCISK
            ========================= */}

            {!success ? (

           <Pressable
  style={({ pressed }) => [
    styles.button,
    !isFormValid && styles.buttonDisabled,
    pressed &&
      isFormValid &&
      styles.buttonPressed,
  ]}
  onPress={handleRegister}
  disabled={!isFormValid}
>
  <Text style={styles.buttonText}>
    Zarejestruj się
  </Text>
</Pressable>

            ) : (

              <Pressable
                style={({ pressed }) => [
                  styles.successButton,
                  pressed &&
                    styles.buttonPressed,
                ]}
                onPress={goToLogin}
              >
                <Text
                  style={styles.successButtonText}
                >
                  Przejdź do logowania
                </Text>
              </Pressable>

            )}

          </View>

          {/* =========================
              SUKCES
          ========================= */}

          {success && (

            <View style={styles.successBox}>

              <Text style={styles.successIcon}>
                ✓
              </Text>

              <Text
                style={styles.successTitle}
              >
                Rejestracja zakończona
                pomyślnie!
              </Text>

              <Text
                style={styles.successText}
              >
                Twoje konto zostało
                utworzone.
              </Text>

              <Text
                style={styles.successText}
              >
                Możesz teraz się zalogować.
              </Text>

            </View>

          )}

          {/* =========================
              POWRÓT DO LOGOWANIA
          ========================= */}

          {!success && (

            <View
              style={
                styles.loginContainer
              }
            >

              

              <Pressable
                onPress={goToLogin}
              >
                <Text
                  style={styles.loginText}
                >
                  Masz, już konto? Zaloguj się
                </Text>
              </Pressable>

            </View>

          )}

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  inputError: {
  borderColor: "#C62828",
},

passwordError: {
  color: "#C62828",
  fontSize: 13,
  marginTop: -10,
  marginBottom: 12,
},

buttonDisabled: {
  backgroundColor: "#E5DCC8",
  opacity: 0.7,
},

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
    marginTop:-20,
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

    marginBottom: 5,
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
  // SUKCES
  // =========================

  successBox: {
    backgroundColor: "#FFFDF7",

    borderRadius: 20,

    borderWidth: 1,

    borderColor: "#F2D27A",

    padding: 20,

    marginTop: 20,

    alignItems: "center",

    shadowColor: "#C58A16",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,

    shadowRadius: 8,

    elevation: 3,
  },

  successIcon: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: "#F4B400",

    color: "#2B210F",

    fontSize: 28,

    fontWeight: "800",

    textAlign: "center",

    textAlignVertical: "center",

    marginBottom: 10,
  },

  successTitle: {
    color: "#2B210F",

    fontSize: 17,

    fontWeight: "800",

    textAlign: "center",

    marginBottom: 8,
  },

  successText: {
    color: "#887858",

    fontSize: 14,

    textAlign: "center",

    marginTop: 3,
  },

  // =========================
  // PRZYCISK PO REJESTRACJI
  // =========================

  successButton: {
    height: 52,

    backgroundColor: "#F4B400",

    borderRadius: 14,

    justifyContent: "center",

    alignItems: "center",

    marginTop: 3,
  },

  successButtonText: {
    color: "#2B210F",

    fontSize: 16,

    fontWeight: "800",
  },

  // =========================
  // LOGOWANIE
  // =========================

  loginContainer: {
    alignItems: "center",

    marginTop: 29,
  },

  // loginInfo: {
  //   fontSize: 14,
  //   color: "#887858",
  //   marginTop:-10,
  //   marginLeft:10
  // },

  loginText: {
    fontSize: 15,
    color: "#D88900",
    fontWeight: "800",
    marginTop: -20,
  },

});