<!-- components/dashboard/books/BookEditPage.vue -->
<script setup lang="ts">
import type { Database } from '~/types/database.types'
import { reactive, computed, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { toast } from 'vue-sonner'

//type Book = Database['public']['Tables']['books']['Row']
type Chapter = Database['public']['Tables']['chapters']['Row']
type BookStatus = Database['public']['Enums']['book_status']
type BookLabel = Database['public']['Enums']['book_label']

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

// Fetch data — correct destructuring (AsyncData → use .value)
const { data: book, pending: bookLoading, error: bookError } = useBook(slug)
const { data: chapters, pending: chaptersLoading, error: chaptersError } = useChapters(slug)
const { data: categories, pending: categoriesLoading, error: categoriesError } = useCategories()

// Mutation tools — your structure
const { update: updateBook, pending: updateBookPending, error: updateBookError } = useUpdateBook(slug)
const { create: createChapter, pending: createChapterPending } = useCreateChapter(slug)
const { reorder: reorderChapters, pending: reorderPending } = useReorderChapters(slug)

// Form state — fully typed
const formData = reactive<{
    title: string
    description: string
    cover_image_url: string
    category_slug: string
    trope: string[]
    status: BookStatus
    label: BookLabel | null
}>({
    title: '',
    description: '',
    cover_image_url: '',
    category_slug: '',
    trope: [],
    status: 'draft',
    label: null
})

// Sync formData with fetched book
watch(book, (newBook) => {
    if (newBook) {
        Object.assign(formData, {
            title: newBook.title,
            description: newBook.description || '',
            cover_image_url: newBook.cover_image_url || '',
            category_slug: newBook.category_slug || '',
            trope: newBook.trope || [],
            status: newBook.status,
            label: newBook.label
        })
    }
})

// Dirty check
const isDirty = computed(() => {
    if (!book.value) return false
    return (
        formData.title !== book.value.title ||
        formData.description !== book.value.description ||
        formData.cover_image_url !== book.value.cover_image_url ||
        formData.category_slug !== book.value.category_slug ||
        JSON.stringify(formData.trope) !== JSON.stringify(book.value.trope || []) ||
        formData.status !== book.value.status ||
        formData.label !== book.value.label
    )
})

// Save handlers
const saveDraft = async () => {
    const result = await updateBook({
        ...formData,
        status: 'draft'
    })

    if (result === null) {
        toast.error(updateBookError.value?.message || 'Unknown error', { description: 'Save Failed' })
        return
    }

    toast.success('Your changes have been saved.', { description: 'Draft Saved' })
}

const submitForReview = async () => {
    const result = await updateBook({
        ...formData,
        status: 'pending_review'
    })

    if (result === null) {
        toast.error(updateBookError.value?.message || 'Unknown error', { description: 'Submission Failed' })
        return
    }

    toast.success('Your book is under review.', { description: 'Submitted for Review' })
    await router.push('/dashboard/books')
}

// Chapter handlers
const handleAddChapter = async () => {
    const newChapter = await createChapter({
        chapter_title: 'Untitled Chapter',
        content: '',
        is_locked: false
    })

    if (newChapter && chapters.value) {
        chapters.value.push(newChapter)
        chapters.value.sort((a: Chapter, b: Chapter) => a.chapter_number - b.chapter_number) // ✅ Typed
    }
}

const handleUpdateChapterField = async (
    chapterId: string,
    field: keyof Pick<Chapter, 'chapter_title' | 'is_locked' | 'coin_cost'>,
    value: Chapter[typeof field]
) => {
    const { update: updateChapter, error: updateChapterError } = useUpdateChapter(chapterId)
    const result = await updateChapter({
        [field]: value
    } as Partial<Chapter>)

    if (result === null) {
        toast.error(updateChapterError.value?.message || 'Unknown error', { description: 'Update Failed' })
        return
    }

    if (chapters.value) {
        const idx = chapters.value.findIndex((c: Chapter) => c.id === chapterId) // ✅ Typed
        if (idx >= 0) {
            chapters.value[idx] = { ...chapters.value[idx], [field]: value } as Chapter // ✅ Cast
        }
    }
}

const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return

    const { remove } = useDeleteChapter(chapterId)
    const success = await remove()

    if (success && chapters.value) {
        chapters.value = chapters.value.filter((c: Chapter) => c.id !== chapterId) // ✅ Typed
        toast.success('The chapter has been removed.', { description: 'Chapter Deleted' })
    }
}

const handleReorderChapters = async (newOrder: Chapter[]) => {
    const updates = newOrder.map((ch, idx) => ({
        id: ch.id,
        chapter_number: idx + 1
    }))

    const result = await reorderChapters(updates)
    if (!result && chapters.value) {
        // Revert on failure
        chapters.value.sort((a: Chapter, b: Chapter) => a.chapter_number - b.chapter_number) // ✅ Typed
    }
}

// Navigation guard
onBeforeRouteLeave((to, from, next) => {
    if (isDirty.value && !confirm('You have unsaved changes. Leave anyway?')) {
        next(false)
    } else {
        next()
    }
})
</script>

<template>
    <div class="container py-8 max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Edit Book</h1>

        <!-- Loading -->
        <div v-if="bookLoading || chaptersLoading || categoriesLoading" class="space-y-4">
            <div class="h-8 bg-muted rounded animate-pulse" />
            <div class="h-64 bg-muted rounded animate-pulse" />
        </div>

        <!-- Errors -->
        <div 
            v-else-if="bookError || chaptersError || categoriesError"
            class="p-4 bg-destructive/10 text-destructive rounded">
            {{ bookError?.message || chaptersError?.message || categoriesError?.message }}
        </div>

        <!-- Main Content -->
        <div v-else class="space-y-8">
            <!-- Metadata Form -->
            <MiscDashboardBookMetadataForm :book="book" :categories="categories" :loading="updateBookPending"
                @update-field="(field: keyof typeof formData, value: any) => formData[field] = value"
                @save-draft="saveDraft" @submit-for-review="submitForReview" />

            <!-- Chapter Manager -->
            <MiscDashboardChapterManager 
                :chapters="chapters" :loading="createChapterPending"
                @add-chapter="handleAddChapter" @update-chapter-field="handleUpdateChapterField"
                @delete-chapter="handleDeleteChapter" @reorder-chapters="handleReorderChapters"
                />
        </div>
    </div>
</template>