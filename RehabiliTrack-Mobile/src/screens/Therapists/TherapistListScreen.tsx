import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTherapists } from '../../context/TherapistsContext';
import TherapistCard from '../../components/TherapistCard';
import CustomHeader from '../../components/CustomHeader';
import AddFAB from '../../components/AddFAB';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'TherapistsList'>;

const TherapistListScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { therapists, loading, deleteTherapist, refreshTherapists } = useTherapists();

  const handleDeleteTherapist = useCallback((id: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to remove this therapist from the system?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTherapist(id);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              Alert.alert('Error', 'Failed to delete therapist.');
            }
          }
        }
      ]
    );
  }, [deleteTherapist]);

    useFocusEffect(
    useCallback(() => {
      refreshTherapists();      
    }, [refreshTherapists]) 
  );

  const handleEditTherapist = useCallback((id: number) => {
    navigation.navigate('EditTherapist', { therapistId: id });
  }, [navigation]);

  // one item (card)
  const renderItem = useCallback(({ item }: any) => (
    <TherapistCard 
      therapist={item} 
      onEdit={handleEditTherapist}
      onDelete={handleDeleteTherapist}
    />
  ), [handleEditTherapist, handleDeleteTherapist]);

  // when no therapists in d.b.
  const renderEmpty = useCallback(() => (
    <View style={styles.centerBox}>
      <Text variant="bodyMedium">No therapists found.</Text>
    </View>
  ), []);

  if (loading && therapists.length === 0) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <CustomHeader title="Therapists" />

      <FlatList
        data={therapists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        onRefresh={refreshTherapists}
        refreshing={loading}
      />

      <AddFAB onPress={() => navigation.navigate('AddTherapist')} />
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

export default TherapistListScreen;