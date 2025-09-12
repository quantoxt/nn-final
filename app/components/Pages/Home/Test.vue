<template>
      <mui-sort-button
        :categories="categories"
        @filter-change="handleFilterChange"
      />
    <hr class="text-gray-200" />
    <p v-if="pending">Loading books...</p>
    <p v-else-if="error">Error fetching books: {{ error.message }}</p>
    <div  v-else-if="books.length" class="card-wrap">
      <mui-cards-popular-book-card
        v-for="book in books"
        :key="book.title"
        :img="book.cover"
        :title="book.title"
        :category="book.category_slug"
        :author="book.author"
        :description="book.description"
        :saves="book.saves"
        :rating="book.rating"
        :book-slug="book.book_slug"
        :category-slug="book.category_slug"
      />
    </div>
    <p v-else>No books found for this category.</p>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";

// Data from your original component
const categories = ref([
  { label: "Billionaire", filter: "billionaire" },
  { label: "Mafia", filter: "mafia" },
  { label: "Werewolf", filter: "werewolf" },
  { label: "Young Adult", filter: "young-adult" },
  { label: "Fantasy", filter: "fantasy" },
  { label: "Erotica", filter: "erotica" },
]);

// Refactored state management
const books = ref([]);
const pending = ref(true);
const error = ref(null);
const selectedFilter = ref(null);

// Function to fetch data from the API
const fetchBooks = async () => {
  pending.value = true;
  error.value = null;

  try {
    const url = selectedFilter.value
      ? `/api/books?category=${selectedFilter.value}`
      : "/api/books";

    const response = await axios.get(url);
    books.value = response.data;
  } catch (err) {
    error.value = err;
  } finally {
    pending.value = false;
  }
};

// Watch for changes in the selected filter and refetch data
watch(selectedFilter, () => {
  fetchBooks();
});

// Initial fetch when the component is mounted
onMounted(() => {
  fetchBooks();
});

// Handle button clicks to change the filter
const handleFilterChange = (filter) => {
  selectedFilter.value = filter;
};
</script>
