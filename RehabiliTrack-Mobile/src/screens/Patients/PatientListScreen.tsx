import React, { useCallback, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { PatientListItem } from '../../types/models';
import { RootStackParamList } from '../../navigation/types';
import { TextInput, Button, Text, Surface, List, useTheme, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePatients } from '../../context/PatientsContext';
import AddFAB from '../../components/AddFAB';
import apiService from '../../api/apiService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PatientListScreen = () => {
  const { patients, error, refreshPatients } = usePatients();
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [displayPatients, setDisplayPatients] = useState<PatientListItem[]>([]);


  useEffect(() => {
    if (patients) {
      setDisplayPatients(patients);
      setLoading(false);
    }
  }, [patients]);

  const goToPatientDetails = (id: number): void => {
    navigation.navigate('PatientDetails', {
      patientId: id
    }); 
  };

  const renderRightIcon = useCallback(
    (props: any) => <List.Icon {...props} icon="chevron-right" color={theme.colors.primary} />,
    [theme.colors.primary]
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return; 
    }
    
    setSearching(true);

    try {    
      const results = await apiService.searchPatients(searchQuery);
      setDisplayPatients(results);
    } catch (error) {
      Alert.alert('Error', 'Failed to search patients.');
    } finally {
      setSearching(false);
    }        
  };     

  const handleClear = () => {
    setSearchQuery('');
    setDisplayPatients(patients);
  };

  const renderPatientItem = ({ item }: { item: PatientListItem }) => (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
      <List.Item
        title={`${item.firstName} ${item.lastName}`}
        description={`PESEL: ${item.pesel}`}
        titleStyle={styles.name}
        descriptionStyle={styles.details}
        right={renderRightIcon}
        onPress={() => { goToPatientDetails(item.id) }} 
      />
    </Surface>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: theme.colors.error }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.searchSection}>
        
        <TextInput
          mode="outlined"
          label="Enter name or surname..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          right={<TextInput.Icon icon="magnify" />}
        />
        
        <View style={styles.buttonRow}>
          <Button 
            mode="contained" 
            onPress={handleSearch} 
            style={styles.button}
            icon="magnify"
            loading={searching}
            disabled={searching}
          >
            Search
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={handleClear} 
            style={styles.button}
            icon="close"
            disabled={searching}
          >
            Clear
          </Button>
        </View>
      </View>

      <FlatList
        data={displayPatients}
        renderItem={renderPatientItem}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={refreshPatients}
        refreshing={searching}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No patients found.</Text>}
      />

      <AddFAB onPress={() => navigation.navigate('AddPatient')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchSection: { paddingHorizontal: 20, marginBottom: 15, marginTop: 15 },
  searchInput: { marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { flex: 0.48 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { borderRadius: 12, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: '600' },
  details: { fontSize: 14, marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default PatientListScreen;