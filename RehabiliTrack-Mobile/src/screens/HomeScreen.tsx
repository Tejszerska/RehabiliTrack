import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, useTheme, IconButton, Button, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useStays } from '../context/StaysContext';
import apiService from '../api/apiService'; // <-- Dodany import serwisu

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const { logout, role } = useAuth();
  
  const { initStays, currentStays, loading: staysLoading } = useStays();

  // useState for statitics
  const [patientCount, setPatientCount] = useState<number | string>('-');
  const [todayTherapiesCount, setTodayTherapiesCount] = useState<number | string>('-');
  const [statsLoading, setStatsLoading] = useState(true);

  // getting statistics
  const fetchDashboardStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      
      // patients
      const patients = await apiService.getPatients();
      setPatientCount(patients.length);

      // today appointments
      const appointments = await apiService.getAppointments();
      const today = new Date();
      
      const todayCount = appointments.filter(app => {
        const appDateString = (app as any).date || (app as any).startDateTime; 
        
        if (!appDateString) return false;
        
        const appDate = new Date(appDateString);
        return appDate.toDateString() === today.toDateString();
      }).length;

      setTodayTherapiesCount(todayCount);

    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
      setPatientCount('?');
      setTodayTherapiesCount('?');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      initStays();
      fetchDashboardStats();
    }, [initStays, fetchDashboardStats])
  );

  const activeStay = currentStays && currentStays.length > 0 ? currentStays[0] : null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB'); 
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      
      <View style={styles.topBar}>
        <Text variant="titleMedium" style={styles.loggedInText}>
          Logged in as Admin
        </Text>
        <Button 
          mode="text" 
          icon="logout" 
          onPress={logout}
          textColor={theme.colors.error}
          compact
        >
          Logout
        </Button>
      </View>

      <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]} elevation={2}>
        <Text variant="labelLarge" style={{ color: 'rgba(255,255,255,0.7)' }}>Current stay</Text>
        
        {staysLoading ? (
          <ActivityIndicator color="white" style={{ marginTop: 15, marginBottom: 10 }} />
        ) : activeStay ? (
          <>
            <Text variant="headlineSmall" style={styles.stayName}>{activeStay.name}</Text>
            <Text variant="bodyMedium" style={styles.stayDates}>
              {formatDate(activeStay.startDate)} - {formatDate(activeStay.endDate)}
            </Text>
          </>
        ) : (
          <Text variant="bodyMedium" style={styles.stayDates}>No active stays right now.</Text>
        )}
      </Surface>

      <View style={styles.content}>
        
        <View style={styles.statsRow}>
          <Surface style={styles.statCard} elevation={1}>
            {statsLoading ? (
              <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 5 }} />
            ) : (
              <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                {patientCount}
              </Text>
            )}
            <Text variant="labelSmall">Patients</Text>
          </Surface>

          <Surface style={styles.statCard} elevation={1}>
             {statsLoading ? (
              <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 5 }} />
            ) : (
              <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                {todayTherapiesCount}
              </Text>
            )}
            <Text variant="labelSmall">Today's therapies</Text>
          </Surface>
        </View>
{role === 'Admin' && (
  <>
        <Text variant="titleMedium" style={styles.sectionTitle}>Manager</Text>
        
        {/* ROW: Rehab Rooms */}
        <View style={styles.actionRow}>
          <Button 
            style={styles.mainActionButton}
            contentStyle={styles.buttonContent}
            onPress={() => navigation.navigate('RehabRoomsList')}
          >
           Rehab Rooms
          </Button>
          <IconButton 
            icon="plus" 
            containerColor={theme.colors.secondary}
            iconColor="white"
            onPress={() => navigation.navigate('AddRehabRoom')}
          />
        </View>

        {/* ROW: Therapists */}
        <View style={styles.actionRow}>
          <Button 
            onPress={() => navigation.navigate('TherapistsList')} 
            style={styles.mainActionButton}
            contentStyle={styles.buttonContent}
          >
            Therapists
          </Button>
          <IconButton 
            icon="plus" 
            containerColor={theme.colors.secondary}
            iconColor="white"
            onPress={() => navigation.navigate('AddTherapist')}
          />
        </View>

        {/* ROW: Treatments */}
        <View style={styles.actionRow}>
          <Button 
            onPress={() => navigation.navigate('TreatmentsList')} 
            style={styles.mainActionButton}
            contentStyle={styles.buttonContent}
          >
            Treatments
          </Button>
          <IconButton 
            icon="plus" 
            containerColor={theme.colors.secondary}
            iconColor="white"
            onPress={() => navigation.navigate('AddTreatment')} 
          />
        </View>

        {/* ROW: Room Types */}
        <View style={styles.actionRow}>
          <Button 
            onPress={() => navigation.navigate('RoomTypesList')} 
            style={styles.mainActionButton}
            contentStyle={styles.buttonContent}
          >
            Room Types
          </Button>
          <IconButton 
            icon="plus" 
            containerColor={theme.colors.secondary}
            iconColor="white"
            onPress={() => navigation.navigate('AddRoomType')} 
          />
        </View>

        {/* ROW: Therapist Roles */}
        <View style={styles.actionRow}>
          <Button 
            onPress={() => navigation.navigate('TherapistRolesList')} 
            style={styles.mainActionButton}
            contentStyle={styles.buttonContent}
          >
            Therapist Roles
          </Button>
          <IconButton 
            icon="plus" 
            containerColor={theme.colors.secondary}
            iconColor="white"
            onPress={() => navigation.navigate('AddTherapistRole')} 
          />
        </View>
       </>
)} 
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5,
  },
  loggedInText: {
    fontWeight: 'bold',
    opacity: 0.7,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 12
  },
  stayName: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
  },
  stayDates: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    flex: 0.48,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  sectionTitle: {
    marginBottom: 15,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainActionButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 241, 234, 1)',
  },
  buttonContent: {
    height: 48,
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
});

export default HomeScreen;