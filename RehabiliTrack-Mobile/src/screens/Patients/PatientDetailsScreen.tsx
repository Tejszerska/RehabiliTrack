import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types"; 
import { Avatar, Button, Divider, List, Surface, Text, useTheme, IconButton } from "react-native-paper";
import { usePatients } from "../../context/PatientsContext";
import apiService from '../../api/apiService';
import { PatientDetails } from "../../types/models";

type Props = NativeStackScreenProps<RootStackParamList, 'PatientDetails'>;

const PatientDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { patientId } = route.params;
  const theme = useTheme();

  const { deletePatient } = usePatients(); 
  
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true); 
        const data = await apiService.getPatient(patientId);
        setPatient(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Alert.alert('Error', 'Could not fetch patient details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();

    // REFRESHING AFTER UDATE:
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPatientData();
    });    
    return unsubscribe;

  }, [patientId, navigation]);

  // Icons defined once improve performence 
  const renderPhoneIcon = useCallback((props: any) => <List.Icon {...props} icon="phone" />, []);
  const renderNotesIcon = useCallback((props: any) => <List.Icon {...props} icon="notebook-outline" />, []);
  const renderCalendarIcon = useCallback((props: any) => <List.Icon {...props} icon="calendar" />, []);
  const renderChevronIcon = useCallback((props: any) => <List.Icon {...props} icon="chevron-right" />, []);

  const handleDelete = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this patient? This operation cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive', // special style on IOS
          onPress: async () => {
            try {
              await deletePatient(patientId);
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'The patient could not be removed.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.centerBox}><Text>Patient not found!</Text></View>
    );
  }

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
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
        Details
        </Text>
        <List.Item
          title={patient.phoneNumber || 'Not provided'}
          left={renderPhoneIcon}
        />
        <Divider />
        <List.Item
          title={patient.notes || 'No medical notes available.'}
          left={renderNotesIcon}
          descriptionNumberOfLines={5}
        />

        <Button 
          mode="contained" 
          icon="notebook-edit-outline" 
          onPress={() => navigation.navigate('EditPatient', { patientId: patientId })}
          style={styles.actionButton} 
        >
          Edit Patient's Info
        </Button>
      </View>

      {/* STAYS ASSIGNED FOR THIS PATIENT */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Assigned Stays (Participations)
        </Text>
        {patient.stays && patient.stays.length > 0 ? (
          patient.stays.map((stay) => {
            const endDateObj = new Date(stay.endDate);
            const isCompleted = new Date() > endDateObj;

            return (
              <List.Item
                key={stay.stayId}
                title={stay.stayName}
                description={`${new Date(stay.startDate).toLocaleDateString()} - ${endDateObj.toLocaleDateString()} (${isCompleted ? 'Completed' : 'Active'})`}
                left={renderCalendarIcon} 
                right={renderChevronIcon} 
                onPress={() => {/* NAVIGATE TO STAY DETAILS  */}}
                style={styles.listItemNoPadding} 
              />
            );
          })
        ) : (
          <Text style={styles.noStays}>No stays assigned.</Text>
        )}
        
        <Button 
          mode="contained" 
          icon="calendar-plus" 
          onPress={() => {}} 
          style={styles.actionButton}
        >
          Enroll in a New Stay
        </Button>
        <Button 
          mode="outlined"
          icon="delete" 
          onPress={handleDelete}
          textColor={theme.colors.error}          
          style={styles.actionButton}
        >
          Delete Patient
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
  sectionTitle: {
    marginBottom: 10,
  },
  actionButton: {
    marginTop: 15,
  },
  listItemNoPadding: {
    paddingLeft: 0,
  },
  noStays: {
    marginVertical: 10, 
    color: '#666'
  }
});

export default PatientDetailsScreen;