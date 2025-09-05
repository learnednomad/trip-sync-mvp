import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Trip } from '@/types/supabase';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

interface TripCardProps {
  trip: Trip
  onPress?: () => void
}

export function TripCard({ trip, onPress }: TripCardProps) {
  const router = useRouter()
  
  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      router.push(`/(app)/trips/${trip.id}`)
    }
  }

  const getStatusColor = () => {
    switch (trip.status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy')
  }

  const getDuration = () => {
    const start = new Date(trip.start_date)
    const end = new Date(trip.end_date)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return `${days} ${days === 1 ? 'day' : 'days'}`
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden"
      activeOpacity={0.7}
    >
      {/* Cover Image */}
      {trip.cover_image ? (
        <Image
          source={{ uri: trip.cover_image }}
          className="w-full h-48"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 justify-center items-center">
          <Ionicons name="airplane" size={48} color="white" />
        </View>
      )}

      {/* Content */}
      <View className="p-4">
        {/* Header */}
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              {trip.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-1">{trip.destination}</Text>
            </View>
          </View>
          <View className={`px-3 py-1 rounded-full ${getStatusColor()}`}>
            <Text className="text-xs font-medium capitalize">
              {trip.status}
            </Text>
          </View>
        </View>

        {/* Description */}
        {trip.description && (
          <Text className="text-gray-600 mb-3" numberOfLines={2}>
            {trip.description}
          </Text>
        )}

        {/* Footer */}
        <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
          {/* Dates */}
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </Text>
          </View>

          {/* Duration */}
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{getDuration()}</Text>
          </View>
        </View>

        {/* Budget (if available) */}
        {trip.budget && (
          <View className="flex-row items-center mt-2">
            <Ionicons name="wallet-outline" size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">
              {trip.currency} {trip.budget.toLocaleString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}