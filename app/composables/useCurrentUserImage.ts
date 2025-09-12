interface ProfileAvatar {
  avatar_url: string | null;
}

export const useCurrentUserImage = () => {
  const image = ref<string | null>(null)
  const client = useSupabaseClient()

  const fetchUserImage = async () => {
    try {
      const { data: { user } } = await client.auth.getUser()
      
      if (!user) {
        image.value = null
        return
      }

      const { data: profileData, error } = await client
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single<ProfileAvatar>()

      if (error) {
        console.error('Error fetching user profile:', error)
        image.value = null
        return
      }

      image.value = profileData?.avatar_url || null
    } catch (error) {
      console.error('Error in fetchUserImage:', error)
      image.value = null
    }
  }

  onMounted(fetchUserImage)

  return image
}