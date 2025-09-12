<template>
  <div class="book-card">
    <div class="book-cover-container">
      <img :src="coverImage" :alt="title" class="book-cover" />
    </div>
    <div class="book-info">
      <h2 class="book-title">{{ title }}</h2>
      <div class="book-meta">
        <span class="book-genre">{{ trope }}</span>
        <span class="book-author"> • {{ author }}</span>
      </div>
      <p class="book-description">{{ description }}</p>
      <div class="book-stats">
        <span class="book-views">{{ saves }} views</span>
        <span class="book-status">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="inline-block mr-1 text-amber-500"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            ></polygon>
          </svg>
          {{ rating }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  coverImage: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  trope: {
    type: String,
    required: false,
    default: "Unknown",
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  saves: {
    type: [Number, String],
    required: false,
    default: 0,
  },
  rating: {
    type: Number,
    required: false,
    default: 1,
  },
});
</script>

<style scoped>
@reference "tailwindcss";

.book-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  @apply w-full max-w-[300px] border
}

.book-cover-container {
  width: 120px;
  flex-shrink: 0;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.book-info {
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
}

.book-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.9rem;
}

.book-description {
  margin-top: 0.5rem;
  color: #444;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.book-stats {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  color: #666;
  font-size: 0.9rem;
}
</style>
