// import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { PatientListItem } from '../../types/models';
import { RootStackParamList } from '../../navigation/types';
import { TextInput, Button, Text, Surface, List, useTheme, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePatients } from '../../context/PatientsContext';
import { useCallback } from 'react';
import AddFAB from '../../components/AddFAB';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PatientListScreen = () => {
  const { patients, loading, error, refreshPatients } = usePatients();
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();

  const goToPatientDetails = (id: number): void => {
    navigation.navigate('PatientDetails', {
      patientId: id
    }); 
  };

  const renderRightIcon = useCallback(
    (props: any) => <List.Icon {...props} icon="chevron-right" color={theme.colors.primary} />,
    [theme.colors.primary]
  )
  
  /*
  ============ DODATKOWY ELEMENT LAB 5 ============
            == wersja z mocków z lab 1 ==
  const [searchQuery, setSearchQuery] = useState('');
  const [displayPatients, setDisplayPatients] = useState<Patient[]>([]);
  

  const handleSearch = () => {
    const filtered = patients.filter(p => 
      p.lastName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      p.firstName.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setDisplayPatients(filtered);
  };

  const handleClear = () => {
    setSearchQuery('');
    setDisplayPatients(patients);
  };
  */

  const renderPatientItem = ({ item }: { item: PatientListItem }) => (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
      <List.Item
        title={`${item.firstName} ${item.lastName}`}
        description={`PESEL: ${item.pesel}`}
        titleStyle={styles.name}
        descriptionStyle={styles.details}
        right={renderRightIcon}
        onPress={() => {goToPatientDetails(item.id)}} 
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
          // value={searchQuery}
          // onChangeText={setSearchQuery}
          style={styles.searchInput}
          right={<TextInput.Icon icon="magnify" />}
        />
        
        <View style={styles.buttonRow}>
          <Button 
            mode="contained" 
            // onPress={handleSearch} 
            style={styles.button}
            icon="magnify"
          >
            Search
          </Button>
          
          <Button 
            mode="outlined" 
            // onPress={handleClear} 
            style={styles.button}
            icon="close"
          >
            Clear
          </Button>
        </View>
      </View>

      <FlatList
        data={patients}
        renderItem={renderPatientItem}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={refreshPatients}
        refreshing={loading}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No patients found.</Text>}
      />

      <AddFAB onPress={() => navigation.navigate('AddPatient')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  searchSection: { 
    paddingHorizontal: 20, 
    marginBottom: 15,
    marginTop: 15 
  },
  searchInput: {
    marginBottom: 10,
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  button: {
    flex: 0.48, 
  },
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 100 
  },
  card: {
    borderRadius: 12,
    marginBottom: 12,
  },
  name: { 
    fontSize: 18, 
    fontWeight: '600' 
  },
  details: { 
    fontSize: 14, 
    marginTop: 2 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    color: '#999', 
    fontSize: 16 
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    borderRadius: 30
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default PatientListScreen;