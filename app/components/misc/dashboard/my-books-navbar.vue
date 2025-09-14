<template>
    <nav class="border-b border-gray-200 bg-white flex items-center px-4 py-3">
        <div class="flex items-center gap-1 ml-4">
            <NuxtLink
             v-for="link in links" :key=link.label :to="link.href"
                class="navbar-link flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors">
                <component :is="link.icon" class="size-4" />
                {{ link.label }}
            </NuxtLink>
        </div>

    </nav>
</template>

<script setup lang="ts">
import {
    Hourglass,
    BookOpenText,
    PenIcon,
    X,
    PartyPopper,
    CircleFadingPlus
} from 'lucide-vue-next'

// Define dynamic tabs
const links = [
    { label: 'All', href: '/dashboard/my-books/all', icon: BookOpenText },
    { label: 'Published', href: '/dashboard/my-books/published', icon: PartyPopper },
    { label: 'Pending', href: '/dashboard/my-books/pending', icon: Hourglass },
    { label: 'Drafts', href: '/dashboard/my-books/drafts', icon: PenIcon },
    { label: 'Rejected', href: '/dashboard/my-books/rejected', icon: X },
    {label: 'Add New Book', href:'/dashboard/my-books/new-book', icon: CircleFadingPlus}

]
</script>

<style lang="css" scoped>
@reference "tailwindcss";

.navbar-link.router-link-active {
    @apply bg-red-50 text-red-500 font-semibold;
}
</style>