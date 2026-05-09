import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme, Text, Chip, ActivityIndicator } from 'react-native-paper';
import { useAppointments } from '../../context/AppointmentsContext';
import { AppointmentListItem } from '../../types/models';
import AddFAB from '../../components/AddFAB';
import AppointmentCard from '../../components/AppointmentCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Appointments'>;

const AppointmentsScreen: React.FC<Props> = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); 
  const { appointments, loading, refreshAppointments } = useAppointments();

  const handlePress = useCallback((id: number) => {
    navigation.navigate('AppointmentDetails', { appointmentId: id });
  }, [navigation]);

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
        </ScrollView>
      </View>

      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        onRefresh={refreshAppointments}
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