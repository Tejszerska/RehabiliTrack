import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { RootStackParamList } from '../../navigation/types';
import { useTheme, Text, Chip, ActivityIndicator } from 'react-native-paper';
import { AppointmentListItem } from '../../types/models';
import AddFAB from '../../components/AddFAB';
import AppointmentCard from '../../components/AppointmentCard';
import { useStays } from '../../context/StaysContext';
import apiService from '../../api/apiService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PickerField } from '../../components/PickerField';


const AppointmentsScreen = () => {
  const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const { currentStays, stays, loading: staysLoading } = useStays();
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);  
  const [loading, setLoadingAppointments] = useState(true);

  const [showArchivePicker, setShowArchivePicker] = useState(false);
  const [archiveStayId, setArchiveStayId] = useState<number | null>(null);
  

  const handlePress = useCallback((id: number) => {
    navigation.navigate('AppointmentDetails', { appointmentId: id });
  }, [navigation]);

const fetchAppointments = useCallback(async () => {
    if (staysLoading) return;

    try {
      setLoadingAppointments(true);
      
      let idsToFetch: number[] = [];

      if (archiveStayId) {
        idsToFetch = [archiveStayId];
      } 
      else if (currentStays && currentStays.length > 0) {
        idsToFetch = currentStays.map(s => s.id);
      }
      else {
        setAppointments([]);
        return;
      }

      const data = await apiService.getAppointments(idsToFetch);
      setAppointments(data);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAppointments(false);
    }
  }, [currentStays, staysLoading, archiveStayId]); 

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  //nasłuchiwanie na Focus po powrocie z innego ekranu
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAppointments();
    });    
    return unsubscribe; 
  }, [navigation, fetchAppointments]);


  const renderAppointmentItem = useCallback(({ item }: { item: AppointmentListItem }) => (
    <AppointmentCard
      appointment={item}
      onPress={handlePress}
    />
  ), [handlePress]);

  const renderEmpty = useCallback(() => (
    <View style={styles.centerBox}>
      <Text variant="bodyMedium">No appointments found.</Text>
    </View>
  ), []);

  if (loading && appointments.length === 0) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* filters - not working yet */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          <Chip 
          icon="calendar-today"
          onPress={() => {}} 
          style={[styles.chip, { backgroundColor: theme.colors.secondary }]}
          selected>
            Today</Chip>
          <Chip 
          icon="account-tie" 
          onPress={() => {}} 
          style={[styles.chip, { backgroundColor: theme.colors.secondary }]}>
            By Therapist</Chip>
          <Chip 
          icon="account-group" 
          onPress={() => {}} 
          style={[styles.chip, { backgroundColor: theme.colors.secondary }]}>
            By Patient</Chip>
           <Chip 
            icon="calendar" 
            selected={showArchivePicker} 
            onPress={() => {
              setShowArchivePicker(!showArchivePicker);
              
              if (showArchivePicker) {
                setArchiveStayId(null);
              }
            }} 
            style={[styles.chip, { backgroundColor: theme.colors.secondary }]}
          >
            Past stays
          </Chip>
        </ScrollView>
      </View>



        {showArchivePicker && (
          <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
            <PickerField
              label="Archival Stay"
              value={archiveStayId}
              items={stays} // Upewnij się, że masz tu pobraną listę turnusów!
              getValue={x => x.id} 
              getLabel={x => x.name || `Stay #${x.id}`}
              onChange={val => setArchiveStayId(val as number | null)}
              placeholder="Select past stay..." 
            />
          </View>
        )}

      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}        
        onRefresh={fetchAppointments} 
        refreshing={loading}
      />

      <AddFAB onPress={() => navigation.navigate('AddAppointment')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterSection: { paddingVertical: 10, paddingLeft: 20 },
  chipScroll: { paddingRight: 20 },
  chip: { marginRight: 10 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 10 },
});

export default AppointmentsScreen;