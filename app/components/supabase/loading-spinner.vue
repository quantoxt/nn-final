<!-- components/LoadingSpinner.vue -->
<script setup lang="ts">
interface Props {
    text?: string
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    text: '',
    size: 'md'
})
const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-12 h-12',
    lg: 'w-32 h-32'
}
</script>

<template>
    <div class="flex flex-col items-center justify-center py-5">
        <div class="animate-spin rounded-full border-b-2 border-white" :class="sizeClasses[size]" />
        <p class="text-gray-400 ">{{ props.text }}</p>
    </div>
</template>