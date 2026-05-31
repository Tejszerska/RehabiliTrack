import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme, Text } from 'react-native-paper';
import { useStays } from '../../context/StaysContext';
import { StayListItem } from '../../types/models';
import AddFAB from '../../components/AddFAB';
import StayCard from '../../components/StayCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'StayList'>;

const StayListScreen: React.FC<Props> = () => {
  const theme = useTheme();
  const { stays, loading, refreshStays } = useStays();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); 

  useFocusEffect(
    useCallback(() => {
      refreshStays();      
    }, [refreshStays]) 
  );


  const handlePress = useCallback((id: number) => {
    navigation.navigate('StayDetails', { stayId: id });
  }, [navigation]);

  const renderStayItem = useCallback(({ item }: { item: StayListItem }) => (
    <StayCard stay={item} onPress={handlePress} />
  ), [handlePress]);

  const renderEmpty = useCallback(() => (
    <View style={styles.centerBox}>
      <Text variant="bodyMedium">No stays found.</Text>
    </View>
  ), []);

  if (loading && stays.length === 0) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={stays}
        renderItem={renderStayItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        onRefresh={refreshStays}
        refreshing={loading}
        ListHeaderComponent={
          <Text variant="titleLarge" style={[styles.headerText, { color: theme.colors.primary }]}>
            Stays
          </Text>
        }
      />

      <AddFAB onPress={() => navigation.navigate('AddStay')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerText: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, fontWeight: 'bold' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
});

export default StayListScreen;