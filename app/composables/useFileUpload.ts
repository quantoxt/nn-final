import type { Database } from "~/types/database.types"
export const useFileUpload = (bucket: string = 'avatars') => {
  const file = ref<File | null>(null)
  const isUploading = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const client = useSupabaseClient<Database>()

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const selectedFile = target.files?.[0] || null
    
    if (selectedFile) {
      // File size validation (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        error.value = 'File size must be less than 5MB.'
        file.value = null
        return
      }
      
      // File type validation
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(selectedFile.type)) {
        error.value = 'Only PNG, JPEG, and JPG files are allowed.'
        file.value = null
        return
      }
      
      file.value = selectedFile
      error.value = null
      successMessage.value = null
    }
  }

  const uploadFile = async (filePath: string) => {
    if (!file.value) {
      error.value = 'Please select a file to upload.'
      return null
    }
    
    isUploading.value = true
    error.value = null
    successMessage.value = null
    
    try {
      const { error: uploadError } = await client.storage
        .from(bucket)
        .upload(filePath, file.value, {
          cacheControl: '3600',
          upsert: true,
        })
      
      if (uploadError) {
        throw new Error(uploadError.message)
      }
      
      const { data: publicUrlData } = client.storage
        .from(bucket)
        .getPublicUrl(filePath)
      
      if (!publicUrlData?.publicUrl) {
        throw new Error('Could not get public URL for the uploaded file.')
      }
      
      successMessage.value = 'File uploaded successfully!'
      return publicUrlData.publicUrl
    } catch (err: unknown) {
      console.error('Upload failed:', err)
      if (err instanceof Error) {
        error.value = `Upload failed: ${err.message}`
      } else {
        error.value = 'Upload failed due to an unknown error.'
      }
      return null
    } finally {
      isUploading.value = false
    }
  }

  return {
    file,
    isUploading,
    error,
    successMessage,
    handleFileChange,
    uploadFile
  }
}