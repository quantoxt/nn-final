<script lang="ts" setup>
definePageMeta({
    layout: 'dash-layout'
})
const status = ref('rejected')
const limit = ref() // No Limit, fetch all Do not set to 0 or null
const { books, loading, error } = useUserBooks(status, limit);
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
                Status: {{ book.status }}
            </div>
            <div v-if="!books || books.length === 0">No rejected books yet. Take some risks.</div>
        </div>
    </div>
</template>

<style lang="postcss" scoped></style>
