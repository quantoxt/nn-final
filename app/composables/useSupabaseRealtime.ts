import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

// Define a base type for JSON-like objects for cleaner code
type JsonObject = Record<string, unknown>

export const useSupabaseRealtime = () => {
  const { $supabase } = useNuxtApp()
  const subscriptions = ref(new Map<string, RealtimeChannel>())

  /**
   * Subscribes to database changes on a specific table.
   * For maximum type safety, provide the table's row type from your
   * Supabase generated types, e.g., subscribeToTable<Tables<'posts'>['Row']>(...)
   */
  const subscribeToTable = <T extends JsonObject>(
    table: string,
    callback: (payload: RealtimePostgresChangesPayload<T>) => void,
    options?: {
      event?: '*' | 'INSERT' | 'UPDATE' | 'DELETE'
      filter?: string
    },
  ) => {
    const channelName = `${table}-${options?.filter || ''}-${Date.now()}`
    
    const channel = $supabase
      .channel(channelName)
      .on<T>(
        'postgres_changes',
        {
          event: options?.event || '*',
          schema: 'public',
          table,
          filter: options?.filter,
        },
        callback,
      )
      .subscribe()

    subscriptions.value.set(channelName, channel)

    return {
      unsubscribe: () => {
        channel.unsubscribe()
        subscriptions.value.delete(channelName)
      },
    }
  }

  /**
   * Subscribes to a broadcast channel to receive messages.
   * The callback will receive the payload of the broadcast event.
   */
  const subscribeToChannel = <T extends JsonObject>(
    channelName: string,
    callback: (payload: T) => void,
    options?: {
      event?: string
    },
  ) => {
    const channel = $supabase.channel(channelName)

    channel
      .on('broadcast', { event: options?.event || '*' }, (message) => {
        // Extract the inner `payload` for better ergonomics in the callback
        callback(message.payload as T)
      })
      .subscribe()

    subscriptions.value.set(channelName, channel)

    return {
      unsubscribe: () => {
        channel.unsubscribe()
        subscriptions.value.delete(channelName)
      },
    }
  }

  /**
   * Broadcasts a message with a payload to a specific channel.
   */
  const broadcastToChannel = async <T extends JsonObject>(
    channelName: string,
    event: string,
    payload: T,
  ) => {
    try {
      const channel = $supabase.channel(channelName)
      return await channel.send({
        type: 'broadcast',
        event,
        payload,
      })
    }
    catch (error) {
      console.error('Broadcast error:', error)
      throw error
    }
  }

  /**
   * Unsubscribes from all active channels.
   */
  const unsubscribeAll = () => {
    $supabase.removeAllChannels()
    subscriptions.value.clear()
  }

  onUnmounted(() => {
    unsubscribeAll()
  })

  return {
    subscriptions: readonly(subscriptions),
    subscribeToTable,
    subscribeToChannel,
    broadcastToChannel,
    unsubscribeAll,
  }
}