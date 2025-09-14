<template>
    <form @submit.prevent="handleSubmit" class="space-y-6 max-w-2xl">
        <!-- Title -->
        <div>
            <Label for="title" class="text-sm font-medium">Book Title *</Label>
            <Input id="title" v-model="formData.title" placeholder="Enter book title" class="mt-1"
                :class="{ 'border-red-500': errors.title }" @input="generateSlug" />
            <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
            <p v-if="formData.slug" class="text-xs text-gray-500 mt-1">
                <span class="font-mono bg-gray-100 px-1.5 py-0.5 rounded">Your book link will be: {{
                    formData.slug}}</span>
            </p>
        </div>

        <!-- Description -->
        <div>
            <Label for="description" class="text-sm font-medium">Description</Label>
            <Textarea id="description" v-model="formData.description" placeholder="Write a short description..."
                class="mt-1" :rows="4" />
        </div>

        <!-- Cover Image Upload -->
        <div>
            <Label for="cover_image" class="text-sm font-medium">Upload Cover Image *</Label>
            <Input id="cover_image" type="file" accept="image/*" @change="handleCoverImageChange" class="mt-1"
                :class="{ 'border-red-500': errors.cover_image }" />
            <p v-if="coverImageName" class="text-sm text-gray-500 mt-1">Selected: {{ coverImageName }}</p>
            <p v-if="errors.cover_image" class="text-red-500 text-xs mt-1">{{ errors.cover_image }}</p>
        </div>

        <!-- Category Slug -->
        <div>
            <Label for="category_slug" class="text-sm font-medium">Category *</Label>
            <Select v-model="formData.category_slug" @update:model-value="clearError('category_slug')">
                <SelectTrigger id="category_slug" :class="{ 'border-red-500': errors.category_slug }">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="billionaire">Billionaire</SelectItem>
                    <SelectItem value="mafia">Mafia</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="erotica">Erotica</SelectItem>
                    <SelectItem value="lgbtq">LGBTQ</SelectItem>
                    <SelectItem value="young-adult">Young Adult</SelectItem>
                    <SelectItem value="werewolf">Werewolf</SelectItem>
                </SelectContent>
            </Select>
            <p v-if="errors.category_slug" class="text-red-500 text-xs mt-1">{{ errors.category_slug }}</p>
        </div>

        <!-- ✅ Trope -->
        <div>
            <Label for="trope" class="text-sm font-medium">Tropes (comma-separated) *</Label>
            <Input id="trope" v-model="formData.trope" placeholder="enemies-to-lovers, slow-burn, forbidden-love"
                class="mt-1" :class="{ 'border-red-500': errors.trope }" />
            <p class="text-xs text-gray-500 mt-1">Separate multiple tropes with commas</p>
            <p v-if="errors.trope" class="text-red-500 text-xs mt-1">{{ errors.trope }}</p>
        </div>

        <!-- Chapter Number -->
        <div>
            <Label for="chapter_number" class="text-sm font-medium">Chapter Number *</Label>
            <Input id="chapter_number" v-model.number="formData.chapter_number" placeholder="1" class="mt-1"
                type="number" min="1" max="1" disabled :class="{ 'border-red-500': errors.chapter_number }" />
            <p class="text-xs text-gray-500 mt-1">First chapter — cannot be changed</p>
            <p v-if="errors.chapter_number" class="text-red-500 text-xs mt-1">{{ errors.chapter_number }}</p>
        </div>

        <!-- Chapter Title -->
        <div>
            <Label for="chapter_title" class="text-sm font-medium">Chapter Title *</Label>
            <Input id="chapter_title" v-model="formData.chapter_title" placeholder="Enter chapter title" class="mt-1"
                :class="{ 'border-red-500': errors.chapter_title }" />
            <p v-if="errors.chapter_title" class="text-red-500 text-xs mt-1">{{ errors.chapter_title }}</p>
        </div>

        <!-- Chapter Content -->
        <div>
            <Label for="chapter_content" class="text-sm font-medium">Chapter Content *</Label>
            <Textarea id="chapter_content" v-model="formData.chapter_content"
                placeholder="Paste or type your chapter content here..." class="mt-1" :rows="6"
                :class="{ 'border-red-500': errors.chapter_content }" />
            <p v-if="errors.chapter_content" class="text-red-500 text-xs mt-1">{{ errors.chapter_content }}</p>
        </div>

        <!-- Pricing & Lock -->
        <div class="grid grid-cols-2 gap-4">
            <div>
                <Label for="coin_cost" class="text-sm font-medium">Coin Cost (max 10)</Label>
                <Input id="coin_cost" v-model.number="formData.coin_cost"
                    :placeholder="formData.is_locked ? '0 - 10' : 'Free'" class="mt-1" type="number"
                    :min="formData.is_locked ? 0 : 0" :max="formData.is_locked ? 10 : 0" :disabled="!formData.is_locked"
                    :class="{ 'border-red-500': errors.coin_cost }" />
                <p v-if="errors.coin_cost" class="text-red-500 text-xs mt-1">{{ errors.coin_cost }}</p>
            </div>
            <div class="flex items-end">
                <div class="flex items-center space-x-2">
                    <Checkbox id="is_locked" v-model="formData.is_locked" class="h-4 w-4"
                        @update:model-value="onLockChange" />
                    <Label for="is_locked" class="text-sm font-medium">Lock Chapter</Label>
                </div>
            </div>
        </div>

        <!-- Draft / Submit Toggle -->
        <div class="flex items-center space-x-4 pt-2">
            <div class="flex items-center space-x-2">
                <RadioGroup v-model="isDraft" class="flex">
                    <div class="flex items-center space-x-2">
                        <RadioGroupItem id="draft" value="true" />
                        <Label for="draft">Save as Draft</Label>
                    </div>
                    <div class="flex items-center space-x-2 ml-6">
                        <RadioGroupItem id="submit" value="false" />
                        <Label for="submit">Submit for Review</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
            <Button type="submit" :disabled="uploading" class="w-full">
                <SpinnerIcon v-if="uploading" class="mr-2 h-4 w-4 animate-spin" />
                {{ uploading ? 'Uploading...' : isDraft === 'true' ? 'Save Draft' : 'Submit for Review' }}
            </Button>
        </div>

        <!-- Error Alert -->
        <Alert v-if="formError" variant="destructive" class="mt-4">
            <AlertDescription>{{ formError }}</AlertDescription>
        </Alert>
    </form>
</template>

<script setup lang="ts">
// ✅ Folder-based shadcn-vue imports
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '~/components/ui/select'
import { Button } from '~/components/ui/button'
import {
    RadioGroup,
    RadioGroupItem
} from '~/components/ui/radio-group'
import {
    Alert,
    AlertDescription
} from '~/components/ui/alert'
import { Checkbox } from '~/components/ui/checkbox'

import { ref, reactive, watch, defineComponent, h } from 'vue'
import { useUploadBook } from '~/composables/useUploadBook'

// ✅ Mock Spinner
const SpinnerIcon = defineComponent({
    render() {
        return h('div', { class: 'inline-block h-4 w-4 rounded-full border-2 border-t-transparent' })
    }
})

// ✅ Updated FormData interface — added trope
interface FormData {
    title: string
    slug: string
    description: string
    cover_image_url: string
    category_slug: string
    trope: string // ✅ ADDED — will be split server-side
    chapter_number: number
    chapter_title: string
    chapter_content: string
    coin_cost: number
    is_locked: boolean
}

// ✅ Reactive state — added trope
const formData = reactive<FormData>({
    title: '',
    slug: '',
    description: '',
    cover_image_url: '',
    category_slug: '',
    trope: '', // ✅ ADDED
    chapter_number: 1,
    chapter_title: '',
    chapter_content: '',
    coin_cost: 0,
    is_locked: true
})

const coverImageFile = ref<File | null>(null)
const coverImageName = ref<string>('')
const isDraft = ref('true')
const errors = reactive<Record<string, string>>({})
const formError = ref<string | null>(null)
const uploading = ref(false)

// Initialize upload composable
const { upload, error: uploadError, loading: uploadingRef } = useUploadBook()
uploading.value = uploadingRef.value

watch(uploadingRef, (val) => {
    uploading.value = val
})

// ✅ Generate slug
const generateSlug = () => {
    if (!formData.title?.trim()) {
        formData.slug = ''
        return
    }
    formData.slug = formData.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

// Handle cover image selection
const handleCoverImageChange = (e: Event) => {
    const input = e.target as HTMLInputElement
    if (input.files && input.files[0]) {
        coverImageFile.value = input.files[0]
        coverImageName.value = input.files[0].name
        clearError('cover_image')
    }
}

// Handle lock toggle → reset coin_cost if unlocked
const onLockChange = () => {
    if (!formData.is_locked) {
        formData.coin_cost = 0
    }
}

const clearError = (field: string) => {
    errors[field] = ''
}

// ✅ Validate — added trope
const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.slug) newErrors.title = 'Could not generate slug (invalid title)'
    if (!coverImageFile.value) newErrors.cover_image = 'Cover image is required'
    if (!formData.category_slug) newErrors.category_slug = 'Category is required'
    if (!formData.trope?.trim()) newErrors.trope = 'At least one trope is required' // ✅ ADDED
    if (formData.chapter_number !== 1) newErrors.chapter_number = 'First chapter only'
    if (!formData.chapter_title.trim()) newErrors.chapter_title = 'Chapter title is required'
    if (!formData.chapter_content.trim()) newErrors.chapter_content = 'Chapter content is required'
    if (formData.is_locked && formData.coin_cost > 10) newErrors.coin_cost = 'Max coin cost is 10'

    Object.assign(errors, newErrors)
    return Object.keys(newErrors).length === 0
}

// Handle form submission
const handleSubmit = async () => {
    formError.value = null

    generateSlug()

    if (!validate()) return

    try {
        await upload(coverImageFile.value!, {
            ...formData,
            chapter_number: 1,
            isDraft: isDraft.value === 'true'
        })

        // Reset form
        Object.assign(formData, {
            title: '',
            slug: '',
            description: '',
            cover_image_url: '',
            category_slug: '',
            trope: '', // ✅ Reset trope
            chapter_number: 1,
            chapter_title: '',
            chapter_content: '',
            coin_cost: 0,
            is_locked: true
        })
        coverImageFile.value = null
        coverImageName.value = ''
        isDraft.value = 'true'

        alert('Book and chapter uploaded successfully!')

    } catch (err: unknown) {
        if (err instanceof Error) {
            formError.value = uploadError.value || err.message || 'Upload failed. Please try again.'
        } else {
            formError.value = 'An unknown error occurred.'
        }
    }
}
</script>