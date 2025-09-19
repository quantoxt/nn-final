<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

// Import composables and components
import { useBook } from '~/composables/useBook'
import { useCategories } from '~/composables/useCategories'
import { useUpdateBook } from '~/composables/useUpdateBook'
import { Button } from '~/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'

definePageMeta({
    layout: 'dash-layout',
    middleware: 'auth',
})

const route = useRoute()
const router = useRouter()

// ✅ Reactive slug
const currentSlug = ref(route.params.slug as string)

// ✅ Reactive book composable
const { book, pending: bookLoading, error: bookError, refresh } = useBook(currentSlug.value)
const { categories, pending: categoriesLoading, error: categoriesError } = useCategories()

const { updateBook, loading: updateLoading } = useUpdateBook()

// ✅ Watch for route changes
watch(() => route.params.slug, (newSlug) => {
    if (newSlug) {
        currentSlug.value = newSlug as string
        // Refresh the book data with new slug
        refresh()
    }
})

// Local state for the form's data
const editableBook = ref<any>(null)
const coverImageFile = ref<File | null>(null);

// Pre-populate the form when the book data is fetched
watch(book, (newBook) => {
    if (newBook) {
        editableBook.value = JSON.parse(JSON.stringify(newBook))
    }
}, { immediate: true })

// Update the local form state when the child component emits a change
const handleFieldUpdate = (field: string, value: unknown) => {
    if (editableBook.value) {
        editableBook.value[field] = value
    }
}

// Handler for when a new cover image is selected
const handleCoverUploaded = (file: File) => {
    coverImageFile.value = file;
    toast.info(`New cover "${file.name}" selected. Save changes to apply other updates.`)
}

// Handler for saving all changes
const handleSaveChanges = async () => {
    if (!editableBook.value) return

    const payload = {
        title: editableBook.value.title,
        description: editableBook.value.description,
        category_slug: editableBook.value.category_slug,
        status: editableBook.value.status,
        slug: editableBook.value.slug,
        cover_image_url: editableBook.value.cover_image_url,
        label: editableBook.value.label,
        trope: editableBook.value.trope,
    }

    const result = await updateBook(currentSlug.value, payload)

    if (result.success) {
        toast.success(result.message || 'Book updated successfully!')

        // If the slug was changed, navigate to the new URL
        if (payload.slug && payload.slug !== currentSlug.value) {
            // ✅ Navigate to new URL - the watch will handle updating the data
            router.push(`/dashboard/my-books/edit/${payload.slug}`)
        } else {
            // Otherwise, refresh the current data
            await refresh()
        }
    }
}

// Navigate back to the main book list
const handleGoBack = () => {
    router.push('/dashboard/my-books/all')
}
</script>

<template>
    <div class="container py-8 max-w-[1500px] mx-auto">
        <!-- Header -->
        <div class="flex items-center mb-6">
            <Button variant="ghost" size="sm" @click="handleGoBack" class="mr-4">
                <ArrowLeft class="h-4 w-4 mr-1" />
                Back to My Books
            </Button>
            <div>
                <h1 class="text-3xl font-bold">Edit Book</h1>
                <p v-if="book" class="text-muted-foreground">
                    Editing "{{ book.title }}"
                </p>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="bookLoading || categoriesLoading" class="space-y-4">
            <div class="h-12 bg-muted rounded animate-pulse" />
            <div class="h-96 bg-muted rounded animate-pulse" />
        </div>

        <!-- Error State -->
        <div v-else-if="bookError || categoriesError" class="p-4 bg-destructive/10 text-destructive rounded">
            <p v-if="bookError">Error loading book: {{ bookError }}</p>
            <p v-if="categoriesError">Error loading categories: {{ categoriesError }}</p>
        </div>

        <!-- Book Not Found -->
        <div v-else-if="!book" class="p-4 text-center text-muted-foreground">
            Book not found or you don't have access.
        </div>

        <!-- Main Content -->
        <div v-else>
            <FormBookUpdate :book="editableBook" :categories="categories" :loading="updateLoading"
                @update-field="handleFieldUpdate" @cover-uploaded="handleCoverUploaded" @save-draft="handleSaveChanges"
                @submit-for-review="handleSaveChanges" />
        </div>
    </div>
</template>
