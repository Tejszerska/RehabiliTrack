import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { useTheme, ActivityIndicator, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTherapistRoles } from '../../context/TherapistRolesContext';
import CustomHeader from '../../components/CustomHeader';
import DictionaryListItem from '../../components/DictionaryListItem';
import AddFAB from '../../components/AddFAB';
import DictionaryListHeader from '../../components/DictionaryListHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'TherapistRolesList'>;

const TherapistRolesListScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { therapistRoles, loading, deleteTherapistRole, refreshTherapistRoles } = useTherapistRoles();

  const handleDelete = useCallback((id: number) => {
    Alert.alert(
      'Delete Therapist Role',
      'Are you sure? This might affect therapists assigned to this role.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteTherapistRole(id).catch(() => Alert.alert('Error', 'Could not delete.')) 
        }
      ]
    );
  }, [deleteTherapistRole]);

  const renderItem = useCallback(({ item }: any) => (
    <DictionaryListItem
      id={item.id}
      name={` ${item.name}`}
      onEdit={(id) => navigation.navigate('EditTherapistRole', { therapistRolesId: id })}
      onDelete={handleDelete}
    />
  ), [navigation, handleDelete]);

  if (loading && therapistRoles.length === 0) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomHeader title="Therapist Roles" showBackButton={true} />

      <FlatList
        data={therapistRoles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={<DictionaryListHeader leftTitle='ID: Role' />}
        onRefresh={refreshTherapistRoles}
        refreshing={loading}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No therapist roles defined.</Text>}
      />

      <AddFAB onPress={() => navigation.navigate('AddTherapistRole')} />
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

export default TherapistRolesListScreen;