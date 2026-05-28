import React, { useCallback, useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, ScrollView } from 'react-native'
import { RootStackParamList } from '../../navigation/types'
import { useTheme, Text, Chip, ActivityIndicator } from 'react-native-paper'
import { AppointmentListItem } from '../../types/models'
import AddFAB from '../../components/AddFAB'
import AppointmentCard from '../../components/AppointmentCard'
import { useStays } from '../../context/StaysContext'
import apiService from '../../api/apiService'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { PickerField } from '../../components/PickerField'


const AppointmentsScreen = () => {
  // get app theme colors
  const theme = useTheme()
  // setup navigation hook
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  
  // get global stays data
  const { currentStays, stays, loading: staysLoading } = useStays()
  
  // local state for appointments list
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([])  
  // loading state flag
  const [loading, setLoadingAppointments] = useState(true)

  // toggle for archive picker visibility
  const [showArchivePicker, setShowArchivePicker] = useState(false)
  // store selected archive stay id
  const [archiveStayId, setArchiveStayId] = useState<number | null>(null)

  // for "today" chip filtering
  const [filterToday, setFilterToday] = useState(false);
  

  // navigate to details on card tap
  const handlePress = useCallback((id: number) => {
    navigation.navigate('AppointmentDetails', { appointmentId: id })
  }, [navigation])

  // fetch appointments logic
  const fetchAppointments = useCallback(async () => {
    // wait for stays to load
    if (staysLoading) return

    try {
      setLoadingAppointments(true)      
      let idsToFetch: number[] = []

      // use selected archive id
      if (archiveStayId) {
        idsToFetch = [archiveStayId]
      } 
      // fallback to current stays ids
      else if (currentStays && currentStays.length > 0) {
        idsToFetch = currentStays.map(s => s.id)
      }
      // clear list if no stays found
      else {
        setAppointments([])
        return
      }

      // api call
      const data = await apiService.getAppointments(idsToFetch)
      setAppointments(data || [])
      
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingAppointments(false)
    }
  }, [currentStays, staysLoading, archiveStayId]) 

  // initial load
  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  // refresh on screen focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAppointments()
    })    
    return unsubscribe 
  }, [navigation, fetchAppointments])


  // render single list item
  const renderAppointmentItem = useCallback(({ item }: { item: AppointmentListItem }) => (
    <AppointmentCard
      appointment={item}
      onPress={handlePress}
    />
  ), [handlePress])

  // ui for empty list
  const renderEmpty = useCallback(() => (
    <View style={styles.centerBox}>
      <Text variant="bodyMedium">No appointments found</Text>
    </View>
  ), [])


  // dynamic list filtering
const displayedAppointments = React.useMemo(() => {
    if (!filterToday) {
      return appointments;
    }

    const todayString = new Date().toDateString();

    return appointments.filter(app => {
      // in case of empty date
      if (!app.startDateTime) return false; 
      
      const appDate = new Date(app.startDateTime).toDateString();
      return appDate === todayString;
    });
  }, [appointments, filterToday]);



  // main ui wrapper
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* filter section */}
      <View style={styles.filterSection}>
        {/* container for grid layout */}
        <View style={styles.chipContainer}>
        
          <Chip 
            icon="account-group" 
            selected={showArchivePicker} 
            onPress={() => {
              setShowArchivePicker(!showArchivePicker)
              if (showArchivePicker) {
                setArchiveStayId(null)
              }
            }} 
            style={[styles.chip, { backgroundColor: theme.colors.secondary }]}
          >
            Past stays
          </Chip>

          <Chip 
            icon="calendar-today"
            selected={filterToday}
            onPress={() => setFilterToday(!filterToday)}
            style={[styles.chip, { backgroundColor: theme.colors.secondary }]}
          >
            Today
          </Chip>

          <Chip 
            icon="account-tie" 
            onPress={() => {}} 
            style={[styles.chip, { backgroundColor: theme.colors.secondary }]}
          >
            By Therapist
          </Chip>

          <Chip 
            icon="account-group" 
            onPress={() => {}} 
            style={[styles.chip, { backgroundColor: theme.colors.secondary }]}
          >
            By Patient
          </Chip>
            
        </View>
      </View>

        {/* conditional picker rendering */}
        {showArchivePicker && (
          <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
            <PickerField
              label="Archival Stay"
              value={archiveStayId}
              items={stays}
              getValue={x => x.id} 
              getLabel={x => x.name || `Stay #${x.id}`}
              onChange={val => setArchiveStayId(val as number | null)}
              placeholder="Select past stay" 
            />
          </View>
        )}

      {/* render appointments list */}
      <FlatList
        data={displayedAppointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}        
        onRefresh={fetchAppointments} 
        refreshing={loading}
      />

      {/* floating action button for new appointment */}
      <AddFAB onPress={() => navigation.navigate('AddAppointment')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // container margins
  filterSection: { paddingVertical: 10, paddingHorizontal: 20 },
  
  // grid layout configuration
  chipContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  
  // single chip sizing
  chip: { 
    width: '48%', 
    marginBottom: 10 
  },
  
  listContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 10 },
})

export default AppointmentsScreen