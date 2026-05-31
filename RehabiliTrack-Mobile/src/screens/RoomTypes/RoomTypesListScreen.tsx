import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { useTheme, ActivityIndicator, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRoomTypes } from '../../context/RoomTypesContext';
import CustomHeader from '../../components/CustomHeader';
import DictionaryListItem from '../../components/DictionaryListItem';
import AddFAB from '../../components/AddFAB';
import DictionaryListHeader from '../../components/DictionaryListHeader';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'RoomTypesList'>;

const RoomTypesListScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { roomTypes, loading, deleteRoomType, refreshRoomTypes } = useRoomTypes();

  const handleDelete = useCallback((id: number) => {
    Alert.alert(
      'Delete Room Type',
      'Are you sure? This might affect rooms assigned to this type.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteRoomType(id).catch(() => Alert.alert('Error', 'Could not delete.')) 
        }
      ]
    );
  }, [deleteRoomType]);

  useFocusEffect(
    useCallback(() => {
      refreshRoomTypes();
    }, [refreshRoomTypes])
  );

  const renderItem = useCallback(({ item }: any) => (
    <DictionaryListItem
      id={item.id}
      name={item.name}
      onEdit={(id) => navigation.navigate('EditRoomType', { roomTypeId: id })}
      onDelete={handleDelete}
    />
  ), [navigation, handleDelete]);

  if (loading && roomTypes.length === 0) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomHeader title="Room Types" showBackButton={true} />

      <FlatList
        data={roomTypes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={<DictionaryListHeader leftTitle='ID: type'/>}
        onRefresh={refreshRoomTypes}
        refreshing={loading}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No room types defined.</Text>}
      />

      <AddFAB onPress={() => navigation.navigate('AddRoomType')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingBottom: 100 },
  emptyText: { textAlign: 'center', marginTop: 50, opacity: 0.5 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 16 },
});

export default RoomTypesListScreen;