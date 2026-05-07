import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme, Text, Card, Avatar, FAB, Chip } from 'react-native-paper';

const MOCK_APPOINTMENTS = [
  { id: '1', time: '08:00 AM', patient: 'Jan Kowalski', therapist: 'Dr. House', treatment: 'Cryotherapy', room: '102', status: 'Completed' },
  { id: '2', time: '09:30 AM', patient: 'Anna Nowak', therapist: 'Anna Lee', treatment: 'Massage', room: '105', status: 'Scheduled' },
  { id: '3', time: '11:00 AM', patient: 'Marek Zieliński', therapist: 'Dr. House', treatment: 'Laser', room: '101', status: 'Canceled' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Appointments'>;

const AppointmentsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);

  // for picturing status
  const getStatusProps = (status: string) => {
    switch(status) {
      case 'Completed': return { icon: 'check-circle', color: theme.colors.secondary };
      case 'Canceled': return { icon: 'close-circle', color: theme.colors.error };
      default: return { icon: 'clock-outline', color: theme.colors.primary };
    }
  };

  const renderAppointmentItem = ({ item }: { item: typeof MOCK_APPOINTMENTS[0] }) => {
    const statusInfo = getStatusProps(item.status);

    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <Card.Title
          title={item.patient}
          subtitle={`${item.treatment} | Room: ${item.room}`}
          left={(props) => <Avatar.Icon {...props} icon={statusInfo.icon} style={{ backgroundColor: 'transparent' }} color={statusInfo.color} />}
          right={(props) => <Text style={[styles.timeText, { color: theme.colors.primary }]}>{item.time}</Text>}
          rightStyle={{ marginRight: 16 }}
        />
        <Card.Content>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Therapist: {item.therapist}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      {/* filters - not working yet */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          <Chip icon="calendar-today" onPress={() => {}} style={styles.chip} selected>Today</Chip>
          <Chip icon="account-tie" onPress={() => {}} style={styles.chip}>By Therapist</Chip>
          <Chip icon="account-group" onPress={() => {}} style={styles.chip}>By Patient</Chip>
        </ScrollView>
      </View>

      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => { }} // ADD NAV!
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterSection: { paddingVertical: 10, paddingLeft: 20 },
  chipScroll: { paddingRight: 20 },
  chip: { marginRight: 10 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 10 },
  card: { marginBottom: 12 },
  timeText: { fontWeight: 'bold', fontSize: 16 },
  fab: { position: 'absolute', right: 20, bottom: 30, borderRadius: 30 },
});

export default AppointmentsScreen;