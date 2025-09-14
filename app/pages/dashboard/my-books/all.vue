<script lang="ts" setup>
import { ref } from 'vue' // 👈 was missing — required for `ref()`

definePageMeta({
    layout: 'dash-layout'
})

const status = ref('all') // 👈 explicitly 'published' — safer than undefined
const limit = ref('all') // 👈 explicitly 'all' — safer than undefined

const { books, loading, error } = useUserBooks(status, limit)
</script>

<template>
    <div>
        <misc-dashboard-my-books-navbar>
            <template #navbar />
        </misc-dashboard-my-books-navbar>

        <div v-if="loading">Loading your books...</div>
        <div v-else-if="error">Failed to load books.</div>
        <div v-else>
            <div v-for="book in books" :key="book.id">
                Title: {{ book.title }} <br>
                Status: {{ book.status }} <br>
                <template v-if="!['rejected', 'archived'].includes(book.status)">
                    <button @click="$router.push(`/dashboard/edit/${book.slug}`)">Edit</button>
                </template>
            </div>
            <div v-if="books.length === 0">No books yet. Add Some.</div> <!-- 👈 `books` is always array now -->
        </div>
    </div>
</template>

<style lang="postcss" scoped></style>