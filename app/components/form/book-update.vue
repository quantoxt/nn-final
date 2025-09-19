<script setup lang="ts">
import type { Database } from '~/types/database.types'
import { ref, defineEmits, watch } from 'vue'
// Import shadcn components
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'

// Types
type Book = Database['public']['Tables']['books']['Row']
type Category = Pick<Database['public']['Tables']['categories']['Row'], 'slug' | 'name'>
type FormData = Omit<Book, 'id' | 'author_id' | 'created_at' | 'updated_at' | 'reading_sessions_book_id' | 'bookshelves_book_id'> & {
    trope: string; // We're using string for trope in the form
}

// Props
const props = defineProps<{
    book: Book | null
    categories: Category[] | null
    loading: boolean
}>()

// Emits
const emit = defineEmits<{
    (e: 'update-field', field: keyof FormData, value: unknown): void
    (e: 'save-draft' | 'submit-for-review'): void
    (e: 'cover-uploaded', url: string): void
}>()

// Local reactive state for form data
const formData = ref<FormData>({
    title: '',
    description: '',
    cover_image_url: '',
    category_slug: '',
    trope: '',
    status: 'draft',
    label: null,
    slug: '',
})

// Status options
const statusOptions = ['draft', 'pending_review'] as const

// Sync with book prop when it changes
watch(() => props.book, (newBook) => {
    if (newBook) {
        console.log('🔄 Pre-populating form with book data:', newBook)
        formData.value = {
            title: newBook.title,
            description: newBook.description || '',
            cover_image_url: newBook.cover_image_url || '',
            category_slug: newBook.category_slug || '',
            trope: Array.isArray(newBook.trope) ? newBook.trope.join(', ') : '',
            status: newBook.status,
            label: newBook.label,
            slug: newBook.slug || '',
        }
        console.log('📝 Form data after pre-population:', formData.value)
    }
}, { immediate: true, deep: true })

// ✨ IMPROVEMENT: Generate slug automatically when the title changes
watch(() => formData.value.title, (newTitle) => {
    if (!newTitle?.trim()) {
        formData.value.slug = ''
    } else {
        formData.value.slug = newTitle
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }
    emit('update-field', 'slug', formData.value.slug)
})


// Cover image handling
const coverImageFile = ref<File | null>(null)
const coverImageName = ref<string>('')
const errors = ref<Record<string, string>>({})

// Clear error on input
const clearError = (field: string) => {
    delete errors.value[field]
}

// Validate cover image on change
const handleCoverImageChange = (e: Event) => {
    const input = e.target as HTMLInputElement
    if (!input.files || !input.files[0]) return
    const file = input.files[0]
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        errors.value.cover_image = 'Only JPEG, JPG, PNG, and WebP are allowed'
        return
    }
    if (file.size > 5 * 1024 * 1024) {
        errors.value.cover_image = 'Image must be less than 5MB'
        return
    }
    coverImageFile.value = file
    coverImageName.value = file.name
    clearError('cover_image')
}

// Handle cover upload — emit event to parent
const handleCoverUpload = async () => {
    if (!coverImageFile.value) return
    console.log('📤 Uploading cover image...')
    emit('cover-uploaded', '') // placeholder — parent will replace this
}

// Handlers
const handleFieldUpdate = (field: keyof FormData, value: unknown) => {
    (formData.value as any)[field] = value
    emit('update-field', field, value)
    console.log(`📝 Field updated: ${field} = ${value}`)
}
const handleSaveDraft = () => {
    console.log('💾 Save draft clicked')
    emit('save-draft')
}
const handleSubmitForReview = () => {
    console.log('📤 Submit for review clicked')
    console.log('📚 Current book slug:', props.book?.slug)
    console.log('📝 Form data:', formData.value)

    if (!props.book?.slug) {
        console.error('Book slug is missing!')
        return
    }
    console.log('📖 Book from props:', props.book)
    console.log('📝 Book slug:', props.book?.slug)
    // Call update with slug
    useUpdateBook().updateBook(props.book.slug, formData.value)
}
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Book Details</CardTitle>
            <CardDescription>Update your book's metadata.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
            <!-- Title -->
            <div class="space-y-2">
                <Label for="title">Title *</Label>
                <Input id="title" v-model="formData.title" placeholder="Enter book title"
                    :class="{ 'border-red-500': errors.title }"
                    @input="handleFieldUpdate('title', ($event.target as HTMLInputElement).value)" />
                <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
                <p v-if="formData.slug" class="text-xs text-gray-500 mt-1">
                    <span class="font-mono bg-gray-100 px-1.5 py-0.5 rounded">Your book link will be: /books/{{
                        formData.slug }}</span>
                </p>
            </div>
            <!-- Description -->
            <div class="space-y-2">
                <Label for="description">Description</Label>
                <Textarea id="description" v-model="formData.description" placeholder="Write a short description..."
                    rows="4" @input="handleFieldUpdate('description', ($event.target as HTMLInputElement).value)" />
            </div>
            <!-- Cover Image -->
            <div class="space-y-2">
                <Label for="cover">Cover Image</Label>
                <Input id="cover" type="file" accept="image/*" :class="{ 'border-red-500': errors.cover_image }"
                    @change="handleCoverImageChange" />
                <p v-if="coverImageName" class="text-sm text-gray-500 mt-1">Selected: {{ coverImageName }}</p>
                <p v-if="errors.cover_image" class="text-red-500 text-xs mt-1">{{ errors.cover_image }}</p>
                <div v-if="formData.cover_image_url" class="mt-3">
                    <img :src="formData.cover_image_url" alt="Current cover"
                        class="w-32 h-48 object-cover rounded border" />
                </div>
                <Button class="mt-2" type="button" variant="outline" size="sm" :disabled="!coverImageFile"
                    @click="handleCoverUpload">
                    Replace Cover
                </Button>
            </div>
            <!-- Category -->
            <div class="space-y-2">
                <Label for="category">Category *</Label>
                <!-- ✨ FIXED: Using props.categories for the dropdown -->
                <Select :model-value="formData.category_slug"
                    @update:model-value="(value) => handleFieldUpdate('category_slug', value)">
                    <SelectTrigger :class="{ 'border-red-500': errors.category_slug }">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="cat in categories" :key="cat.slug" :value="cat.slug">
                            {{ cat.name }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <p v-if="errors.category_slug" class="text-red-500 text-xs mt-1">{{ errors.category_slug }}</p>
            </div>
            <!-- Trope -->
            <div class="space-y-2">
                <Label for="trope">Tropes (comma-separated) *</Label>
                <Input id="trope" v-model="formData.trope" :class="{ 'border-red-500': errors.trope }"
                    placeholder="enemies-to-lovers, slow-burn, forbidden-love"
                    @input="handleFieldUpdate('trope', ($event.target as HTMLInputElement).value)" />
                <p class="text-xs text-gray-500 mt-1">Separate multiple tropes with commas</p>
                <p v-if="errors.trope" class="text-red-500 text-xs mt-1">{{ errors.trope }}</p>
            </div>
            <!-- Status -->
            <div class="space-y-2">
                <Label>Status</Label>
                <div class="flex items-center gap-4">
                    <Badge v-for="status in statusOptions" :key="status"
                        :variant="formData.status === status ? 'default' : 'outline'" class="cursor-pointer"
                        @click="handleFieldUpdate('status', status)">
                        {{ status.replace('_', ' ') }}
                    </Badge>
                </div>
            </div>
            <!-- Read-Only Slug -->
            <div class="space-y-2">
                <Label>Book Link</Label>
                <Input :value="`/books/${formData.slug}`" disabled class="bg-muted" />
                <p class="text-xs text-gray-500">This link is auto-generated from the title.</p>
            </div>
        </CardContent>
        <CardFooter class="flex justify-between">
            <Button type="button" :disabled="loading" @click="handleSaveDraft">
                {{ loading ? 'Saving...' : 'Save Draft' }}
            </Button>
            <Button type="button" variant="default" :disabled="loading" @click="handleSubmitForReview">
                {{ loading ? 'Submitting...' : 'Submit for Review' }}
            </Button>
        </CardFooter>
        <Alert v-if="errors.global" variant="destructive" class="m-4">
            <AlertDescription>{{ errors.global }}</AlertDescription>
        </Alert>
    </Card>
</template>
