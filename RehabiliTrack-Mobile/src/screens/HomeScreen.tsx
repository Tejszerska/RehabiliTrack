import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, useTheme, IconButton, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  // mock for header
  const currentStay = {
    name: 'Autmn Stay 2026',
    dates: '12.10.2026 - 26.10.2026',
    roomCount: 12
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      
      {/* Current stay (header) */}
      <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]} elevation={2}>
        <Text variant="labelLarge" style={{ color: 'rgba(255,255,255,0.7)' }}>Current stay</Text>
        <Text variant="headlineSmall" style={styles.stayName}>{currentStay.name}</Text>
        <Text variant="bodyMedium" style={styles.stayDates}>{currentStay.dates}</Text>
      </Surface>

      <View style={styles.content}>
        
        {/* main stats row */}
        <View style={styles.statsRow}>
          <Surface style={styles.statCard} elevation={1}>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>24</Text>
            <Text variant="labelSmall">Patients</Text>
          </Surface>

          <Surface style={styles.statCard} elevation={1}>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>12</Text>
            <Text variant="labelSmall">Today's therapies</Text>
          </Surface>
        </View>

        {/*  Manager */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Manager</Text>
        
        {/* ROW: Rehab Rooms */}
        <View style={styles.actionRow}>
          <Button 
            style={styles.mainActionButton}
            contentStyle={styles.buttonContent}
            onPress={() => navigation.navigate('RoomsList')}

          >
           Rehab Rooms
          </Button>
          <IconButton 
            icon="plus" 
            containerColor={theme.colors.secondary}
            iconColor="white"
            onPress={() => navigation.navigate('AddRoom')}
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
            onPress={() => navigation.navigate('AddTherapistRoles')} 
          />
        </View>
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    margin: 10,
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