import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar, IconButton, useTheme } from 'react-native-paper';
import { Therapist } from '../types/models'; 

interface TherapistCardProps {
  therapist: Therapist;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onEdit, onDelete }) => {
  const theme = useTheme();
  
  const renderLeftIcon = useCallback(
    (props: any) => (
      <Avatar.Icon 
        {...props} 
        icon="account-tie"
        style={{ backgroundColor: theme.colors.secondary }} 
        color={theme.colors.onSurface}
      />
    ),
    [theme.colors.secondary, theme.colors.onSurface]
  );

  const renderRightActions = useCallback(
    (props: any) => (
      <View style={styles.actionsRow}>
        <IconButton 
          {...props} 
          icon="pencil" 
          iconColor={theme.colors.primary}
          onPress={() => onEdit(therapist.id)} 
        />
        <IconButton 
          {...props} 
          icon="delete" 
          iconColor={theme.colors.error} 
          onPress={() => onDelete(therapist.id)} 
        />
      </View>
    ),
    [theme.colors.primary, theme.colors.error, onEdit, onDelete, therapist.id]
  );

  return (
    <Card style={styles.card} mode="elevated" elevation={1}>
      {/* header (full name, role, buttons) */}
      <Card.Title
        title={`${therapist.firstName} ${therapist.lastName}`}
        titleVariant="titleMedium"
        subtitle={therapist.therapistRoleName}
        subtitleVariant="bodyMedium"
        left={renderLeftIcon}
        right={renderRightActions}
      />

      {/* Content */}
      <Card.Content>
        {/* PWZ */}
        <View style={styles.infoRow}>
          <Text variant="bodyMedium" style={styles.label}>PWZ:</Text>
          <Text variant="bodyMedium">{therapist.licenseNumber}</Text>
        </View>

        {/* phone*/}
        {therapist.phoneNumber ? (
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>Phone:</Text>
            <Text variant="bodyMedium">{therapist.phoneNumber}</Text>
          </View>
        ) : null}

        {/* notes */}
        {therapist.notes ? (
          <View style={[styles.notesContainer, { borderTopColor: theme.colors.surfaceVariant }]}>
            <Text variant="bodySmall" style={styles.label}>Notes:</Text>
            <Text variant="bodySmall" style={[styles.notesText, { color: theme.colors.onSurfaceVariant }]}>
              {therapist.notes}
            </Text>
          </View>
        ) : null}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF', 
  },
  actionsRow: {
    flexDirection: 'row',
    marginRight: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
    width: 110,
    color: '#555',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  notesText: {
    marginTop: 4,
  }
});

export default TherapistCard;