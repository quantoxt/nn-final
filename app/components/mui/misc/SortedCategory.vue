<template>
  <div v-if="isLoading" class="text-center py-8">Loading books...</div>

  <div v-else-if="filter && booksData">
    <div class="single-category-section wrapper">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold capitalize">
          {{ filteredBooks[0]?.categories?.name || filter }}
        </h2>
        <NuxtLink
          :to="`/categories/${filter}`"
        >
          More
        </NuxtLink>
      </div>
      <div class="card-wrap">
        <mui-cards-category-book-card
          v-for="book in filteredBooks"
          :key="book.id"
          :cover-image="book.cover_image_url"
          :title="book.title"
          :description="book.description"
          :saves="book.saves"
          :author="book.authors?.profiles?.username"
          :rating="book.rating"
          :trope="book.trope"
        />
      </div>
    </div>
  </div>

  <div v-else-if="booksData" class="multiple-category-section wrapper">
    <div
      v-for="[categorySlug, books] in Object.entries(groupedBooks)"
      :key="categorySlug"
      class="mb-12"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="category-title text-2xl font-bold capitalize">
          {{ books[0]?.categories?.name || categorySlug }}
        </h2>
        <NuxtLink
          :to="`/categories/${categorySlug}`"
          class="category-link text-blue-500 hover:underline"
        >
          More
        </NuxtLink>
      </div>
      <div class="card-wrap">
        <mui-cards-category-book-card
          v-for="book in books"
          :key="book.id"
          :cover-image="book.cover_image_url"
          :title="book.title"
          :description="book.description"
          :saves="book.saves"
          :author="book.authors?.profiles?.username"
          :rating="book.rating"
          :trope="book.trope"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Book {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  published_at: string;
  trope?: string;
  status: string;
  author_id: string;
  category_id: string;
  rating: number;
  saves: number;
  authors: {
    id: string;
    profiles: {
      username: string;
      email: string;
    };
  };
  categories: {
    id: string;
    name: string;
    slug: string;
  };
}
const props = defineProps<{
  filter: string | null;
  booksData: Book[] | null;
  isLoading: boolean;
}>();

const filteredBooks = computed(() => {
  if (!props.booksData || !props.filter) return [];
  return props.booksData.filter(
    (book) => book.categories.slug === props.filter
  );
});

const groupedBooks = computed(() => {
  if (!props.booksData) return {};
  return props.booksData.reduce((accumulator, book) => {
    const category = book.categories.slug;
    if (!accumulator[category]) {
      accumulator[category] = [];
    }
    accumulator[category].push(book);
    return accumulator;
  }, {} as { [key: string]: Book[] });
});
</script>

<style scoped>
.card-wrap {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
}
.book-content {
  padding-top: 0.75rem;
}
.title {
  font-weight: 600;
}
.middle,
.bottom {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}
.saves,
.rating {
  display: flex;
  align-items: center;
}
</style>
