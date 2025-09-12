<template>
  <section>
    <div class="wrapper">
      <div class="sect-details">
        <h1 class="sect-title">Popular <span>Hotstuff</span></h1>
        <p class="sect-subtitle">
            Explore sizzling books readers can't get enough of. 
        </p>
      </div>
      <div class="card-wrap">
        <mui-cards-row-book-card
          v-for="book in books"
          :key="book.title"
          :cover="book.cover_image_url"
          :title="book.title"
          :category="book.category_slug"
          :author="book.profiles?.username"
          :description="book.description"
          :saves="book.saves"
          :book-slug="book.slug"
          :category-slug="book.category_slug"
          :trope="book.trope"
          :edited-at="book.updated_at"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const { getBooks } = useBooks();
const books = getBooks({
  status: 'published',
  limit: 6,
  label: 'popular'
})
</script>

<style scoped></style>
