import type { Database } from "~/types/database.types"
export const useUserProfile = () => {
  const userId = ref<string | null>(null)
  const username = ref<string | null>(null)
  const avatarUrl = ref<string | null>(null)
  const isInitialLoading = ref(true)
  const client = useSupabaseClient<Database>()
  type Profile = Database['public']['Tables']['profiles']['Row']

  const initializeUserData = async () => {
    try {
      const { data: { user } } = await client.auth.getUser()
      if (user) {
        userId.value = user.id
        
        const { data: profile, error: profileError } = await client
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single<Profile>()
        
        if (profileError) {
          console.error('Error fetching profile:', profileError)
        } else if (profile) {
          username.value = profile.username
          avatarUrl.value = profile.avatar_url
        }
      }
    } catch (err) {
      console.error('Error initializing user data:', err)
    } finally {
      isInitialLoading.value = false
    }
  }

  return {
    userId,
    username,
    avatarUrl,
    isInitialLoading,
    initializeUserData
  }
}