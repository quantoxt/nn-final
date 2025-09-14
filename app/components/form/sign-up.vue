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
const repeatPassword = ref('')
const username = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)

const router = useRouter()
const client = useSupabaseClient()
const origin = useRequestURL().origin

const handleSignUp = async (e: Event) => {
    e.preventDefault()

    isLoading.value = true
    error.value = null

    // Validate that passwords match
    if (password.value !== repeatPassword.value) {
        error.value = 'Passwords do not match'
        isLoading.value = false
        return
    }

    try {
        // Sign up the user
        const { data, error: authError } = await client.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                emailRedirectTo: `${origin}/dashboard`,
                data: {
                    username: username.value.toLowerCase().trim()
                }
            },
        })

        if (authError) throw authError

        // Redirect to success page
        await router.push('/auth/sign-up-success')
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
                <CardTitle class="text-2xl">Sign up</CardTitle>
                <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit="handleSignUp">
                    <div class="flex flex-col gap-6">
                        <div class="grid gap-2">
                            <Label for="email">Email</Label>
                            <Input id="email" v-model="email" type="email" placeholder="reader@example.com" required  />
                        </div>
                        <div class="grid gap-2">
                            <Label for="username">Username</Label>
                            <Input id="username" v-model="username" type="text" placeholder="zara_leo" required  />
                        </div>
                        <div class="grid gap-2">
                            <div class="flex items-center">
                                <Label for="password">Password</Label>
                            </div>
                            <Input id="password" v-model="password" type="password" required  />
                        </div>
                        <div class="grid gap-2">
                            <div class="flex items-center">
                                <Label for="repeat-password">Repeat Password</Label>
                            </div>
                            <Input id="repeat-password" v-model="repeatPassword" type="password" required  />
                        </div>
                        <div v-if="error" class="text-sm text-red-500">
                            {{ error }}
                        </div>
                        <Button type="submit" class="w-full" :disabled="isLoading">
                            {{ isLoading ? 'Creating an account...' : 'Sign up' }}
                        </Button>
                    </div>
                    <div class="mt-4 text-center text-sm">
                        Already have an account?
                        <NuxtLink to="/auth/login" class="underline underline-offset-4">
                            Login
                        </NuxtLink>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>