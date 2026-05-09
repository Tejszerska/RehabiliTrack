import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Avatar, Text, Chip, useTheme } from 'react-native-paper';
import { AppointmentListItem } from '../types/models';

interface AppointmentCardProps {
  appointment: AppointmentListItem;
  onPress: (id: number) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onPress }) => {
  const theme = useTheme();

  const getStatusProps = (status: string) => {
    switch (status) {
      case 'Completed': return { icon: 'check-circle', color: theme.colors.secondary };
      case 'Canceled': return { icon: 'close-circle', color: theme.colors.error };
      case 'Scheduled': return { icon: 'clock-outline', color: theme.colors.primary };
      default: return { icon: 'calendar', color: theme.colors.onSurfaceVariant };
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const statusInfo = getStatusProps(appointment.status);
  const timeString = formatTime(appointment.startDateTime);

  const renderLeftIcon = useCallback(
    (props: any) => (
      <Avatar.Icon
        {...props}
        icon={statusInfo.icon}
        style={{ backgroundColor: 'transparent' }}
        color={statusInfo.color}
      />
    ),
    [statusInfo.icon, statusInfo.color]
  );

  const renderRightContent = useCallback(
    (props: any) => (
      <Text style={[styles.timeText, { color: theme.colors.primary }]}>
        {timeString}
      </Text>
    ),
    [timeString, theme.colors.primary]
  );

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      elevation={1}
      onPress={() => onPress(appointment.id)}
    >
      <Card.Title
        title={appointment.patientFullName}
        subtitle={`${appointment.treatmentName}`}
        left={renderLeftIcon}
        right={renderRightContent}
        rightStyle={{ marginRight: 16 }}
      />
      <Card.Content style={styles.cardContent}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Therapist: {appointment.therapistFullName}
        </Text>
        {appointment.outpatient && (
          <Chip compact mode="outlined" style={styles.outpatientChip} textStyle={styles.outpatientChipText}>
            Outpatient
          </Chip>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeText: { fontWeight: 'bold', fontSize: 16 },
  outpatientChip: { height: 24, justifyContent: 'center' },
  outpatientChipText: { fontSize: 10, marginVertical: 0, marginHorizontal: 6 }
});

export default AppointmentCard;