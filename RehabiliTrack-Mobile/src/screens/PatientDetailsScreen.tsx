import React from 'react';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Patient } from "../types/models";
import { Avatar, Button, Divider, List, Surface, Text, useTheme, IconButton } from "react-native-paper";
import { ScrollView, View, StyleSheet, Platform } from "react-native";

// W przyszłości przenieś MOCK_PATIENTS do osobnego pliku, żeby nie duplikować!
const MOCK_PATIENTS: Patient[] = [
  { id: 1, firstName: 'Jan', lastName: 'Kowalski', pesel: '85010112345', phoneNumber: '500 600 700', createdAt: '', updatedAt: '', isActive: true },
  { id: 2, firstName: 'Anna', lastName: 'Nowak', pesel: '92020254321', createdAt: '', updatedAt: '', isActive: true },
  { id: 3, firstName: 'Marek', lastName: 'Zieliński', pesel: '70101099887', phoneNumber: '111 222 333', createdAt: '', updatedAt: '', isActive: true },
];

type Props = NativeStackScreenProps<RootStackParamList, 'PatientDetails'>;

const PatientDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { patientId } = route.params;
  const theme = useTheme();

  const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    
  if (!patient) {
    return (
      <View style={styles.centerBox}><Text>Patient not found!</Text></View>
    );
  }

  // mock of Stays assigned for this patient
  const patientStays = [
    { id: 'sp1', stayName: 'Autumn Stay 2026', status: 'Active' },
    { id: 'sp2', stayName: 'Winter Post-Op 2025', status: 'Completed' },
  ];

  return (
    // top green block
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} >
      
    {/* go back arrow */}
      <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <IconButton
          icon="arrow-left"
          iconColor={theme.colors.onPrimary}
          size={28}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />

     {/* HEADER : name & PESEL */}
        <View style={styles.headerRow}>
          
          <Avatar.Text 
            size={64}
            label={`${patient.firstName[0]}${patient.lastName[0]}`} 
            style={{ backgroundColor: theme.colors.surface }}
            color={theme.colors.primary}
          />

          <View style={styles.headerTextInfo}>
            <Text variant="headlineSmall" style={styles.userName}>
              {patient.firstName} {patient.lastName}
            </Text>
            <Text variant="bodyMedium" style={styles.userPesel}>
              PESEL: {patient.pesel}
            </Text>
          </View>

        </View>
      </Surface>

      {/* REST OF PATIENT INFO */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={{ color: theme.colors.primary, marginBottom: 10 }}>
          Details
        </Text>
        <List.Item
          title={patient.phoneNumber || 'Not provided'}
          left={props => <List.Icon {...props} icon="phone" />}
        />
        <Divider />
        <List.Item
          title={patient.notes || 'No medical notes available.'}
          left={props => <List.Icon {...props} icon="notebook-outline" />}
          descriptionNumberOfLines={5}
        />

        <Button 
          mode="contained" 
          icon="notebook-edit-outline" 
          onPress={() => {}} // NAVIGATE EDIT PATIENT
          style={{ marginTop: 15 }}
        >
          Edit Patient's Info
        </Button>

      </View>

      {/* STAYS ASSIGNED FOR THIS PATIENT */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={{ color: theme.colors.primary, marginBottom: 10 }}>
          Assigned Stays (Participations)
        </Text>
        {patientStays.map((stay) => (
          <List.Item
            key={stay.id}
            title={stay.stayName}
            description={`Status: ${stay.status}`}
            left={props => <List.Icon {...props} icon="calendar" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* NAVIGATE TO STAY DETAILS */}}
            style={{ paddingLeft: 0 }}
          />
        ))}
        
        <Button 
          mode="contained" 
          icon="calendar-plus" 
          onPress={() => {}} // NAVIGATE ADD STAY
          style={{ marginTop: 15 }}
        >
          Enroll in a New Stay
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    paddingTop: 40, 
    paddingBottom: 25,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40, 
    left: 10,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35, 
    paddingHorizontal: 20, 
    justifyContent: 'center', 
  },
  headerTextInfo: {
    marginLeft: 15,
  },
  
  userName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userPesel: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2, 
  },
  section: {
    padding: 20,
 },
});

export default PatientDetailsScreen;