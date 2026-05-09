import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, List, Text, ProgressBar, useTheme } from 'react-native-paper';
import { Stay } from '../types/models';

interface StayCardProps {
  stay: Stay;
  onPress: (id: number) => void;
}

const StayCard: React.FC<StayCardProps> = ({ stay, onPress }) => {
  const theme = useTheme();

  // useCallback do ikony strzałki
  const renderRightIcon = useCallback(
    (props: any) => <List.Icon {...props} icon="chevron-right" color={theme.colors.primary} />,
    [theme.colors.primary]
  );

  // check if divde by 0
  const occupancyRate = stay.maxCapacity > 0 ? stay.occupancy / stay.maxCapacity : 0;
  const isFull = stay.occupancy >= stay.maxCapacity;

  // Formater
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
      <List.Item
        title={stay.name}
        description={`${formatDate(stay.startDate)} to ${formatDate(stay.endDate)}`}
        titleStyle={styles.title}
        right={renderRightIcon}
        onPress={() => onPress(stay.id)}
      />
      <View style={styles.occupancyContainer}>
        <View style={styles.occupancyTextRow}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Occupancy: {stay.occupancy} / {stay.maxCapacity}
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

const styles = StyleSheet.create({
  card: { borderRadius: 12, marginBottom: 15, overflow: 'hidden' },
  title: { fontSize: 16, fontWeight: 'bold' },
  occupancyContainer: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4 },
  occupancyTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressBar: { height: 6, borderRadius: 3 },
});

export default StayCard;