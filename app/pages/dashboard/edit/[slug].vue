<!-- pages/dashboard/edit/[slug].vue -->
<script setup lang="ts">
import type { Database } from '~/types/database.types'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { toast } from 'vue-sonner'

// Types
type Book = Database['public']['Tables']['books']['Row']
type Category = Pick<Database['public']['Tables']['categories']['Row'], 'slug' | 'name'>

// Route
const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

// Fetch book and categories
const { book, pending: bookLoading, error: bookError } = useBook(slug)
const { data: categories, pending: categoriesLoading, error: categoriesError } = useCategories()

// Update logic
const { update: updateBook, loading: updating, error: updateError } = useUpdateBook(slug)

// Form state — synced to book
const formData = ref<Omit<Book, 'id' | 'author_id' | 'created_at' | 'updated_at' | 'reading_sessions_book_id' | 'bookshelves_book_id'>>({
    title: '',
    description: '',
    cover_image_url: '',
    category_slug: '',
    trope: '',
    status: 'draft',
    label: null,
    slug: '', // Added slug field
    published_at: null,
    rating: 0,
    saves: 0,
})

// Cover image upload state
const coverImageFile = ref<File | null>(null)

// Sync form with fetched book
watch(book, (newBook) => {
    if (newBook) {
        console.log('🔄 Parent: Syncing form with book data:', newBook)
        formData.value = {
            title: newBook.title,
            description: newBook.description || '',
            cover_image_url: newBook.cover_image_url || '',
            category_slug: newBook.category_slug || '',
            trope: newBook.trope?.join(', ') || '',
            status: newBook.status,
            label: newBook.label,
            slug: newBook.slug || '', // Added slug sync
            published_at: newBook.published_at,
            rating: newBook.rating,
            saves: newBook.saves,
        }
        console.log('📝 Parent: Form data after sync:', formData.value)
    }
}, { immediate: true })

// Handle cover image upload → replace existing
const handleCoverUploaded = async () => {
    if (!coverImageFile.value) return
    try {
        console.log('📤 Parent: Handling cover image upload...')
        const result = await updateBook(coverImageFile.value, {})
        if (result.success) {
            console.log('✅ Parent: Cover image uploaded successfully')
            // Optimistically update the form data
            if (book.value) {
                formData.value.cover_image_url = book.value.cover_image_url || ''
            }
            coverImageFile.value = null
            toast.success('Cover updated!')
        } else {
            console.error('❌ Parent: Cover upload failed:', result.message)
            throw new Error(result.message)
        }
    } catch (err: unknown) {
        console.error('❌ Parent: Error uploading cover:', err)
        toast.error(err instanceof Error ? err.message : 'Failed to update cover')
    }
}

// Handle field updates from form
const handleFieldUpdate = (field: keyof typeof formData.value, value: unknown) => {
    console.log(`📝 Parent: Field update received: ${field} = ${value}`)
    formData.value[field] = value
}

// Save handlers
const handleSaveDraft = async () => {
    try {
        console.log('💾 Parent: Saving draft...')
        console.log('📤 Parent: Sending data:', {
            ...formData.value
        })

        const result = await updateBook(null, {
            ...formData.value
        })

        if (result.success) {
            console.log('✅ Parent: Draft saved successfully')
            // If slug changed, redirect to new URL
            if (result.book && result.book.slug !== slug) {
                console.log('🔀 Redirecting to new slug:', result.book.slug)
                await router.push(`/dashboard/edit/${result.book.slug}`)
            }
            toast.success('Draft saved!')
        } else {
            console.error('❌ Parent: Failed to save draft:', result.message)
            throw new Error(result.message)
        }
    } catch (err: unknown) {
        console.error('❌ Parent: Error saving draft:', err)
        toast.error(err instanceof Error ? err.message : 'Failed to save draft')
    }
}

const handleSubmitForReview = async () => {
    try {
        console.log('📤 Parent: Submitting for review...')
        console.log('📤 Parent: Sending data:', {
            ...formData.value,
            status: 'pending_review',
        })

        const result = await updateBook(null, {
            ...formData.value,
            status: 'pending_review',
        })

        if (result.success) {
            console.log('✅ Parent: Book submitted for review successfully')
            toast.success('Submitted for review!')
            await router.push('/dashboard/my-books')
        } else {
            console.error('❌ Parent: Failed to submit for review:', result.message)
            throw new Error(result.message)
        }
    } catch (err: unknown) {
        console.error('❌ Parent: Error submitting for review:', err)
        toast.error(err instanceof Error ? err.message : 'Failed to submit')
    }
}
</script>

<template>
    <div class="container py-8 max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Edit Book</h1>

        <!-- Loading -->
        <div v-if="bookLoading || categoriesLoading" class="space-y-4">
            <div class="h-8 bg-muted rounded animate-pulse" />
            <div class="h-64 bg-muted rounded animate-pulse" />
        </div>

        <!-- Errors -->
        <div v-else-if="bookError || categoriesError || updateError"
            class="p-4 bg-destructive/10 text-destructive rounded">
            {{ bookError?.message || categoriesError?.message || updateError?.message }}
        </div>

        <!-- Not Found -->
        <div v-else-if="!book" class="p-4 text-center text-muted-foreground">
            Book not found or you don't have access.
        </div>

        <!-- Main Form -->
        <div v-else>
            <FormBookUpdate :book="book" :categories="categories" :loading="updating"
                @update-field="handleFieldUpdate" @save-draft="handleSaveDraft"
                @submit-for-review="handleSubmitForReview" @cover-uploaded="handleCoverUploaded" />
        </div>
    </div>
</template>