import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Minus, Plus } from "phosphor-react-native";
import { Calendar, DateData } from "react-native-calendars";
import { differenceInDays } from "date-fns";

export default function SelectDate() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const property = params.property ? JSON.parse(params.property as string) : {};

  // Estados
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);
  const [markedDates, setMarkedDates] = useState<any>({});

  // Lógica do Calendário
  const onDayPress = (day: DateData) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
      setMarkedDates({
        [day.dateString]: { startingDay: true, color: '#1ab65c', textColor: 'white' }
      });
    } else {
      // Selecionando data final
      if (day.dateString < startDate) {
        setStartDate(day.dateString); // Corrigir se clicou antes
      } else {
        setEndDate(day.dateString);
        
        // Preencher o meio visualmente
        let range: any = { ...markedDates };
        let current = new Date(startDate);
        let stop = new Date(day.dateString);
        
        while (current <= stop) {
          const dateStr = current.toISOString().split('T')[0];
          if (dateStr === startDate) {
             range[dateStr] = { startingDay: true, color: '#1ab65c', textColor: 'white' };
          } else if (dateStr === day.dateString) {
             range[dateStr] = { endingDay: true, color: '#1ab65c', textColor: 'white' };
          } else {
             range[dateStr] = { color: 'rgba(26, 182, 92, 0.2)', textColor: '#f4f4f4' };
          }
          current.setDate(current.getDate() + 1);
        }
        setMarkedDates(range);
      }
    }
  };

  // Cálculos
  const nights = (startDate && endDate) ? differenceInDays(new Date(endDate), new Date(startDate)) : 0;
  const totalPrice = nights * (property.price || 0);

  const handleContinue = () => {
    if (!startDate || !endDate) {
      Alert.alert("Atenção", "Selecione as datas de entrada e saída.");
      return;
    }

    const nextStepData = {
      property,
      reservation: {
        checkIn: startDate,
        checkOut: endDate,
        nights,
        guests,
        totalPrice
      }
    };

    router.push({
      pathname: "/stacks/nameReservation",
      params: { data: JSON.stringify(nextStepData) }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#f4f4f4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Date</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendário */}
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={onDayPress}
            markingType={'period'}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#1f222a',
              calendarBackground: '#1f222a',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#1ab65c',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#1ab65c',
              dayTextColor: '#f4f4f4',
              textDisabledColor: '#444',
              monthTextColor: '#f4f4f4',
              arrowColor: '#1ab65c',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14
            }}
          />
        </View>

        {/* Resumo Datas */}
        <View style={styles.datesRow}>
          <View style={styles.dateInfo}>
            <Text style={styles.label}>Check in</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{startDate || "--/--/--"}</Text>
            </View>
          </View>
          <View style={styles.arrowContainer}>
             <ArrowLeft size={20} color="#757575" style={{ transform: [{ rotate: '180deg' }]}} />
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.label}>Check out</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{endDate || "--/--/--"}</Text>
            </View>
          </View>
        </View>

        {/* Hóspedes */}
        <Text style={styles.sectionTitle}>Guest</Text>
        <View style={styles.guestContainer}>
          <TouchableOpacity 
            style={styles.guestButton}
            onPress={() => setGuests(Math.max(1, guests - 1))}
          >
            <Minus size={24} color="#1ab65c" />
          </TouchableOpacity>
          
          <Text style={styles.guestCount}>{guests}</Text>
          
          <TouchableOpacity 
            style={styles.guestButton}
            onPress={() => setGuests(guests + 1)}
          >
            <Plus size={24} color="#1ab65c" />
          </TouchableOpacity>
        </View>

        <Text style={styles.totalText}>Total: ${totalPrice}</Text>

      </ScrollView>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181a20",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f4f4f4",
  },
  calendarContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  datesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  dateInfo: {
    flex: 1,
  },
  label: {
    color: "#f4f4f4",
    marginBottom: 8,
    fontWeight: "bold",
  },
  dateBox: {
    backgroundColor: "#1f222a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  dateText: {
    color: "#f4f4f4",
    fontWeight: "bold",
  },
  arrowContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f4f4f4",
    marginBottom: 16,
  },
  guestContainer: {
    backgroundColor: "#1f222a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 16,
    marginBottom: 30,
    gap: 20,
  },
  guestButton: {
    backgroundColor: "rgba(26, 182, 92, 0.1)",
    padding: 12,
    borderRadius: 12,
  },
  guestCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f4f4f4",
  },
  totalText: {
    textAlign: "center",
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#1ab65c",
    height: 56,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});