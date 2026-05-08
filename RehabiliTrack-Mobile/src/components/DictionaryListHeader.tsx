import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface DictionaryListHeaderProps {
  leftTitle?: string;
  rightTitle?: string;
}

const DictionaryListHeader: React.FC<DictionaryListHeaderProps> = ({ 
  leftTitle = "ID: Name", 
  rightTitle = "Actions" 
}) => {
  const theme = useTheme();

  return (
    <View style={styles.listHeader}>
      <Text style={[styles.headerText, { color: theme.colors.primary }]}>
        {leftTitle}
      </Text>
      <Text style={[styles.headerText, { color: theme.colors.primary }]}>
        {rightTitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', 
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase', 
  },
});

export default DictionaryListHeader;