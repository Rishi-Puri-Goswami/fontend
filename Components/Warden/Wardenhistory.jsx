import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const students = [
  {
    name: 'Rishi goswami',
    phoneNo: '9116789845',
    roomNo: '4312',
    destination: 'market',
    leaveTime: '10:00 AM',
    returnTime: '6:00 PM',
  },
  {
    name: 'Anaya Sharma',
    phoneNo: '9876543210',
    roomNo: '4210',
    destination: 'Delhi',
    leaveTime: '9:30 AM',
    returnTime: '5:00 PM',
  },
  {
    name: 'Mohit Verma',
    phoneNo: '9898989898',
    roomNo: '4102',
    destination: 'Mumbai',
    leaveTime: '11:00 AM',
    returnTime: '7:00 PM',
  },
];


const StudentCard = ({ student }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Student's History</Text>
    <View style={styles.divider} />

    <View style={styles.infoRow}>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{student.name}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.label}>Phone:</Text>
      <Text style={styles.value}>{student.phoneNo}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.label}>Room No:</Text>
      <Text style={styles.value}>{student.roomNo}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.label}>Destination:</Text>
      <Text style={styles.value}>{student.destination}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.label}>Leave Time:</Text>
      <Text style={styles.value}>{student.leaveTime}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.label}>Return Time:</Text>
      <Text style={styles.value}>{student.returnTime}</Text>
    </View>
  </View>
);

const Wardenhistory = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Background */}
      <View style={styles.backgroundLayer} />

      {/* Header right under status bar */}
      <View style={styles.menuBar}>
        <Text style={styles.menuTitle}>History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {students.map((student, index) => (
          <StudentCard key={index} student={student} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  backgroundLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#404040',
    transform: [{ rotate: '45deg' }],
  },
  menuBar: {
    paddingHorizontal: 20,
    paddingBottom: 8, // slight space below
  },
  menuTitle: {
    color: '#facc15',
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#facc15',
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    color: '#9ca3af',
    fontWeight: 'bold',
    width: 120,
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontSize: 14,
    flexShrink: 1,
  },
});

export default Wardenhistory;
