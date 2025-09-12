<template>
    <nav class="border-b border-gray-200 bg-white flex items-center px-4 py-3">
        <div class="flex items-center gap-1 ml-4">
            <NuxtLink
                 v-for="link in links" :key=link.label :to="link.href"
                class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                >
                <component :is="link.icon" class="size-4" />
                {{ link.label }}
            </NuxtLink>
        </div>

    </nav>
</template>

<script setup lang="ts">
import {
    SettingsIcon,
    CircleUser
} from 'lucide-vue-next'

// Define dynamic tabs
const links = [
    {  label: 'Profile', href: '/dashboard/settings/profile', icon: CircleUser },
    {  label: 'Account', href: '/dashboard/settings/account', icon: SettingsIcon },
]
</script>

<style lang="css" scoped>
@reference "tailwindcss";

.router-link-active {
    @apply bg-rose-50 text-rose-500 font-semibold;
}
</style>