import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar, IconButton, useTheme } from 'react-native-paper';
import { RehabRoom } from '../types/models'; 

interface RehabRoomCardProps {
  room: RehabRoom;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const RehabRoomCard: React.FC<RehabRoomCardProps> = ({ room, onEdit, onDelete }) => {
  const theme = useTheme();
  
  const renderLeftIcon = useCallback(
    (props: any) => (
      <Avatar.Icon 
        {...props} 
        icon="door"
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
          onPress={() => onEdit(room.id)} 
        />
        <IconButton 
          {...props} 
          icon="delete" 
          iconColor={theme.colors.error} 
          onPress={() => onDelete(room.id)} 
        />
      </View>
    ),
    [theme.colors.primary, theme.colors.error, onEdit, onDelete, room.id]
  );

  return (
    <Card style={styles.card} mode="elevated" elevation={1}>
      {/* Header (Room Name, Type, buttons) */}
      <Card.Title
        title={room.name}
        titleVariant="titleMedium"
        subtitle={room.roomTypeName}
        subtitleVariant="bodyMedium"
        left={renderLeftIcon}
        right={renderRightActions}
      />

      {/* Content */}
      <Card.Content>
        {/* Room Number */}
        <View style={styles.infoRow}>
          <Text variant="bodyMedium" style={styles.label}>Room Number:</Text>
          <Text variant="bodyMedium">{room.roomNumber}</Text>
        </View>

        {/* Capacity */}
        <View style={styles.infoRow}>
          <Text variant="bodyMedium" style={styles.label}>Capacity:</Text>
          <Text variant="bodyMedium"> {room.capacity} {room.capacity === 1 ? 'person' : 'people'} </Text>
        </View>
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
  }
});

export default RehabRoomCard;