<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const route = useRoute()
const error = computed(() => route.query.error || 'An unspecified error occurred.')

definePageMeta({
    layout: 'auth-layout'
})
</script>

<template>
    <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div class="w-full max-w-sm">
            <div class="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle class="text-2xl card-title">Sorry, something went wrong.</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p class="text-sm text-muted-foreground">Code error: {{ error }}</p>
                    </CardContent>
                </Card>
            </div>
            <div class="flex items-center justify-center">
                <nuxt-link to="/" class="inline-flex items-center justify-center">
                    <ArrowLeft class="size-5 text-white" /> <button
                        class="px-4 py-1 font-semibold text-sm text-center bg-white border rounded-full inline-flex item-center justify-center my-2">Home</button>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>