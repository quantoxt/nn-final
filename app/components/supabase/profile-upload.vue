<script setup lang="ts">
import type { Database } from '~/types/database.types'
import { watch, onMounted, onUnmounted, ref } from 'vue'
// Initialize composables
const client = useSupabaseClient<Database>()
const { userId, username, avatarUrl, isInitialLoading, initializeUserData } = useUserProfile()
const { file, error, successMessage,/*  handleFileChange */ } = useFileUpload() // Removed isUploading from composable
const { cleanupOldAvatars, uploadAvatar } = useAvatarStorage()
const { setupChannel, cleanup } = useRealtimeSubscription()
const { greeting, startGreetingUpdates, stopGreetingUpdates } = useGreeting()

// Local loading state for the upload button
const isUploading = ref(false)

// Handle avatar upload
const handleUpload = async () => {
    if (!userId.value || !file.value) return

    // Set loading state to true
    isUploading.value = true
    error.value = null
    successMessage.value = null

    try {
        // Get current user
        const { data: { user } } = await client.auth.getUser()
        if (!user) {
            throw new Error('You must be logged in to upload a file.')
        }

        // Upload avatar and get public URL
        const publicUrl = await uploadAvatar(user.id, file.value)

        // Update user profile
        const { error: updateError } = await client
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id)

        if (updateError) {
            throw new Error(updateError.message)
        }

        // Clean up old avatars
        await cleanupOldAvatars(user.id, 1)

        // Update local state
        avatarUrl.value = publicUrl
        file.value = null
        successMessage.value = 'Profile picture updated successfully!'
    } catch (err: unknown) {
        console.error('Upload failed:', err)
        if (err instanceof Error) {
            error.value = `Upload failed: ${err.message}`
        } else {
            error.value = 'Upload failed due to an unknown error.'
        }
    } finally {
        // Always reset loading state
        isUploading.value = false
    }
}

// Set up Realtime subscription
const setupAvatarSubscription = () => {
    if (!userId.value) return
    setupChannel(
        `avatar-updates-${userId.value}`,
        'profiles',
        `id=eq.${userId.value}`,
        (payload) => {
            if (payload.new && 'avatar_url' in payload.new) {
                avatarUrl.value = payload.new.avatar_url
            }
        }
    )
}

// Initialize component
onMounted(async () => {
    startGreetingUpdates()
    await initializeUserData()
})

// Watch for userId changes to set up Realtime
watch(userId, () => {
    setupAvatarSubscription()
})

// Clean up on unmount
onUnmounted(() => {
    stopGreetingUpdates()
    cleanup()
})

// Computed properties
const initials = computed(() => {
    if (!username.value) return '-_-'
    return username.value
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
})
</script>

<template>
    <div class="flex flex-col items-center justify-center p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
        <!-- Loading state -->
        <supabase-loading-spinner v-if="isInitialLoading" text="Loading profile..." size="md" />
        <!-- Main content -->
        <div v-else class="w-full">
            <h2 class="text-2xl font-bold text-white mb-4">
                {{ greeting }}, {{ username || 'User' }}!
            </h2>
            <div class="flex flex-col items-center gap-4 mb-6">
                <supabase-user-avatar :avatar-url="avatarUrl" :username="username" size="lg" />
                <div class="text-gray-400">Current Profile Picture</div>
            </div>
            <div class="flex flex-col items-center gap-4 w-full">
                <supabase-file-upload-button v-model="file" :error="error" :is-loading="isUploading" />
                <div v-if="successMessage" class="text-green-400 text-sm mt-2 w-full text-center">
                    {{ successMessage }}
                </div>

                <div class="flex flex-col">
                    <supabase-loading-spinner v-if="isUploading" size="sm"/>
                    <Button 
                    v-else :disabled="isUploading || !file" class="w-full max-w-20 inline-flex items-center justify-center gap-2" @click="handleUpload">
                    Upload
                    </Button>
                </div>

            </div>
        </div>
    </div>
</template>