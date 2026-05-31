import React, { useCallback, useEffect, useState } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { RootStackParamList } from '../../navigation/types'
import { useTheme, Text, Chip } from 'react-native-paper'
import { AppointmentListItem } from '../../types/models'
import AddFAB from '../../components/AddFAB'
import AppointmentCard from '../../components/AppointmentCard'
import { useStays } from '../../context/StaysContext'
import apiService from '../../api/apiService'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { PickerField } from '../../components/PickerField'
import { useAppointments } from '../../context/AppointmentsContext'


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

  // for today chip filtering
  const [filterToday, setFilterToday] = useState(false)
  
  // toggle for therapist picker visibility
  const [showTherapistPicker, setShowTherapistPicker] = useState(false)
  // store selected therapist id
  const [therapistId, setTherapistId] = useState<number | null>(null)
  
  // toggle for patient picker visibility
  const [showPatientPicker, setShowPatientPicker] = useState(false)
  // store selected patient id
  const [patientId, setPatientId] = useState<number | null>(null)


  // for lazy loading
  const { refreshAppointments } = useAppointments();

      useFocusEffect(
          useCallback(() => {
            refreshAppointments();
            
          }, [refreshAppointments]) 
        );


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
    // start with all appointments
    let filtered = appointments

    // apply today filter
    if (filterToday) {
      const todayString = new Date().toDateString()
      filtered = filtered.filter(app => {
        if (!app.startDateTime) return false
        const appDate = new Date(app.startDateTime).toDateString()
        return appDate === todayString
      })
    }

    // apply therapist filter
    if (therapistId) {
      filtered = filtered.filter(app => {
        return app.therapist?.id === therapistId
      })
    }

    // apply patient filter
    if (patientId) {
      filtered = filtered.filter(app => {
        return app.patient?.id === patientId
      })
    }

    // return final list
    return filtered
  }, [appointments, filterToday, therapistId, patientId])

// extract unique patients directly from appointments
  const pickerPatients = React.useMemo(() => {
    const uniquePatients = new Map()

    appointments.forEach(app => {
      if (app.patient && !uniquePatients.has(app.patient.id)) {
        
        uniquePatients.set(app.patient.id, {
          id: app.patient.id,
          fullName: app.patient.fullName
        })        
      }
    })

    return Array.from(uniquePatients.values())
  }, [appointments])

// extract unique therapists directly from appointments
  const pickerTherapists = React.useMemo(() => {
    const uniqueTherapists = new Map()

    appointments.forEach(app => {
      // secure check if therapist exists on appointment
      if (app.therapist && !uniqueTherapists.has(app.therapist.id)) {
        
        uniqueTherapists.set(app.therapist.id, {
          id: app.therapist.id,
          fullName: app.therapist.fullName
        })
        
      }
    })

    return Array.from(uniqueTherapists.values())
  }, [appointments])


  // main ui wrapper
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* filter section */}
      <View style={styles.filterSection}>
        {/* container for grid layout */}
        <View style={styles.chipContainer}>
        
          <Chip 
            icon="calendar" 
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
            selected={showTherapistPicker}
            onPress={() => {
              setShowTherapistPicker(!showTherapistPicker)
              if (showTherapistPicker) {
                setTherapistId(null)
              }
            }} 
            style={[styles.chip, { backgroundColor: theme.colors.secondary }]}
          >
            By Therapist
          </Chip>

          <Chip 
            icon="account-group" 
            selected={showPatientPicker}
            onPress={() => {
              setShowPatientPicker(!showPatientPicker)
              if (showPatientPicker) {
                setPatientId(null)
              }
            }} 
            style={[styles.chip, { backgroundColor: theme.colors.secondary }]}
          >
            By Patient
          </Chip>
            
        </View>
      </View>

        {/* conditional picker rendering archive stays */}
        {showArchivePicker && (
          <View style={styles.picker}>
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

        {/* conditional picker rendering therapists */}
        {showTherapistPicker && (
          <View style={styles.picker}>
            <PickerField
              label="Therapists"
              value={therapistId}              
              items={pickerTherapists}               
              getValue={x => x.id}               
              getLabel={x => x.fullName}               
              onChange={val => setTherapistId(val as number | null)}
              placeholder="Select therapist" 
            />
          </View>
        )}

        {/* conditional picker rendering patients */}
        {showPatientPicker && (
          <View style={styles.picker}>
            <PickerField
              label="Patients"
              value={patientId}
              items={pickerPatients}
              getValue={x => x.id} 
              getLabel={x => x.fullName}               
              onChange={val => setPatientId(val as number | null)}
              placeholder="Select patient" 
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

  picker: {paddingHorizontal: 20, paddingBottom: 10}
})

export default AppointmentsScreen