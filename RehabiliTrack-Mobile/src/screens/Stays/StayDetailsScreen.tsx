import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Divider, useTheme } from 'react-native-paper';
import CustomHeader from '../../components/CustomHeader';

const StayDetailsScreen = ({ route, navigation }: any) => {
  const { itemId } = route.params;
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CustomHeader title="Szczegóły" />
      <View style={styles.content}>
        <Text variant="headlineSmall">Element ID: {itemId}</Text>
        <Text variant="bodyLarge">Tutaj opis lub inne dane z obiektu.</Text>
        
        <Divider style={styles.divider} />
        
        <Button 
          mode="contained" 
          icon="pencil"
          onPress={() => navigation.navigate('EditItem' as any, { itemId: itemId })}
        >
          Edytuj Dane
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: { padding: 20 },
  divider: {  marginVertical: 20 }
});

export default StayDetailsScreen;