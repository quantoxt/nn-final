<script setup lang="ts">
import type { Database } from '~/types/database.types'
type Role = Database['public']['Enums']['user_role']


interface Props {
    roles: Role | Role[]
    includeHigher?: boolean  // Include roles with higher permissions
    fallback?: string
    showFallback?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    includeHigher: true,
    fallback: 'You do not have permission to view this content.',
    showFallback: true
})

const { hasRole} = useAuthorization()

const shouldRender = computed(() => {
    if (Array.isArray(props.roles)) {
        return props.roles.some(role => hasRole(role, props.includeHigher))
    }
    return hasRole(props.roles, props.includeHigher)
})
</script>

<template>
    <slot v-if="shouldRender" />
    <div v-else-if="showFallback" class="p-4 bg-red-50 text-red-800 rounded-md">
        {{ props.fallback }}
    </div>
</template>