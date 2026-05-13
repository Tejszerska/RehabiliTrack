import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types"; 
import { Avatar, Button, Divider, List, Surface, Text, useTheme, IconButton } from "react-native-paper";
import { useAppointments } from "../../context/AppointmentsContext";
import apiService from '../../api/apiService';
import { AppointmentDetails } from "../../types/models";

type Props = NativeStackScreenProps<RootStackParamList, 'AppointmentDetails'>;

const AppointmentDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { appointmentId } = route.params;
  const theme = useTheme();

  const { deleteAppointment } = useAppointments(); 
  
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const data = await apiService.getAppointment(appointmentId);
        setAppointment(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Alert.alert('Error', 'Could not fetch appointment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();

    // REFRESHING AFTER UDATE:
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAppointmentData();
    });    
    return unsubscribe;

  }, [appointmentId, navigation]);

  // Icons defined once to improve performance 
  const renderPhoneIcon = useCallback((props: any) => <List.Icon {...props} icon="phone" />, []);
  const renderNotesIcon = useCallback((props: any) => <List.Icon {...props} icon="notebook-outline" />, []);
  const renderTreatmentIcon = useCallback((props: any) => <List.Icon {...props} icon="medical-bag" />, []);
  const renderRoomIcon = useCallback((props: any) => <List.Icon {...props} icon="door" />, []);
  const renderTherapistIcon = useCallback((props: any) => <List.Icon {...props} icon="account-tie" />, []);
  const renderStayIcon = useCallback((props: any) => <List.Icon {...props} icon="bed" />, []);

  const handleDelete = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this appointment? This operation cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive', // special style on IOS
          onPress: async () => {
            try {
              await deleteAppointment(appointmentId);
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'The appointment could not be removed.');
            }
          }
        }
      ]
    );
  };

  // time formatter
  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return '--';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.centerBox}><Text>Appointment not found!</Text></View>
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

     {/* HEADER : Patient Name & Date/Status */}
        <View style={styles.headerRow}>
          
          <Avatar.Icon 
            size={64}
            icon="calendar-clock" 
            style={{ backgroundColor: theme.colors.surface }}
            color={theme.colors.primary}
          />

          <View style={styles.headerTextInfo}>
            <Text variant="headlineSmall" style={styles.userName}>
              {appointment.patient?.fullName || 'Unknown Patient'}
            </Text>
            <Text variant="bodyMedium" style={styles.userPesel}>
              {formatDateTime(appointment.startDateTime)} | {appointment.status}
            </Text>
          </View>

        </View>
      </Surface>

      {/* TREATMENT & LOCATION SECTION */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          Treatment & Location
        </Text>
        <List.Item
          title={appointment.treatment?.name || 'Unknown Treatment'}
          description={`Duration: ${appointment.treatment?.durationMinutes || '--'} min`}
          left={renderTreatmentIcon}
        />
        <Divider />
        <List.Item
          title={`${appointment.room?.name || 'Unknown'} (Room ${appointment.room?.number || '-'})`}
          description={`Type: ${appointment.room?.typeName || 'Unknown'}`}
          left={renderRoomIcon}
        />
      </View>

      {/* THERAPIST SECTION */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          Therapist
        </Text>
        <List.Item
          title={appointment.therapist?.fullName || 'Unknown'}
          description={`Role: ${appointment.therapist?.roleName || 'Unknown'}`}
          left={renderTherapistIcon}
        />
      </View>

      {/* PATIENT ADDITIONAL INFO */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          Patient Info
        </Text>
        <List.Item
          title={appointment.patient?.phoneNumber || 'No phone provided'}
          left={renderPhoneIcon}
        />
        <Divider />
        <List.Item
          title={appointment.patient?.notes || 'No medical notes available.'}
          left={renderNotesIcon}
          descriptionNumberOfLines={5}
        />
        
        {/* STAY */}
        {appointment.stay?.name && (
          <>
            <Divider />
            <List.Item
              title={`Enrolled in: ${appointment.stay.name}`}
              left={renderStayIcon}
            />
          </>
        )}
        
        {/* ACTIONS */}
        <Button 
          mode="contained" 
          icon="calendar-edit" 
          onPress={() => navigation.navigate('EditAppointment', { appointmentId: appointmentId })}
          style={styles.actionButton} 
        >
          Edit Appointment
        </Button>
        
        <Button 
          mode="outlined"
          icon="delete" 
          onPress={handleDelete}
          textColor={theme.colors.error}         
          style={styles.actionButton}
        >
          Cancel/Delete Appointment
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
    paddingTop: 50, 
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
  },
  headerTextInfo: {
    marginLeft: 15,
    flex: 1,
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
    paddingBottom: 0,
  },
  sectionTitle: {
    marginBottom: 5,
  },
  actionButton: {
    marginTop: 15,
  },
});

export default AppointmentDetailsScreen;