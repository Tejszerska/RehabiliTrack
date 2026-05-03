import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { BottomNavigation, Appbar, useTheme, Text } from "react-native-paper";
import HomeScreen from "./HomeScreen";
import PatientListScreen from "./PatientListScreen";
import ScheduleScreen from "./ScheduleScreen";
import StayListScreen from "./StayListScreen";


const renderScene = BottomNavigation.SceneMap({
  home: HomeScreen,
  patients: PatientListScreen,
  stays: StayListScreen as any,
  schedule: ScheduleScreen as any
});

const MainContainer = () => {
    const theme = useTheme();
    const [index, setIndex] = useState(0);
    
    const [routes] = useState([
        { key: 'home', title: 'Dashboard', focusedIcon: 'view-dashboard', unfocusedIcon: 'view-dashboard-outline' },
        { key: 'patients', title: 'Patients', focusedIcon: 'account-group', unfocusedIcon: 'account-group-outline'},
        { key: 'stays', title: 'Stays', focusedIcon: 'clipboard-text-multiple', unfocusedIcon: 'clipboard-text-multiple-outline' },
        { key: 'schedule', title: 'Schedule', focusedIcon: 'calendar-month', unfocusedIcon: 'calendar-month-outline' },
    ]);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.Action 
          icon="calendar-clock" 
          color={theme.colors.onPrimary} 
          onPress={() => {}} 
        />
        <Appbar.Content 
          title="RehabiliTrack" 
          titleStyle={{ color: theme.colors.onPrimary, fontWeight: 'bold', fontSize: 22 }} 
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDFBF7',
  }
});

export default MainContainer;