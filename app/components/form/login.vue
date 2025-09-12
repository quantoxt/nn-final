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

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)

const router = useRouter()
const client = useSupabaseClient()

const handleLogin = async (e: Event) => {
    e.preventDefault()

    isLoading.value = true
    error.value = null

    try {
        const { error: authError } = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })

        if (authError) throw authError

        // Redirect to dashboard after successful login
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
                <CardTitle class="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit="handleLogin">
                    <div class="flex flex-col gap-6">
                        <div class="grid gap-2">
                            <Label for="email">Email</Label>
                            <Input id="email" v-model="email" type="email" placeholder="someone@example.com" required  />
                        </div>
                        <div class="grid gap-2">
                            <div class="flex items-center">
                                <Label for="password">Password</Label>
                                <NuxtLink 
                                to="/auth/forgot-password"
                                    class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                    Forgot your password?
                                </NuxtLink>
                            </div>
                            <Input id="password" v-model="password" type="password"  required  />
                        </div>
                        <div v-if="error" class="text-sm text-red-500">
                            {{ error }}
                        </div>
                        <Button type="submit" class="w-full" :disabled="isLoading">
                            {{ isLoading ? 'Going in...' : 'Login' }}
                        </Button>
                    </div>
                    <div class="mt-4 text-center text-sm">
                        Don't have an account?
                        <NuxtLink to="/auth/sign-up" class="underline underline-offset-4">
                            Sign up
                        </NuxtLink>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>