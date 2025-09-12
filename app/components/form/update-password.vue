<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '~/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface Props {
    class?: string
}

const props = defineProps<Props>()

const password = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)

const router = useRouter()
const client = useSupabaseClient()

const handleUpdatePassword = async (e: Event) => {
    e.preventDefault()

    isLoading.value = true
    error.value = null

    try {
        const { error: updateError } = await client.auth.updateUser({
            password: password.value
        })

        if (updateError) throw updateError

        // Redirect to protected route after successful password update
        await router.push('/dashboard')
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : 'An error occurred'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div :class="['flex flex-col gap-6', props.class]">
        <Card>
            <CardHeader>
                <CardTitle class="text-2xl">Reset Your Password</CardTitle>
                <CardDescription>Please enter your new password below.</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit="handleUpdatePassword">
                    <div class="flex flex-col gap-6">
                        <div class="grid gap-2">
                            <Label for="password">New password</Label>
                            <Input id="password" v-model="password" type="password" placeholder="New password" required/>
                        </div>
                        <div v-if="error" class="text-sm text-red-500">
                            {{ error }}
                        </div>
                        <Button type="submit" class="w-full" :disabled="isLoading">
                            {{ isLoading ? 'Saving...' : 'Save new password' }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>