import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRehabRooms } from '../../context/RehabRoomsContext';
import RehabRoomCard from '../../components/RehabRoomCard';
import CustomHeader from '../../components/CustomHeader';
import AddFAB from '../../components/AddFAB';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'RehabRoomsList'>;

const RoomsListScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { rehabRooms, loading, deleteRehabRoom, refreshRehabRooms } = useRehabRooms();

  useFocusEffect(
    useCallback(() => {
      refreshRehabRooms();
    }, [refreshRehabRooms])
  );

  const handleDeleteRoom = useCallback((id: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to remove this room from the system?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRehabRoom(id);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              Alert.alert('Error', 'Failed to delete room.');
            }
          }
        }
      ]
    );
  }, [deleteRehabRoom]);

  const handleEditRoom = useCallback((id: number) => {
    navigation.navigate('EditRehabRoom', { roomId: id });
  }, [navigation]);

  // one item (card)
  const renderItem = useCallback(({ item }: any) => (
    <RehabRoomCard 
      room={item} 
      onEdit={handleEditRoom}
      onDelete={handleDeleteRoom}
    />
  ), [handleEditRoom, handleDeleteRoom]);

  // when no rooms in d.b.
  const renderEmpty = useCallback(() => (
    <View style={styles.centerBox}>
      <Text variant="bodyMedium">No rooms found.</Text>
    </View>
  ), []);

  if (loading && rehabRooms.length === 0) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <CustomHeader title="Rehab Rooms" />

      <FlatList
        data={rehabRooms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        onRefresh={refreshRehabRooms}
        refreshing={loading}
      />

      <AddFAB onPress={() => navigation.navigate('AddRehabRoom')} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    paddingVertical: 16
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    borderRadius: 30
  },
});

export default RoomsListScreen;