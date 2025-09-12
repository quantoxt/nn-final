import type { Database } from '~/types/database.types'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { ref, onUnmounted } from 'vue'
import { useSupabaseClient } from '#imports'

export const useRealtimeSubscription = () => {
  const client = useSupabaseClient<Database>()
  const channel = ref<RealtimeChannel | null>(null)

  const setupChannel = <T extends keyof Database['public']['Tables']>(
    channelName: string,
    table: T,
    filter: string,
    callback: Parameters<RealtimeChannel['on']>[2]
  ) => {
    // Clean up existing channel
    if (channel.value) {
      try {
        channel.value.unsubscribe()
        client.removeChannel(channel.value)
      } catch (err) {
        console.error('Error removing channel:', err)
      }
      channel.value = null
    }

    // Set up new channel
    channel.value = client
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
          filter
        },
        callback
      )
    
    // Subscribe to the channel after setting it up
    channel.value.subscribe()
  }

  const cleanup = () => {
    if (channel.value) {
      try {
        channel.value.unsubscribe()
        client.removeChannel(channel.value)
      } catch (err) {
        console.error('Error removing channel during cleanup:', err)
      }
      channel.value = null
    }
  }

  // Add lifecycle hooks for automatic cleanup
  onUnmounted(() => {
    cleanup()
  })

  return {
    channel,
    setupChannel,
    cleanup
  }
}