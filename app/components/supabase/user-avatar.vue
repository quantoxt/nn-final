<!-- components/UserAvatar.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

interface Props {
    avatarUrl?: string | null
    username?: string | null
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    avatarUrl: null,
    username: null,
    size: 'md'
})

const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
}

const initials = computed(() => {
    if (!props.username) return '?'
    return props.username
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
})
</script>

<template>
    <Avatar :class="sizeClasses[size]">
        <AvatarImage v-if="avatarUrl" :src="avatarUrl" :alt="initials" />
        <AvatarFallback>{{ initials }}</AvatarFallback>
    </Avatar>
</template>