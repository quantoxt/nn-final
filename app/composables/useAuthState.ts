import { ref, computed, watch } from 'vue'
import type { Database } from '~/types/database.types'
type Profile = Database['public']['Tables']['profiles']['Row']

export const useAuthState = () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient<Database>()
  
  const profile = ref<Profile | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const hasProfile = computed(() => !!profile.value)
  
  const fetchProfile = async () => {
    if (!user.value) {
      profile.value = null
      isLoading.value = false
      return
    }
    
    try {
      isLoading.value = true
      const { data, error: fetchError } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single<Profile>()
      
      if (fetchError) {
        console.error('Error fetching profile:', fetchError)
        error.value = fetchError.message
        profile.value = null
      } else {
        profile.value = data
        error.value = null
      }
    } catch (err) {
      console.error('Profile fetch error:', err)
      error.value = 'Failed to fetch profile'
      profile.value = null
    } finally {
      isLoading.value = false
    }
  }
  
  // Fetch profile when user changes
  watch(user, (newUser) => {
    if (newUser) {
      fetchProfile()
    } else {
      profile.value = null
      isLoading.value = false
    }
  }, { immediate: true })
  
  return {
    user,
    profile,
    isLoading,
    error,
    isAuthenticated,
    hasProfile
  }
}