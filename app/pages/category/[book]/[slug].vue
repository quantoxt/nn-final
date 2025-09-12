<template>
    <div v-if="error">
        <div class="error-page">
            <h1>Error</h1>
            <p>{{ error.data.message }}</p>
            <NuxtLink to="/">Go Home</NuxtLink>
        </div>
    </div>
    <div v-else-if="book">
        <!-- Book content here -->
        <h1>{{ book.title }}</h1>
        <p>Category: {{ book.categories?.name }}</p>
        <p>Author: {{ book.profiles?.username }}</p>
        <div>{{ book.description }}</div>

        <div v-if="book.cover_image_url">
            <img :src="book.cover_image_url" :alt="book.title"/>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    title: 'Book Details',
    meta: [
        { name: 'description', content: 'Detailed view of the selected book.' },
    ],
    layout: 'book-layout'
})
const {
    book,
    error,
} = useSingleBook()
</script>

<style scoped>
</style>