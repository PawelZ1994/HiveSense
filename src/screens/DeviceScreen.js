import React, { useState } from 'react'

import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'
import TemperatureChart from '../components/TemperatureChart'

export default function DeviceScreen({ route }) {
	const { deviceId, deviceName } = route.params

	const [date, setDate] = useState(new Date())
	const [showDatePicker, setShowDatePicker] = useState(false)

	// =========================
	// FORMATOWANIE DATY
	// =========================

	const formatDate = date => {
		return date.toLocaleDateString('pl-PL', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
	}

	// =========================
	// ZMIANA DATY
	// =========================

	const handleDateChange = (event, selectedDate) => {
		setShowDatePicker(false)

		if (selectedDate) {
			setDate(selectedDate)
		}
	}

	return (
		<View style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
				{/* =========================
            NAGŁÓWEK
        ========================= */}

				<View style={styles.header}>
					<Text style={styles.smallTitle}>Twoje urządzenie 🐝</Text>

					<Text style={styles.deviceName}>{deviceName}</Text>

					<Text style={styles.description}>
						Sprawdź historię temperatury
						{'\n'}w wybranym dniu.
					</Text>
				</View>

				{/* =========================
            HISTORIA
        ========================= */}

				<View style={styles.dateSection}>
					<Text style={styles.dateTitle}>Historia temperatury</Text>

					<Text style={styles.dateSubtitle}>Wybierz dzień, który chcesz sprawdzić</Text>

					{/* =========================
              PRZYCISK DATY
          ========================= */}

					<Pressable
						style={({ pressed }) => [styles.dateButton, pressed && styles.dateButtonPressed]}
						onPress={() => setShowDatePicker(true)}>
						<View style={styles.calendarContainer}>
							<Text style={styles.calendarIcon}>📅</Text>
						</View>

						<View style={styles.dateInfo}>
							<Text style={styles.dateLabel}>WYBRANY DZIEŃ</Text>

							<Text style={styles.dateText}>{formatDate(date)}</Text>
						</View>

						<Text style={styles.arrow}>›</Text>
					</Pressable>
				</View>

				{/* =========================
            DATE PICKER
        ========================= */}

				{showDatePicker && <DateTimePicker value={date} mode='date' display='default' onChange={handleDateChange} />}

				{/* =========================
            WYKRES
        ========================= */}

				<View style={styles.chartContainer}>
					<Text style={styles.chartTitle}>Wykres temperatury</Text>

					<TemperatureChart deviceId={deviceId} date={date} />
				</View>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	// =========================
	// GŁÓWNY KONTENER
	// =========================

	container: {
		flex: 1,
		backgroundColor: '#FFF8E7',
	},

	scrollContent: {
		paddingHorizontal: 20,
		paddingTop: 55,
		paddingBottom: 50,
	},

	// =========================
	// HEADER
	// =========================

	header: {
		marginBottom: 30,
	},

	smallTitle: {
		fontSize: 16,
		color: '#947C55',
		marginBottom: 5,
	},

	deviceName: {
		fontSize: 34,
		fontWeight: '800',
		color: '#2B210F',
	},

	deviceId: {
		fontSize: 13,
		color: '#A99A7D',
		marginTop: 4,
	},

	description: {
		fontSize: 15,
		lineHeight: 21,
		color: '#887858',
		marginTop: 10,
	},

	// =========================
	// HISTORIA
	// =========================

	dateSection: {
		marginBottom: 25,
	},

	dateTitle: {
		fontSize: 23,
		fontWeight: '800',
		color: '#2B210F',
	},

	dateSubtitle: {
		fontSize: 14,
		color: '#887858',
		marginTop: 4,
		marginBottom: 14,
	},

	// =========================
	// PRZYCISK DATY
	// =========================

	dateButton: {
		backgroundColor: '#FFFDF7',
		borderRadius: 20,

		padding: 15,

		flexDirection: 'row',
		alignItems: 'center',

		borderWidth: 1,
		borderColor: '#F2D27A',

		shadowColor: '#C58A16',

		shadowOffset: {
			width: 0,
			height: 4,
		},

		shadowOpacity: 0.1,
		shadowRadius: 8,

		elevation: 3,
	},

	dateButtonPressed: {
		opacity: 0.75,

		transform: [
			{
				scale: 0.98,
			},
		],
	},

	calendarContainer: {
		width: 50,
		height: 50,

		borderRadius: 15,

		backgroundColor: '#FFF3C4',

		justifyContent: 'center',
		alignItems: 'center',

		marginRight: 14,
	},

	calendarIcon: {
		fontSize: 25,
	},

	dateInfo: {
		flex: 1,
	},

	dateLabel: {
		fontSize: 11,
		fontWeight: '700',
		color: '#A68A50',
		letterSpacing: 0.5,
	},

	dateText: {
		fontSize: 18,
		fontWeight: '800',
		color: '#2B210F',
		marginTop: 3,
	},

	arrow: {
		fontSize: 32,
		color: '#D88900',
		marginLeft: 10,
	},

	// =========================
	// WYKRES
	// =========================

	chartContainer: {
		backgroundColor: '#FFFDF7',

		borderRadius: 24,

		padding: 18,

		borderWidth: 1,
		borderColor: '#F2D27A',

		shadowColor: '#C58A16',

		shadowOffset: {
			width: 0,
			height: 5,
		},

		shadowOpacity: 0.1,
		shadowRadius: 10,

		elevation: 4,

		marginBottom: 20,
	},

	chartTitle: {
		fontSize: 20,
		fontWeight: '800',
		color: '#2B210F',
		marginBottom: 10,
	},
})
