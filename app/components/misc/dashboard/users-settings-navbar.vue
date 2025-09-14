<template>
    <nav class="border-b border-gray-200 bg-white flex items-center px-4 py-3">
        <div class="flex items-center gap-1 ml-4">
            <NuxtLink v-for="link in links" :key=link.label :to="link.href"
                class="navbar-link flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors">
                <component :is="link.icon" class="size-4" />
                {{ link.label }}
            </NuxtLink>
        </div>

    </nav>
</template>

<script setup lang="ts">
import {
    Users,
    BookOpen,
    PenIcon,
    Eye
} from 'lucide-vue-next'

// Define dynamic tabs
const links = [
    { label: 'All', href: '/dashboard/users/all', icon: Users },
    { label: 'Readers', href: '/dashboard/users/readers', icon: BookOpen },
    { label: 'Authors', href: '/dashboard/users/authors', icon: PenIcon },
    { label: 'Admins', href: '/dashboard/users/admins', icon: Eye },

]
</script>

<style lang="css" scoped>
@reference "tailwindcss";

.navbar-link.router-link-active {
    @apply bg-red-50 text-red-500 font-semibold;
}
</style>