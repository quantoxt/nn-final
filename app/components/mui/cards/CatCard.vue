<template>
  <NuxtLink :to="`/category/${slug}`" class="cat-card-link">
    <div class="cat-card">
      <h1>{{ title }}</h1>
      <div class="svg">
          <svg
            class="main-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M5.63589 19.7784L4.22169 18.3644L15.657 6.92908L10.0712 6.92908V4.92908L19.0712 4.92908L19.0712 13.9291H17.0712L17.0712 8.34326L5.63589 19.7784Z"
            ></path></svg>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  categorySlug: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
@reference "tailwindcss";

.cat-card {
  background: rgba(0, 0, 0, 0.1);
  @apply flex flex-row items-center justify-center w-full max-w-[max-content] border border-red-400 py-0 items-start justify-start rounded-4xl px-5 py-2 gap-2;
}
.svg {
  * {
    @apply w-6 h-6  text-white;
  }
  background: linear-gradient(
    135deg,
    var(--color-secondary),
    var(--color-primary)
  );
  @apply w-8 h-8 inline-flex items-center justify-center p-1 rounded-full;
}
h1 {
  @apply text-xl self-center;
}
.cat-card-link:hover {
  .main-svg {
    transform: rotate(360deg);
    transition: all 0.5s ease-out;
  }
}
</style>
