import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, FAB, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import CustomHeader from '../../components/CustomHeader';

const RehabRoomsListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // MOCK DATA - tutaj docelowo będzie Twój Context
  const data = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];

  const renderItem = useCallback(({ item }: any) => (
    <List.Item
      title={item.name}
      description={`ID: ${item.id}`}
      onPress={() => navigation.navigate('ItemDetails' as any, { itemId: item.id })}
      right={props => <List.Icon {...props} icon="chevron-right" />}
    />
  ), [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomHeader title="Lista Elementów"  />
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        onPress={() => navigation.navigate('AddItem' as any)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});

export default RehabRoomsListScreen;