<script setup lang="ts">
import { MailIcon  } from 'lucide-vue-next';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
definePageMeta({
    middleware: 'auth',
    layout: 'auth-layout'
})
</script>

<template>
    <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div class="w-full max-w-sm">
            <div class="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle class="text-2xl card-title">Thank you for signing up!</CardTitle>
                        <CardDescription>Check your email to confirm</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p class="text-sm text-muted-foreground">
                            You&apos;ve successfully signed up. Please check your email to confirm your account
                            before signing in.
                        </p>
                    </CardContent>
                </Card>
                <div class="flex items-center justify-center">
                    <nuxt-link to="https://mail.google.com" class="inline-flex items-center justify-center">
                        <MailIcon class="size-5 text-white" />
                        <button
                            class="px-4 py-1 font-semibold text-sm text-center bg-white border rounded-full inline-flex item-center justify-center my-2">Open
                            Mail</button>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </div>
</template>