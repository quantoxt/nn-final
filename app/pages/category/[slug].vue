<template>
  <div v-if="loading">Loading books...</div>
  <div v-else-if="error">Error loading books: {{ error }}</div>
  <div v-else>
    <h1>Category: {{ categoryName }}</h1>
    <h1>{{ books.length }} {{ books.length < 2 ? "Book" : "Books" }} Available</h1>

        <div v-if="books.length" class="card-wrap">
          <mui-cards-row-book-card 
            v-for="book in books" :key="book.title" :cover="book.cover_image_url"
            :title="book.title" :category="book.category_slug" :author="book.author_id"
            :description="book.description" :saves="book.saves" :book-slug="book.slug"
            :category-slug="book.category_slug" :trope="book.trope" :edited-at="book.updated_at" />
        </div>
        <div v-else>
          <p>No books found for this category.</p>
        </div>
        <nuxt-link to="/">Let's Go Home Cutie</nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, watch, computed } from "vue";

const route = useRoute();
const categorySlug = ref(route.params.slug as string);

// Simple category name formatting
const categoryName = computed(() => {
  return categorySlug.value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});

// Fetch books from server API
const { data: books, pending: loading, error } = await useFetch(
  () => `/api/category/${categorySlug.value}`,
  {
    transform: (data) => data || []
  }
);

// Watch for route changes
watch(() => route.params.slug, (newSlug) => {
  if (typeof newSlug === 'string') {
    categorySlug.value = newSlug;
  }
}, { immediate: true });
</script>