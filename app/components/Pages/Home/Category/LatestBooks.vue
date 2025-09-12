<template>
  <section>
    <div class="wrapper">
      <div class="sect-details">
        <h1 class="sect-title">Just <span>Published</span></h1>
        <p class="sect-subtitle">
          Flirt with a sample. Fall for the story. Devour the rest.
        </p>
      </div>

      <p v-if="loading">
        <misc-spinner />
      </p>
      <p v-else-if="error">Error fetching books: {{ error.message }}</p>
      <div v-else-if="books.length" class="card-wrap">
        <mui-cards-col-book-card
          v-for="book in books"
          :key="book.id"
          :cover="book.cover_image_url"
          :title="book.title"
          :category="book.category_slug"
          :author="book.trope"
          :saves="book.saves"
          :rating="book.rating"
          :book-slug="book.slug"
          :category-slug="book.category_slug"
        />
      </div>
      <p v-else>No books found for this category.</p>
    </div>
  </section>
</template>

<script setup>
const { getBooks, error, isLoading: loading } = useBooks()

const books = getBooks({
  status: 'published',
  limit: 6
})
</script>
<style scoped>
@reference "tailwindcss";
.card-wrap {
  @apply gap-[4em];
}
</style>
