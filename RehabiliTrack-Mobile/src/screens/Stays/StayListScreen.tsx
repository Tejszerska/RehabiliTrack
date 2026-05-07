import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme, Text, Surface, List, FAB, ProgressBar } from 'react-native-paper';

const MOCK_STAYS = [
  { id: '1', name: 'Autumn Stay 2026', startDate: '2026-09-01', endDate: '2026-09-14', enrolled: 12, capacity: 20 },
  { id: '2', name: 'Winter Post-Op Rehab', startDate: '2026-11-15', endDate: '2026-11-28', enrolled: 15, capacity: 15 },
  { id: '3', name: 'Spring Senior Care', startDate: '2027-03-01', endDate: '2027-03-14', enrolled: 5, capacity: 25 },
];

type Props = NativeStackScreenProps<RootStackParamList, 'StayList'>;

const StayListScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [stays, setStays] = useState(MOCK_STAYS);

  const renderStayItem = ({ item }: { item: typeof MOCK_STAYS[0] }) => {
    const occupancyRate = item.enrolled / item.capacity;
    const isFull = item.enrolled >= item.capacity;

    return (
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <List.Item
          title={item.name}
          description={`${item.startDate} to ${item.endDate}`}
          titleStyle={styles.title}
          right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.primary} />}
          onPress={() => {}} //ADD NAV TO StayDetailsScreen
        />
        <View style={styles.occupancyContainer}>
          <View style={styles.occupancyTextRow}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Occupancy: {item.enrolled} / {item.capacity}
            </Text>
            {isFull && <Text variant="labelMedium" style={{ color: theme.colors.error }}>FULL</Text>}
          </View>
          <ProgressBar 
            progress={occupancyRate} 
            color={isFull ? theme.colors.error : theme.colors.primary} 
            style={styles.progressBar} 
          />
        </View>
      </Surface>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={stays}
        renderItem={renderStayItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text variant="titleLarge" style={[styles.headerText, { color: theme.colors.primary }]}>Active Stays</Text>}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => {/* Będzie prowadzić do AddStayScreen */}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerText: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, fontWeight: 'bold' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { borderRadius: 12, marginBottom: 15, overflow: 'hidden' },
  title: { fontSize: 16, fontWeight: 'bold' },
  occupancyContainer: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4 },
  occupancyTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressBar: { height: 6, borderRadius: 3 },
  fab: { position: 'absolute', right: 20, bottom: 30, borderRadius: 30 },
});

export default StayListScreen;