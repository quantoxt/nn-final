<template>
  <section class="half">
      <mui-cards-big-book-card
        :title="book.title"
        :author="book.author"
        :category="book.category_slug"
        :cover="book.cover"
        :rating="book.rating"
        :rate-count="book.rate_count"
        :review-count="book.review_count"
        :chap-count="book.chapters.length"
        :save-count="book.saves"
        :book-slug="book.book_slug"
      />
  </section>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  }
});
</script>
<style scoped>
section.half{
    margin-top: 0 !important;
}
</style>