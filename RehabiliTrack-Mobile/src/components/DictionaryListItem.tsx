import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, IconButton, useTheme } from 'react-native-paper';

interface DictionaryListItemProps {
  id: number;
  name: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const DictionaryListItem: React.FC<DictionaryListItemProps> = ({ 
  id, 
  name, 
  onEdit, 
  onDelete 
}) => {
  const theme = useTheme();

  const renderRightActions = useCallback(
    (props: any) => (
      <View style={styles.actionsRow}>
        <IconButton
          {...props}
          icon="pencil"
          iconColor={theme.colors.primary}
          onPress={() => onEdit(id)}
        />
        <IconButton
          {...props}
          icon="delete"
          iconColor={theme.colors.error}
          onPress={() => onDelete(id)}
        />
      </View>
    ),
    [id, onEdit, onDelete, theme]
  );

  return (
    <List.Item
      title={`${id}: ${name}`}
      titleStyle={styles.title}
      right={renderRightActions}
      style={[styles.item, { borderBottomColor: theme.colors.surfaceVariant }]}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DictionaryListItem;