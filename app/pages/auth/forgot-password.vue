<script lang="ts" setup>
import { ArrowLeft } from 'lucide-vue-next';

definePageMeta({
    layout: 'auth-layout'
})
</script>

<template>
    <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div class="w-full max-w-sm">
            <form-forgot-password />
            <div class="flex items-center justify-center">
                <nuxt-link to="/" class="inline-flex items-center justify-center">
                    <ArrowLeft class="size-5 text-white" /> <button
                        class="px-4 py-1 font-semibold text-sm text-center bg-white border rounded-full inline-flex item-center justify-center my-2">Home</button>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
    
</style>