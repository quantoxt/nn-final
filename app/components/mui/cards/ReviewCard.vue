<template>
  <div class="review-card card">
    <h1 class="title">{{ title }}</h1>
    <p class="review">{{ review }}</p>
    <hr class="text-red-500"/>
    <div class="reviewer-rating">
      <span class="rating"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"
          ></path></svg
        >{{ rating }}</span
      >
      <span class="reviewer">{{ reviewer }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  reviewer: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
});
</script>

<style scoped>
@reference "tailwindcss";

.review-card {
    border: 1px solid rgba(0, 0, 0, 0.2);
  background: url("~/assets/svg/book-open-fill.svg") no-repeat center center;
  @apply items-start p-4 shadow-none max-w-[340px] gap-4;
}
.title {
  @apply text-xl text-left;
}
.review {
  @apply text-sm text-left;
}
.reviewer-rating {
  .rating {
    *{
        @apply h-4 w-4 
    }
    @apply inline-flex items-center justify-center gap-1 text-lg;
  }
  .reviewer{
    @apply text-[var(--color-primary)]
  }
  @apply text-gray-500 flex items-center justify-between w-full gap-8 font-semibold;
}
</style>
