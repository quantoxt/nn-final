interface ProfileUsername {
  username: string | null;
}

export const useCurrentUserName = () => {
  const name = ref<string | null>(null)
  const client = useSupabaseClient()

  const fetchUserName = async () => {
    try {
      const { data: { user } } = await client.auth.getUser()
      
      if (!user) {
        name.value = null
        return
      }

      const { data: profileData, error } = await client
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single<ProfileUsername>()

      if (error) {
        console.error('Error fetching username:', error)
        name.value = 'User'
        return
      }

      name.value = profileData?.username || 'User'
    } catch (error) {
      console.error('Error in fetchUserName:', error)
      name.value = 'User'
    }
  }

  onMounted(fetchUserName)

  return computed(() => name.value || '?')
}