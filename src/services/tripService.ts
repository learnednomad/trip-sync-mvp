import { supabase } from '@/lib/supabase'
import { Trip, TripParticipant, Activity, Expense } from '@/types/supabase'

export class TripService {
  // Trip CRUD Operations
  static async createTrip(tripData: Partial<Trip>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('trips')
      .insert([{
        ...tripData,
        created_by: user.id,
      }])
      .select()
      .single()

    if (error) throw error

    // Add creator as owner
    await this.addParticipant(data.id, user.id, 'owner')

    return data
  }

  static async updateTrip(tripId: string, updates: Partial<Trip>) {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', tripId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteTrip(tripId: string) {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId)

    if (error) throw error
  }

  static async getTripById(tripId: string) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        trip_participants (
          *,
          users (*)
        ),
        activities (*),
        expenses (*)
      `)
      .eq('id', tripId)
      .single()

    if (error) throw error
    return data
  }

  static async getUserTrips(userId: string) {
    // Get trips where user is a participant
    const { data: participantData, error: participantError } = await supabase
      .from('trip_participants')
      .select('trip_id')
      .returns<Pick<TripParticipant, 'trip_id'>[]>()
      .eq('user_id', userId)
      .eq('status', 'accepted')

    if (participantError) throw participantError

    const tripIds = (participantData ?? []).map((p) => p.trip_id)
    
    if (tripIds.length === 0) return []

    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('*')
      .in('id', tripIds)
      .order('start_date', { ascending: false })

    if (tripsError) throw tripsError
    return trips || []
  }

  // Participant Management
  static async addParticipant(
    tripId: string, 
    userId: string, 
    role: 'owner' | 'admin' | 'member' = 'member'
  ) {
    const { data, error } = await supabase
      .from('trip_participants')
      .insert([{
        trip_id: tripId,
        user_id: userId,
        role,
        status: role === 'owner' ? 'accepted' : 'pending',
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async removeParticipant(tripId: string, userId: string) {
    const { error } = await supabase
      .from('trip_participants')
      .delete()
      .match({ trip_id: tripId, user_id: userId })

    if (error) throw error
  }

  static async updateParticipantRole(
    tripId: string, 
    userId: string, 
    role: 'admin' | 'member'
  ) {
    const { data, error } = await supabase
      .from('trip_participants')
      .update({ role })
      .match({ trip_id: tripId, user_id: userId })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async acceptInvitation(tripId: string, userId: string) {
    const { data, error } = await supabase
      .from('trip_participants')
      .update({ status: 'accepted' })
      .match({ trip_id: tripId, user_id: userId })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async declineInvitation(tripId: string, userId: string) {
    const { error } = await supabase
      .from('trip_participants')
      .delete()
      .match({ trip_id: tripId, user_id: userId })

    if (error) throw error
  }

  // Activity Management
  static async createActivity(activityData: Partial<Activity>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('activities')
      .insert([{
        ...activityData,
        created_by: user.id,
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateActivity(activityId: string, updates: Partial<Activity>) {
    const { data, error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', activityId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteActivity(activityId: string) {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', activityId)

    if (error) throw error
  }

  static async getTripActivities(tripId: string) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('trip_id', tripId)
      .order('start_time', { ascending: true })

    if (error) throw error
    return data || []
  }

  // Real-time Subscriptions
  static subscribeToTrip(
    tripId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`trip:${tripId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trips',
          filter: `id=eq.${tripId}`,
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trip_participants',
          filter: `trip_id=eq.${tripId}`,
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities',
          filter: `trip_id=eq.${tripId}`,
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `trip_id=eq.${tripId}`,
        },
        callback
      )
      .subscribe()
  }

  static unsubscribeFromTrip(tripId: string) {
    return supabase.removeChannel(`trip:${tripId}`)
  }

  // Invitation Links
  static async generateInviteLink(tripId: string): Promise<string> {
    // Generate a unique invite code
    const inviteCode = Math.random().toString(36).substring(2, 15)
    
    // Store invite code in trip metadata or separate table
    // For MVP, we'll use a simple deep link
    return `sabrontrip://invite/${tripId}/${inviteCode}`
  }

  static async validateInviteLink(inviteCode: string): Promise<string | null> {
    // Validate invite code and return trip ID
    // For MVP, extract trip ID from the invite link
    const parts = inviteCode.split('/')
    if (parts.length >= 2) {
      return parts[parts.length - 2] // Return trip ID
    }
    return null
  }
}
