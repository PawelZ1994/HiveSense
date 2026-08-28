import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";

import Loading from "../components/Loading";

import { getDevices } from "../api/deviceApi";
import { getDeviceTemperatures } from "../api/temperatureApi";

import {
  getToken,
  removeToken,
} from "../storage/authStorage";

export default function DashboardScreen({
  navigation,
  route,
}) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [devices, setDevices] = useState([]);
  const [error, setError] = useState("");

  const [login, setLogin] = useState("");

  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // API KEY przekazany z LoginScreen
      if (route.params?.apiKey) {
        setApiKey(route.params.apiKey);
      }

      // Pobieramy JWT z telefonu
      const token = await getToken();

      if (!token) {
        throw new Error("Brak tokena JWT");
      }

      // Odczyt loginu z JWT
      const parts = token.split(".");

      if (parts.length !== 3) {
        throw new Error("Nieprawidłowy JWT");
      }

      const payload = parts[1];

      const decodedPayload = JSON.parse(
        decodeURIComponent(
          atob(payload)
            .split("")
            .map(
              (char) =>
                "%" +
                (
                  "00" +
                  char.charCodeAt(0).toString(16)
                ).slice(-2)
            )
            .join("")
        )
      );

      console.log("Dane JWT:", decodedPayload);

      setLogin(decodedPayload.login);

      // Pobieramy urządzenia
      const deviceData = await getDevices();

      console.log("Urządzenia:", deviceData);

      // Dzisiejsza data
      const today = new Date();

      const year = today.getFullYear();

      const month = String(
        today.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        today.getDate()
      ).padStart(2, "0");

      const todayString =
        `${year}-${month}-${day}`;

      // Ostatnia temperatura każdego urządzenia
      const devicesWithTemperature =
        await Promise.all(
          deviceData.map(
            async (device) => {
              try {
                const temperatures =
                  await getDeviceTemperatures(
                    device.id,
                    todayString
                  );

                if (
                  !temperatures ||
                  temperatures.length === 0
                ) {
                  return {
                    ...device,
                    lastTemperature: null,
                    lastMeasuredAt: null,
                  };
                }

                const last =
                  temperatures[
                    temperatures.length - 1
                  ];

                return {
                  ...device,
                  lastTemperature:
                    last.temperature,
                  lastMeasuredAt:
                    last.measuredAt,
                };
              } catch (error) {
                console.log(
                  `Błąd temperatur urządzenia ${device.id}:`,
                  error
                );

                return {
                  ...device,
                  lastTemperature: null,
                  lastMeasuredAt: null,
                };
              }
            }
          )
        );

      setDevices(
        devicesWithTemperature
      );

    } catch (error) {
      console.log(
        "BŁĄD DASHBOARD:",
        error
      );

      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ODŚWIEŻANIE
  // =========================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadDashboard();
    } finally {
      setRefreshing(false);
    }
  };

  // =========================
  // WYLOGOWANIE
  // =========================

  const handleLogout = async () => {
    await removeToken();

    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Login",
        },
      ],
    });
  };

  // =========================
  // FORMAT GODZINY
  // =========================

  const formatTime = (dateString) => {
    if (!dateString) {
      return "";
    }

    return new Date(
      dateString
    ).toLocaleTimeString(
      "pl-PL",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>

      {/* =========================
          GÓRNY NAGŁÓWEK
      ========================= */}

      <View style={styles.topBar}>

        <View>
          <Text style={styles.appName}>
            HiveSense 🐝
          </Text>

          <Text style={styles.appSubtitle}>
            Monitoring Twoich uli
          </Text>
        </View>

        {/* USTAWIENIA */}

        <Pressable
          style={({ pressed }) => [
            styles.settingsButton,
            pressed &&
              styles.settingsPressed,
          ]}
          onPress={() =>
            navigation.navigate("Settings")
          }
        >
          <Text style={styles.settingsIcon}>
            ⚙️
          </Text>
        </Pressable>

      </View>

      {/* =========================
          POWITANIE
      ========================= */}

      <View style={styles.welcomeContainer}>

        <Text style={styles.welcomeSmall}>
          Witaj 👋
        </Text>

        <Text style={styles.welcomeTitle}>
          {login}
        </Text>

        <Text style={styles.welcomeDescription}>
          Miło Cię widzieć!
          {"\n"}
          Sprawdź aktualny stan swoich uli. 🐝
        </Text>

        {/* API KEY */}

        {apiKey !== "" && (
          <Pressable
            onPress={() =>
              setShowApiKey(!showApiKey)
            }
          >
            <Text
              style={styles.apiKeyButtonText}
            >
              {showApiKey
                ? "Kliknij, aby ukryć Twój API Key"
                : "🔑 Kliknij, aby zobaczyć Twój API Key"}
            </Text>
          </Pressable>
        )}

        {showApiKey && (
          <View style={styles.apiKeyBox}>

            <Text style={styles.apiKeyLabel}>
              Twój API Key:
            </Text>

            <Text style={styles.apiKey}>
              {apiKey}
            </Text>

          </View>
        )}

      </View>

      {/* =========================
          TYTUŁ
      ========================= */}

      <View style={styles.titleContainer}>

        <Text style={styles.title}>
          🐝 Twoje urządzenia
        </Text>

        <Text style={styles.subtitle}>
          Aktualny stan Twoich uli
        </Text>

      </View>

      {/* =========================
          BŁĄD
      ========================= */}

      {error !== "" && (
        <View style={styles.errorBox}>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            onPress={loadDashboard}
          >
            <Text style={styles.retryText}>
              Spróbuj ponownie
            </Text>
          </Pressable>

        </View>
      )}

      {/* =========================
          BRAK URZĄDZEŃ
      ========================= */}

      {devices.length === 0 &&
      error === "" ? (

        <View style={styles.emptyContainer}>

          <Text style={styles.emptyIcon}>
            🌡️
          </Text>

          <Text style={styles.emptyTitle}>
            Brak urządzeń
          </Text>

          <Text style={styles.emptyText}>
            Nie masz jeszcze żadnych
            urządzeń przypisanych do konta.
          </Text>

        </View>

      ) : (

        <FlatList
          data={devices}

          keyExtractor={(item) =>
            item.id.toString()
          }

          showsVerticalScrollIndicator={false}

          contentContainerStyle={
            styles.listContent
          }

          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }

          renderItem={({ item }) => (

            <Pressable
              style={({ pressed }) => [
                styles.deviceCard,
                pressed &&
                  styles.devicePressed,
              ]}
              onPress={() =>
                navigation.navigate(
                  "Device",
                  {
                    deviceId: item.id,
                    deviceName:
                      item.deviceName,
                  }
                )
              }
            >

              {/* GÓRA KARTY */}

              <View style={styles.deviceHeader}>

                <View style={styles.deviceIcon}>

                  <Text
                    style={
                      styles.deviceIconText
                    }
                  >
                    🌡️
                  </Text>

                </View>

                <View style={styles.deviceInfo}>

                  <Text
                    style={styles.deviceName}
                  >
                    {item.deviceName}
                  </Text>

                </View>

                <Text style={styles.arrow}>
                  ›
                </Text>

              </View>

              {/* TEMPERATURA */}

              <View
                style={
                  styles.temperatureContainer
                }
              >

                {item.lastTemperature !== null ? (

                  <>
                    <Text
                      style={styles.temperature}
                    >
                      {item.lastTemperature}

                      <Text
                        style={styles.degree}
                      >
                        °C
                      </Text>
                    </Text>

                    <View
                      style={styles.statusRow}
                    >

                      <View
                        style={styles.statusDot}
                      />

                      <Text
                        style={styles.statusText}
                      >
                        Ostatni pomiar{" "}
                        {formatTime(
                          item.lastMeasuredAt
                        )}
                      </Text>

                    </View>
                  </>

                ) : (

                  <Text
                    style={
                      styles.noTemperature
                    }
                  >
                    Brak dzisiejszych pomiarów
                  </Text>

                )}

              </View>

            </Pressable>
          )}
        />

      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  // =========================
  // TOP BAR
  // =========================

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  appName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2B210F",
  },

  appSubtitle: {
    fontSize: 12,
    color: "#947C55",
    marginTop: 2,
  },

  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#FFFDF7",
    borderWidth: 1,
    borderColor: "#F2D27A",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#C58A16",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  settingsPressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  settingsIcon: {
    fontSize: 23,
  },

  // =========================
  // POWITANIE
  // =========================

  welcomeContainer: {
    marginTop: 5,
    marginBottom: 28,
  },

  welcomeSmall: {
    fontSize: 18,
    color: "#A66A00",
    fontWeight: "600",
    marginBottom: 4,
  },

  welcomeTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#2B210F",
  },

  welcomeDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#806B4A",
    marginTop: 8,
  },

  // =========================
  // API KEY
  // =========================

  apiKeyButtonText: {
    fontSize: 14,
    color: "#D88900",
    fontWeight: "600",
    marginTop: 16,
    textDecorationLine: "underline",
  },

  apiKeyBox: {
    marginTop: 12,
    padding: 14,
    backgroundColor: "#FFFDF7",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F4C95D",
  },

  apiKeyLabel: {
    fontSize: 14,
    color: "#99752F",
    marginBottom: 3,
    fontWeight: "600",
  },

  apiKey: {
    fontSize: 15,
    color: "#332A1A",
  },

  // =========================
  // TYTUŁ
  // =========================

  titleContainer: {
    marginBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#2B210F",
  },

  subtitle: {
    fontSize: 14,
    color: "#8A7657",
    marginTop: 5,
  },

  // =========================
  // LISTA
  // =========================

  listContent: {
    paddingBottom: 20,
  },

  // =========================
  // KARTA
  // =========================

  deviceCard: {
    backgroundColor: "#FFFDF7",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F4D27A",

    shadowColor: "#C58A16",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },

  devicePressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  deviceHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  deviceIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#FFF0C2",
    justifyContent: "center",
    alignItems: "center",
  },

  deviceIconText: {
    fontSize: 25,
  },

  deviceInfo: {
    flex: 1,
    marginLeft: 14,
  },

  deviceName: {
    fontSize: 19,
    fontWeight: "800",
    color: "#302512",
  },

  arrow: {
    fontSize: 32,
    color: "#D89A22",
    marginLeft: 10,
  },

  // =========================
  // TEMPERATURA
  // =========================

  temperatureContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1DEAE",
  },

  temperature: {
    fontSize: 44,
    fontWeight: "800",
    color: "#D67B00",
  },

  degree: {
    fontSize: 22,
    fontWeight: "600",
    color: "#D67B00",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#48A868",
    marginRight: 7,
  },

  statusText: {
    fontSize: 13,
    color: "#7D715E",
  },

  noTemperature: {
    fontSize: 15,
    color: "#A3947D",
  },

  // =========================
  // BRAK URZĄDZEŃ
  // =========================

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 52,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2B210F",
  },

  emptyText: {
    textAlign: "center",
    color: "#887858",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  // =========================
  // BŁĄD
  // =========================

  errorBox: {
    backgroundColor: "#FFF0EE",
    borderRadius: 14,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F3B6AD",
  },

  errorText: {
    color: "#C62828",
    fontSize: 14,
  },

  retryText: {
    color: "#C62828",
    fontWeight: "700",
    marginTop: 8,
  },
});