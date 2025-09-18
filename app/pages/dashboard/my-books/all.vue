<script lang="ts" setup>
import { ref } from 'vue'

definePageMeta({
    layout: 'dash-layout',
    middleware: 'auth',
})

const coming_soon = () => {
    alert(`Delete feature coming soon`)
}

const status = ref('all')
const limit = ref('all')

const { books, loading, error } = useUserBooks(status, limit)
</script>

<template>
    <div>
        <misc-dashboard-my-books-navbar>
            <template #navbar />
        </misc-dashboard-my-books-navbar>

        <div v-if="loading">Loading your books...</div>
        <div v-else-if="error">Failed to load books.</div>
        <div v-else class="card-wrap">
            <div v-for="book in books" :key="book.id"
                class=" gap-3 rounded-md border-gray-300 border px-4 py-2 flex flex-col items-start justify-start max-w-[400px] my-2">
                <p class="text-xl font-semibold">{{ book.title }} </p>
                <div class="flex items-center justify-center flex-wrap gap-2">
                    <p class="text-gray-400 flex items-start justify-start">{{ book.category_slug }}</p> •
                    <p :class="book.status === 'published' ? 'text-emerald-600' : 'text-amber-600'"
                        class="text-sm px-2 border rounded-md">{{ book.status }}</p>
                </div>
                <div class="flex items-center gap-3 justify-center">
                    <template v-if="!['rejected', 'archived'].includes(book.status)">
                        <!-- This link is already correct for the new structure -->
                        <button
                            class="bg-emerald-600 cursor-pointer px-2 py-0.5 rounded-sm text-white text-semibold text-sm"
                            @click="$router.push(`/dashboard/my-books/edit/${book.slug}`)">Edit</button>
                    </template>
                    <template v-if="!['rejected', 'archived'].includes(book.status)">
                        <!-- ✨ FIXED: Corrected the Add Chapter link to use a nested route -->
                        <button
                            class="bg-amber-600 cursor-pointer px-2 py-0.5 rounded-sm text-white text-semibold text-sm"
                            @click="$router.push(`/dashboard/my-books/edit/${book.slug}/add-chapter`)">Add
                            Chapter</button>
                    </template>
                    <template v-if="!['pending_review',].includes(book.status)">
                        <button
                            class="bg-[var(--color-primary)] cursor-pointer px-2 py-0.5 rounded-sm text-white text-semibold text-sm"
                            @click="coming_soon()">Delete</button>
                    </template>
                </div>
            </div>
            <div v-if="books.length === 0">No books yet. Add Some.</div>
        </div>
    </div>
</template>

<style lang="postcss" scoped></style>
