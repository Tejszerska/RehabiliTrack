import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { BottomNavigation, Appbar, useTheme } from "react-native-paper";
import HomeScreen from "./HomeScreen";
import PatientListScreen from "./Patients/PatientListScreen";
import AppointmentsScreen from "./Appointments/AppointmentsScreen";
import StayListScreen from "./Stays/StayListScreen";

const renderScene = BottomNavigation.SceneMap({
  home: HomeScreen,
  patients: PatientListScreen,
  stays: StayListScreen as any,
  appointments: AppointmentsScreen as any
});

const MainContainer = () => {
    const theme = useTheme();
    const [index, setIndex] = useState(0);
    
    const [routes] = useState([
        { key: 'home', title: 'Dashboard', focusedIcon: 'view-dashboard', unfocusedIcon: 'view-dashboard-outline' },
        { key: 'patients', title: 'Patients', focusedIcon: 'account-group', unfocusedIcon: 'account-group-outline'},
        { key: 'stays', title: 'Stays', focusedIcon: 'clipboard-text-multiple', unfocusedIcon: 'clipboard-text-multiple-outline' },
        { key: 'appointments', title: 'Appointments', focusedIcon: 'calendar-month', unfocusedIcon: 'calendar-month-outline' },
    ]);

  return (
    <View style={styles.dummyContainer}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.Action 
          icon="calendar-clock" 
          color={theme.colors.onPrimary} 
          onPress={() => {}} 
        />
        <Appbar.Content 
          title="RehabiliTrack" 
          titleStyle={[styles.titleStyle,
            { color: theme.colors.onPrimary }]} 
        />
      </Appbar.Header>

      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{ backgroundColor: theme.colors.surface }}
        activeColor={theme.colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dummyContainer: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  titleStyle: {
    fontWeight: 'bold',
    fontSize: 22
  }

});

export default MainContainer;