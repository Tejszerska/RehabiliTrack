import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types"; 
import { Avatar, Button, Divider, List, Surface, Text, useTheme, IconButton } from "react-native-paper";
import { useStays } from "../../context/StaysContext";
import apiService from '../../api/apiService';
import { StayDetails } from "../../types/models";

type Props = NativeStackScreenProps<RootStackParamList, 'StayDetails'>;

const StayDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { stayId } = route.params;
  const theme = useTheme();

  const { deleteStay } = useStays(); 
  
  const [stay, setStay] = useState<StayDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStayData = async () => {
      try {
        const data = await apiService.getStay(stayId); // Assuming you have getStay in apiService
        setStay(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Alert.alert('Error', 'Could not fetch stay details.');
      } finally {
        setLoading(false);
      }
    };

    fetchStayData();

    // REFRESHING AFTER UDATE:
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStayData();
    });    
    return unsubscribe;
    
  }, [stayId, navigation]);

  // Icons defined once to improve performance 
  const renderCapacityIcon = useCallback((props: any) => <List.Icon {...props} icon="account-group" />, []);
  const renderPatientIcon = useCallback((props: any) => <List.Icon {...props} icon="account" />, []);
  const renderChevronIcon = useCallback((props: any) => <List.Icon {...props} icon="chevron-right" />, []);

  const handleDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this stay? This operation cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStay(stayId);
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'The stay could not be removed.');
            }
          }
        }
      ]
    );
  };

  // Helper to format dates
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!stay) {
    return (
      <View style={styles.centerBox}><Text>Stay not found!</Text></View>
    );
  }

  const isFull = stay.occupancy >= stay.maxCapacity;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} >
      
      {/* HEADER BLOCK */}
      <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <IconButton
          icon="arrow-left"
          iconColor={theme.colors.onPrimary}
          size={28}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />

        <View style={styles.headerRow}>
          <Avatar.Icon 
            size={64}
            icon="calendar-range" 
            style={{ backgroundColor: theme.colors.surface }}
            color={theme.colors.primary}
          />

          <View style={styles.headerTextInfo}>
            <Text variant="headlineSmall" style={styles.titleName}>
              {stay.name}
            </Text>
            <Text variant="bodyMedium" style={styles.dateSubtitle}>
              {formatDate(stay.startDate)}  -  {formatDate(stay.endDate)}
            </Text>
          </View>
        </View>
      </Surface>

      {/* STAY DETAILS SECTION */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          Stay Information
        </Text>
        <List.Item
          title={`Occupancy: ${stay.occupancy} / ${stay.maxCapacity}`}
          description={isFull ? "This stay is currently at full capacity." : "Seats are still available."}
          left={renderCapacityIcon}
          titleStyle={isFull ? { color: theme.colors.error, fontWeight: 'bold' } : {}}
        />
      </View>

      {/* ENROLLED PATIENTS SECTION */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          Enrolled Patients ({stay.patients?.length || 0})
        </Text>
        
        {stay.patients && stay.patients.length > 0 ? (
          stay.patients.map((patient, index) => (
            <React.Fragment key={patient.stayParticipationId}>
              <List.Item
                title={patient.patientFullName}
                description={`Patient ID: ${patient.patientId}`}
                left={renderPatientIcon}
                right={renderChevronIcon}
                onPress={() => navigation.navigate('PatientDetails', { patientId: patient.patientId })}
                style={styles.listItemNoPadding} 
              />
              {index < stay.patients.length - 1 && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <Text style={styles.noDataText}>No patients are enrolled in this stay yet.</Text>
        )}
      </View>

      {/* ACTIONS SECTION */}
      <View style={[styles.section, styles.actionsSection]}>
        <Button 
          mode="contained" 
          icon="calendar-edit" 
          onPress={() => navigation.navigate('EditStay', { stayId: stayId })}
          style={styles.actionButton} 
        >
          Edit Stay Info
        </Button>
        
        <Button 
          mode="outlined"
          icon="delete" 
          onPress={handleDelete}
          textColor={theme.colors.error}         
          style={styles.actionButton}
        >
          Delete Stay
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
  },
  headerTextInfo: {
    marginLeft: 15,
    flex: 1, 
  },
  titleName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dateSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2, 
  },
  section: {
    padding: 20,
    paddingBottom: 5, 
  },
  sectionTitle: {
    marginBottom: 5,
  },
  listItemNoPadding: {
    paddingHorizontal: 0,
  },
  noDataText: {
    marginVertical: 10, 
    color: '#666',
    fontStyle: 'italic',
  },
  actionsSection: {
    marginTop: 10,
    paddingBottom: 40,
  },
  actionButton: {
    marginBottom: 15,
  },
});

export default StayDetailsScreen;