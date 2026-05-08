import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';

interface AddFABProps {
  onPress: () => void;
}

const AddFAB: React.FC<AddFABProps> = ({ onPress }) => {
  const theme = useTheme();

  return (
    <FAB
      icon="plus"
      style={[styles.fab, { backgroundColor: theme.colors.primary }]}
      color={theme.colors.onPrimary}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    borderRadius: 30,
  },
});

export default AddFAB;