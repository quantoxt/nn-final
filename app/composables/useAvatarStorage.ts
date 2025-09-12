import type { Database } from "~/types/database.types";
export const useAvatarStorage = () => {
  const client = useSupabaseClient<Database>()
  
  const cleanupOldAvatars = async (userId: string, keepLatest: number = 3) => {
    try {
      const { data, error } = await client.storage
        .from('avatars')
        .list(userId)
      
      if (error) throw error
      
      if (data && data.length > keepLatest) {
        const sortedFiles = data.sort((a, b) => a.name.localeCompare(b.name))
        const filesToRemove = sortedFiles.slice(0, -keepLatest)
        
        for (const file of filesToRemove) {
          await client.storage
            .from('avatars')
            .remove([`${userId}/${file.name}`])
        }
      }
    } catch (err) {
      console.error('Error cleaning up old avatars:', err)
    }
  }
  
  const uploadAvatar = async (userId: string, file: File) => {
    // Get file extension
    const fileNameParts = file.name.split('.')
    if (fileNameParts.length < 2) {
      throw new Error('File has no extension.')
    }
    const fileExt = fileNameParts.pop()?.toLowerCase()
    if (!fileExt) {
      throw new Error('Invalid file extension.')
    }
    
    // Create unique file path
    const timestamp = Date.now()
    const filePath = `${userId}/${timestamp}.${fileExt}`
    
    // Upload file
    const { error: uploadError } = await client.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })
    
    if (uploadError) {
      throw new Error(uploadError.message)
    }
    
    // Get public URL
    const { data: publicUrlData } = client.storage
      .from('avatars')
      .getPublicUrl(filePath)
    
    if (!publicUrlData?.publicUrl) {
      throw new Error('Could not get public URL for the uploaded file.')
    }
    
    return publicUrlData.publicUrl
  }
  
  return {
    cleanupOldAvatars,
    uploadAvatar
  }
}