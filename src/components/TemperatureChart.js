import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getDeviceTemperatures } from "../api/temperatureApi";

const screenWidth = Dimensions.get("window").width;

export default function TemperatureChart({ deviceId, date }) {
  const [temperatures, setTemperatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTemperatures();
  }, [deviceId, date]);

  const loadTemperatures = async () => {
    try {
      setLoading(true);
      setError("");

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const dateString = `${year}-${month}-${day}`;

      const data = await getDeviceTemperatures(
        deviceId,
        dateString
      );

      setTemperatures(data || []);
    } catch (err) {
      console.log("Błąd pobierania temperatur:", err);
      setError("Nie udało się pobrać temperatur.");
    } finally {
      setLoading(false);
    }
  };

  // Format godziny bez sekund
  const formatTime = (dateString) => {
    if (!dateString) {
      return "";
    }

    return new Date(dateString).toLocaleTimeString(
      "pl-PL",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Ładowanie wykresu...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.error}>
          {error}
        </Text>
      </View>
    );
  }

  if (temperatures.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Brak pomiarów dla wybranego dnia.
        </Text>
      </View>
    );
  }

  /*
   * Ograniczamy liczbę opisów na osi X.
   * Wszystkie punkty nadal zostają na wykresie.
   */
  const maxLabels = 6;

  const step = Math.ceil(
    temperatures.length / maxLabels
  );

  const labels = temperatures.map((item, index) => {
    if (
      index % step === 0 ||
      index === temperatures.length - 1
    ) {
      return formatTime(item.measuredAt);
    }

    return "";
  });

  const values = temperatures.map((item) =>
    Number(item.temperature)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Temperatura
      </Text>

      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: values,
            },
          ],
        }}
        width={screenWidth - 40}
        height={280}
        yAxisSuffix="°C"
        yAxisInterval={1}
        fromZero={false}
        bezier
        withDots={false}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={true}
        decimalPlaces={1}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",

          decimalPlaces: 1,

          color: (opacity = 1) =>
            `rgba(40, 40, 40, ${opacity})`,

          labelColor: (opacity = 1) =>
            `rgba(100, 100, 100, ${opacity})`,

          propsForDots: {
            r: "3",
            strokeWidth: "1",
          },

          propsForBackgroundLines: {
            strokeDasharray: "",
          },
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingTop: 18,
    paddingBottom: 12,
    marginVertical: 10,
    overflow: "hidden",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginLeft: 18,
    marginBottom: 5,
  },

  chart: {
    marginLeft: -10,
    borderRadius: 18,
  },

  messageContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 25,
    marginVertical: 10,
    alignItems: "center",
  },

  message: {
    color: "#777",
    fontSize: 15,
  },

  error: {
    color: "#c62828",
    fontSize: 15,
  },
});