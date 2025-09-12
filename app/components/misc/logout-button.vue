<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '~/components/ui/button'

const router = useRouter()
const client = useSupabaseClient()
const isLoading = ref(false)

const logout = async () => {
    isLoading.value = true

    try {
        await client.auth.signOut()
        await router.push('/auth/login')
    } catch (error) {
        console.error('Logout error:', error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
  <Button class="bg-black text-white mx-4 hover:bg-black hover:text-white cursor-pointer" :disabled="isLoading" @click="logout" >
    {{ isLoading ? 'Logging out...' : 'Logout' }}
  </Button>
</template>
