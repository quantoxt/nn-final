<template>
  <div class="book-card">
    <!-- Cover Image -->
    <div class="book-card-cover">
      <Img v-if="cover" :src="cover" :alt="title" class="book-card-img" />
      <div v-else>
        <Icon name="lucide:book-open" class="book-card-icon" />
      </div>
    </div>

    <!-- Title & Author -->
    <div class="book-card-info">
      <h3 class="book-card-title">
        {{ title }}
      </h3>
      <p class="book-card-author">
        {{ author }}
      </p>
    </div>

    <!-- Rating -->
    <div v-if="rating" class="book-card-rating">
      <Icon
        v-for="i in 5"
        :key="i"
        :name="i <= Math.floor(rating) ? 'lucide:star' : 'lucide:star-outline'"
        class="book-card-star"
      />
      <span class="book-card-rating-value">{{ rating }}</span>
    </div>
  </div>
</template>
<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    default: null,
  },
});
</script>
<style scoped>
@reference "tailwindcss";

.book-card {
  flex: 0 0 20em;
  @apply h-[12em] bg-white p-[1em] text-center content-center rounded-lg w-full;
}

</style>