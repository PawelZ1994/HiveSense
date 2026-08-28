import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";

import {
  getMe,
  deleteAccount,
} from "../api/authApi";

import {
  removeToken,
} from "../storage/authStorage";

import Loading from "../components/Loading";

export default function SettingsScreen({
  navigation,
}) {
  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState(null);

  const [showApiKey, setShowApiKey] =
    useState(false);

  useEffect(() => {
    loadUser();
  }, []);


const handleLogout = () => {
  Alert.alert(
    "🚪 Wylogowanie",
    "Czy na pewno chcesz się wylogować?",
    [
      {
        text: "Anuluj",
        style: "cancel",
      },
      {
        text: "Wyloguj się",
        onPress: async () => {
          try {
            await removeToken();

            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "Login",
                },
              ],
            });
          } catch (error) {
            console.log("Błąd wylogowania:", error);

            Alert.alert(
              "Błąd",
              "Nie udało się wylogować."
            );
          }
        },
      },
    ]
  );
};

  // =========================
  // POBIERANIE DANYCH UŻYTKOWNIKA
  // =========================

  const loadUser = async () => {
    try {
      setLoading(true);

      const data = await getMe();

      console.log(
        "Dane użytkownika:",
        data
      );

      setUser(data.user);

    } catch (error) {
      console.log(
        "Błąd pobierania użytkownika:",
        error
      );

      Alert.alert(
        "Błąd",
        error.message ||
          "Nie udało się pobrać danych użytkownika"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // POTWIERDZENIE USUNIĘCIA
  // =========================

  const confirmDeleteAccount = () => {
    Alert.alert(
      "⚠️ Usuń konto",

      "Czy na pewno chcesz usunąć konto?\n\nWszystkie Twoje dane i urządzenia zostaną usunięte. Tej operacji nie można cofnąć.",

      [
        {
          text: "Anuluj",
          style: "cancel",
        },

        {
          text: "Usuń konto",
          style: "destructive",
          onPress: handleDeleteAccount,
        },
      ]
    );
  };

  // =========================
  // USUNIĘCIE KONTA
  // =========================

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);

      console.log(
        "Usuwanie konta..."
      );

      await deleteAccount();

      console.log(
        "Konto zostało usunięte"
      );

      // Usuwamy JWT z telefonu
      await removeToken();

      // Czyścimy historię nawigacji
      // Użytkownik nie może wrócić przyciskiem "wstecz"
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Login",
          },
        ],
      });

    } catch (error) {
      console.log(
        "Błąd usuwania konta:",
        error
      );

      setLoading(false);

      Alert.alert(
        "Błąd",
        error.message ||
          "Nie udało się usunąć konta"
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  // =========================
  // WIDOK
  // =========================

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* NAGŁÓWEK */}

        <View style={styles.header}>

          <Text style={styles.title}>
            Ustawienia ⚙️
          </Text>

          <Text style={styles.subtitle}>
            Zarządzaj swoim kontem
          </Text>

        </View>

        {/* ===================== */}
        {/* MOJE KONTO */}
        {/* ===================== */}

        <View style={styles.section}>

          <Text
            style={styles.sectionTitle}
          >
            👤 Moje konto
          </Text>

          <View style={styles.card}>

            {/* LOGIN */}

            <Text style={styles.label}>
              Login
            </Text>

            <Text style={styles.value}>
              {user.login}
            </Text>

            <View
              style={styles.separator}
            />

            {/* EMAIL */}

            <Text style={styles.label}>
              Email
            </Text>

            <Text style={styles.value}>
              {user.email}
            </Text>

            <View
              style={styles.separator}
            />

            {/* HASŁO */}

            <Text style={styles.label}>
              Hasło
            </Text>

            <View
              style={styles.passwordRow}
            >

              <Text style={styles.value}>
                ••••••••••
              </Text>

              <Pressable
                onPress={() =>
                  Alert.alert(
                    "Zmiana hasła",
                    "Funkcję zmiany hasła dodamy później."
                  )
                }
              >

                <Text
                  style={styles.changeText}
                >
                  Zmień
                </Text>

              </Pressable>

            </View>

          </View>

        </View>

        {/* ===================== */}
        {/* API KEY */}
        {/* ===================== */}

        <View style={styles.section}>

          <Text
            style={styles.sectionTitle}
          >
            🔑 API Key
          </Text>

          <View style={styles.card}>

            <Pressable
              onPress={() =>
                setShowApiKey(
                  !showApiKey
                )
              }
            >

              <Text
                style={styles.apiButton}
              >
                {showApiKey
                  ? "Kliknij, aby ukryć API Key"
                  : "Kliknij, aby zobaczyć Twój API Key"}
              </Text>

            </Pressable>

            {showApiKey && (

              <View
                style={styles.apiKeyBox}
              >

                <Text
                  style={styles.apiKeyLabel}
                >
                  Twój API Key:
                </Text>

                <Text
                  style={styles.apiKey}
                >
                  {user.apiKey}
                </Text>

              </View>

            )}

          </View>

        </View>

        {/* ===================== */}
{/* WYLOGOWANIE */}
{/* ===================== */}

<View style={styles.logoutSection}>

  <Text style={styles.sectionTitle}>
    🚪 Sesja
  </Text>

  <View style={styles.logoutCard}>

    <View style={styles.logoutInfo}>
      <Text style={styles.logoutTitle}>
        Wyloguj się
      </Text>

      <Text style={styles.logoutDescription}>
        Zakończ bieżącą sesję na tym urządzeniu.
      </Text>
    </View>

    <Pressable
      style={({ pressed }) => [
        styles.logoutButton,
        pressed && styles.logoutPressed,
      ]}
      onPress={handleLogout}
    >
      <Text style={styles.logoutText}>
        Wyloguj
      </Text>
    </Pressable>

  </View>

</View>


        {/* ===================== */}
        {/* STREFA NIEBEZPIECZNA */}
        {/* ===================== */}

        <View
          style={styles.dangerSection}
        >

          <Text
            style={styles.dangerTitle}
          >
            ⚠️ Strefa niebezpieczna
          </Text>

          <Text
            style={styles.dangerText}
          >
            Usunięcie konta jest
            nieodwracalne. Wszystkie
            urządzenia i dane zostaną
            usunięte.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed &&
                styles.deletePressed,
            ]}
            onPress={
              confirmDeleteAccount
            }
          >

            <Text
              style={styles.deleteText}
            >
              🗑️ Usuń konto
            </Text>

          </Pressable>

        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  // =========================
  // GŁÓWNY KONTENER
  // =========================

  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },

  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 55,
    paddingBottom: 40,
  },

  // =========================
  // NAGŁÓWEK
  // =========================

  header: {
    marginBottom: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2B210F",
  },

  subtitle: {
    fontSize: 15,
    color: "#947C55",
    marginTop: 5,
  },

  // =========================
  // SEKCJE
  // =========================

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#6F572E",
    marginBottom: 10,
  },

  // =========================
  // KARTA
  // =========================

  card: {
    backgroundColor: "#FFFDF7",
    borderRadius: 20,
    padding: 18,

    borderWidth: 1,
    borderColor: "#F2D27A",

    shadowColor: "#C58A16",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  label: {
    fontSize: 12,
    color: "#A99A7D",
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    color: "#332A1A",
    fontWeight: "600",
  },

  separator: {
    height: 1,
    backgroundColor: "#F0E4C8",
    marginVertical: 14,
  },

  // =========================
  // HASŁO
  // =========================

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  changeText: {
    color: "#D88900",
    fontWeight: "800",
  },

  // =========================
  // API KEY
  // =========================

  apiButton: {
    color: "#D88900",
    fontWeight: "800",
    fontSize: 14,
  },

  apiKeyBox: {
    marginTop: 12,
    backgroundColor: "#FFF8E7",
    borderRadius: 10,
    padding: 12,
  },

  apiKeyLabel: {
    fontSize: 12,
    color: "#A99A7D",
    marginBottom: 5,
  },

  apiKey: {
    color: "#332A1A",
    fontSize: 13,
  },

  // =========================
  // STREFA NIEBEZPIECZNA
  // =========================

  dangerSection: {
    marginTop: 5,
    backgroundColor: "#FFF0EE",
    borderRadius: 20,
    padding: 18,

    borderWidth: 1,
    borderColor: "#F3B6AD",
  },

  dangerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#A52A21",
    marginBottom: 8,
  },

  dangerText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#8A4A44",
    marginBottom: 15,
  },

  deleteButton: {
    height: 48,
    borderRadius: 13,
    backgroundColor: "#C62828",

    justifyContent: "center",
    alignItems: "center",
  },

  deletePressed: {
    opacity: 0.75,
  },

  deleteText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  logoutSection: {
  marginBottom: 22,
},

logoutCard: {
  backgroundColor: "#FFFDF7",
  borderRadius: 20,
  padding: 18,

  borderWidth: 1,
  borderColor: "#F2D27A",

  shadowColor: "#C58A16",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
},

logoutInfo: {
  marginBottom: 15,
},

logoutTitle: {
  fontSize: 17,
  fontWeight: "800",
  color: "#332A1A",
},

logoutDescription: {
  fontSize: 13,
  color: "#887858",
  marginTop: 4,
  lineHeight: 18,
},

logoutButton: {
  height: 46,
  borderRadius: 13,
  backgroundColor: "#FFF3D0",

  borderWidth: 1,
  borderColor: "#E4B84A",

  justifyContent: "center",
  alignItems: "center",
},

logoutPressed: {
  opacity: 0.7,
},

logoutText: {
  color: "#B87500",
  fontSize: 15,
  fontWeight: "800",
},

});