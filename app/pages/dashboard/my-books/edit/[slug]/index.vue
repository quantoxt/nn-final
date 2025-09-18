<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

// Import your custom composables and the new form component
import { useBook } from '~/composables/useBook'
import { useCategories } from '~/composables/useCategories' // We'll need to create this
// We will create this composable next to handle the update logic
// import { useUpdateBook } from '~/composables/useUpdateBook' 

// UI Components
import { Button } from '~/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'

definePageMeta({
    layout: 'dash-layout',
    middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

// Fetch the book data using the composable we already fixed
const { book, pending: bookLoading, error: bookError } = useBook(slug)
// Fetch the list of all categories for the dropdown
const { categories, pending: categoriesLoading, error: categoriesError } = useCategories()

// // Composable for updating the book (we will create this)
// const { updateBook, loading: updateLoading, error: updateError } = useUpdateBook()

// A local ref to store the state of the book being edited.
// This gets updated by events from the child form component.
const editableBook = ref<any>(null)

// When the initial book data loads, populate our editable copy
watch(book, (newBook) => {
    if (newBook) {
        editableBook.value = JSON.parse(JSON.stringify(newBook))
    }
}, { immediate: true })


// Handler for when the form component emits an update
const handleFieldUpdate = (field: string, value: unknown) => {
    if (editableBook.value) {
        editableBook.value[field] = value
    }
}

// Handler for the "Save Draft" button
const handleSaveChanges = async () => {
    if (!editableBook.value) return

    // IMPORTANT: Convert comma-separated trope string back to an array
    if (typeof editableBook.value.trope === 'string') {
        editableBook.value.trope = editableBook.value.trope.split(',').map((t: string) => t.trim()).filter(Boolean)
    }

    toast.info('Saving changes...')

    // This is where we'll call our update function
    // const { success, message } = await updateBook(slug, editableBook.value)

    // if (success) {
    //     toast.success(message || 'Book updated successfully!')
    //     // Optionally, you can refresh data or navigate
    //     router.push('/dashboard/my-books/all')
    // } else {
    //     toast.error(message || 'Failed to update book.')
    // }

    // Placeholder until we create the update logic
    console.log('Saving book data:', editableBook.value)
    toast.success('Placeholder: Book save function called. See console.')
}


// Navigate back
const handleGoBack = () => {
    router.push('/dashboard/my-books/all')
}
</script>

<template>
    <div class="container py-8 max-w-4xl mx-auto">
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
            <p v-if="bookError">Error loading book: {{ bookError.message }}</p>
            <p v-if="categoriesError">Error loading categories: {{ categoriesError.message }}</p>
        </div>

        <!-- Book Not Found -->
        <div v-else-if="!book" class="p-4 text-center text-muted-foreground">
            Book not found or you don't have access.
        </div>

        <!-- Main Content -->
        <div v-else>
            <form-book-update :book="book" :categories="categories" :loading="false" @update-field="handleFieldUpdate"
                @save-draft="handleSaveChanges" @submit-for-review="handleSaveChanges" />
        </div>
    </div>
</template>
