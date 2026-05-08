import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean; 
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ 
  title,
  showBackButton = true
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handlePress = () => {
      navigation.goBack();
  };

  return (
    <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]} elevation={2}>
      {showBackButton && (
        <IconButton
          icon="arrow-left"
          iconColor={theme.colors.onPrimary}
          size={28}
          style={styles.backButton}
          onPress={handlePress}
        />
      )}
      <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.onPrimary }]}>
        {title}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50, 
    paddingBottom: 15,
    position: 'relative',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40, 
    left: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontWeight: 'bold',
  }
});

export default CustomHeader;