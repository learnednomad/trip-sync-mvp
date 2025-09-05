import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { Trip, TripParticipant } from '@/types/supabase'
import { MMKV } from 'react-native-mmkv'
import { supabase } from '@/lib/supabase'

const storage = new MMKV({ id: 'trip-storage' })

const zustandStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name)
    return value ?? null
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value)
  },
  removeItem: (name: string) => {
    storage.delete(name)
  },
}

interface TripState {
  trips: Trip[]
  currentTrip: Trip | null
  participants: Record<string, TripParticipant[]>
  isLoading: boolean
  error: string | null
  lastSync: Date | null
  
  // Actions
  actions: {
    fetchTrips: () => Promise<void>
    fetchTripById: (id: string) => Promise<void>
    createTrip: (trip: Partial<Trip>) => Promise<Trip | null>
    updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>
    deleteTrip: (id: string) => Promise<void>
    setCurrentTrip: (trip: Trip | null) => void
    addParticipant: (tripId: string, userId: string, role?: string) => Promise<void>
    removeParticipant: (tripId: string, userId: string) => Promise<void>
    syncTrips: () => Promise<void>
  }
}

export const useTripStore = create<TripState>()(
  persist(
    immer((set, get) => ({
      trips: [],
      currentTrip: null,
      participants: {},
      isLoading: false,
      error: null,
      lastSync: null,

      actions: {
        fetchTrips: async () => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // Fetch trips where user is a participant
            const { data: participantData, error: participantError } = await supabase
              .from('trip_participants')
              .select('trip_id')
              .returns<Pick<TripParticipant, 'trip_id'>[]>()
              .eq('user_id', user.id)
              .eq('status', 'accepted')

            if (participantError) throw participantError

            const tripIds = (participantData ?? []).map((p) => p.trip_id)
            
            if (tripIds.length === 0) {
              set((state) => {
                state.trips = []
                state.isLoading = false
              })
              return
            }

            const { data: trips, error: tripsError } = await supabase
              .from('trips')
              .select('*')
              .in('id', tripIds)
              .order('start_date', { ascending: false })

            if (tripsError) throw tripsError

            set((state) => {
              state.trips = trips || []
              state.lastSync = new Date()
              state.isLoading = false
            })
          } catch (error: any) {
            set((state) => {
              state.error = error.message
              state.isLoading = false
            })
          }
        },

        fetchTripById: async (id: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const { data: trip, error } = await supabase
              .from('trips')
              .select('*')
              .eq('id', id)
              .single()

            if (error) throw error

            // Fetch participants
            const { data: participants, error: participantsError } = await supabase
              .from('trip_participants')
              .select('*, users(*)')
              .eq('trip_id', id)

            if (participantsError) throw participantsError

            set((state) => {
              state.currentTrip = trip
              state.participants[id] = participants || []
              state.isLoading = false
            })
          } catch (error: any) {
            set((state) => {
              state.error = error.message
              state.isLoading = false
            })
          }
        },

        createTrip: async (tripData: Partial<Trip>) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { data: trip, error } = await supabase
              .from('trips')
              .insert([{
                ...tripData,
                created_by: user.id,
              }])
              .select()
              .single()

            if (error) throw error

            // Add creator as owner
            const { error: participantError } = await supabase
              .from('trip_participants')
              .insert([{
                trip_id: trip.id,
                user_id: user.id,
                role: 'owner',
                status: 'accepted',
              }])

            if (participantError) throw participantError

            set((state) => {
              state.trips.push(trip)
              state.isLoading = false
            })

            return trip
          } catch (error: any) {
            set((state) => {
              state.error = error.message
              state.isLoading = false
            })
            return null
          }
        },

        updateTrip: async (id: string, updates: Partial<Trip>) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const { data: trip, error } = await supabase
              .from('trips')
              .update(updates)
              .eq('id', id)
              .select()
              .single()

            if (error) throw error

            set((state) => {
              const index = state.trips.findIndex(t => t.id === id)
              if (index !== -1) {
                state.trips[index] = trip
              }
              if (state.currentTrip?.id === id) {
                state.currentTrip = trip
              }
              state.isLoading = false
            })
          } catch (error: any) {
            set((state) => {
              state.error = error.message
              state.isLoading = false
            })
          }
        },

        deleteTrip: async (id: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const { error } = await supabase
              .from('trips')
              .delete()
              .eq('id', id)

            if (error) throw error

            set((state) => {
              state.trips = state.trips.filter(t => t.id !== id)
              if (state.currentTrip?.id === id) {
                state.currentTrip = null
              }
              delete state.participants[id]
              state.isLoading = false
            })
          } catch (error: any) {
            set((state) => {
              state.error = error.message
              state.isLoading = false
            })
          }
        },

        setCurrentTrip: (trip: Trip | null) => {
          set((state) => {
            state.currentTrip = trip
          })
        },

        addParticipant: async (tripId: string, userId: string, role = 'member') => {
          try {
            const { error } = await supabase
              .from('trip_participants')
              .insert([{
                trip_id: tripId,
                user_id: userId,
                role,
                status: 'pending',
              }])

            if (error) throw error

            // Refresh participants
            await get().actions.fetchTripById(tripId)
          } catch (error: any) {
            set((state) => {
              state.error = error.message
            })
          }
        },

        removeParticipant: async (tripId: string, userId: string) => {
          try {
            const { error } = await supabase
              .from('trip_participants')
              .delete()
              .match({ trip_id: tripId, user_id: userId })

            if (error) throw error

            // Refresh participants
            await get().actions.fetchTripById(tripId)
          } catch (error: any) {
            set((state) => {
              state.error = error.message
            })
          }
        },

        syncTrips: async () => {
          const { actions } = get()
          await actions.fetchTrips()
        },
      },
    })),
    {
      name: 'trip-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        trips: state.trips,
        currentTrip: state.currentTrip,
        lastSync: state.lastSync,
      }),
    }
  )
)
