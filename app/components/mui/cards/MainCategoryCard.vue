<template>
  <div class="popular-card">
    <div class="img">
      <img v-if="img" :src="props.img" :alt="props.title" />
    </div>
    <div class="text-content">
      <h2 class="title">{{ props.title }}</h2>
      <div class="trope-author">
        <span class="author">{{ props.trope }}</span>
      </div>
      <p class="description">{{ props.description }}</p>
      <div class="saves-rating">
        <span class="saves"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2Z"
            ></path></svg
          >{{ props.saves }}</span
        >
        <span class="rating"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"
            ></path></svg
          >{{ props.rating }}</span
        >
      </div>
      <div class="link">
        <nuxt-link :to="`${categorySlug}/${bookSlug}`">
          Explore
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M21 21H13V6C13 4.34315 14.3431 3 16 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21ZM11 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H8C9.65685 3 11 4.34315 11 6V21ZM11 21H13V23H11V21Z"
            ></path></svg
        ></nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  img: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  trope: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  saves: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  bookSlug: {
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

.popular-card {
  @apply flex flex-row rounded-lg w-full p-4 gap-4 items-center max-w-[370px];
}
.img {
  img {
    @apply w-full h-40 object-cover rounded-lg;
  }
  @apply w-[40%];
}
.text-content {
  @apply flex flex-col gap-2.5 w-[60%];
}
.title {
  @apply text-xl text-start;
}
.trope-author {
  .trope {
    @apply text-[var(--color-secondary)];
  }
  * {
    @apply text-[14px];
  }
  @apply flex flex-row justify-start gap-4 text-sm text-gray-500;
}
.description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  @apply text-gray-600 text-[13px] text-left max-w-[100%];
}
.saves-rating {
  .saves,
  .rating {
    * {
      @apply w-4 h-4;
    }
    @apply inline-flex items-center justify-center  gap-1;
  }
  .rating > * {
    @apply text-amber-500;
  }
  @apply flex flex-row justify-between text-sm text-gray-500 max-w-[70%];
}
.link {
  svg {
    @apply w-3.5 h-3.5;
  }
  a {
    @apply inline-flex items-center gap-1 text-[var(--color-secondary)];
  }
}
</style>
