<script lang="ts" setup>
import { ArrowLeft } from 'lucide-vue-next';

definePageMeta({
    middleware: "auth",
    layout: 'auth-layout'
})
</script>

<template>
    <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div class="w-full max-w-sm">
            <form-login />
        </div>
        <div>
            <nuxt-link to="/">
                <button class="px-4 py-1 font-semibold text-sm">
                    <ArrowLeft class="size-4" /> Back Home
                </button>
            </nuxt-link>
        </div>
    </div>
</template>

<style lang="postcss" scoped>

</style>