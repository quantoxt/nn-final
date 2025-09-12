<!-- components/FileUploadButton.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { Input } from '~/components/ui/input'

interface Props {
    modelValue: File | null
    accept?: string
    label?: string
    error: string | null
    isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    accept: 'image/png, image/jpeg, image/jpg',
    label: 'Choose pic...',
    isLoading: false
})

const emit = defineEmits<{
    'update:modelValue': [value: File | null]
}>()

const fileName = computed(() => {
    return props.modelValue ? props.modelValue.name : props.label
})

const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const selectedFile = target.files?.[0] || null
    emit('update:modelValue', selectedFile)
}
</script>

<template>
    <div>
        <label class="w-32">
            <Input type="file" :accept="accept" class="hidden"  :disabled="isLoading" @change="handleFileChange"/>
            <div
             class="w-full text-white text-center px-4 py-2 border border-dashed border-gray-600 rounded-md cursor-pointer hover:bg-gray-800 transition-colors duration-200"
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }">
                {{ fileName }}
            </div>
        </label>
        <div v-if="error" class="text-red-400 text-sm mt-2 w-full text-center">
            {{ error }}
        </div>
    </div>
</template>