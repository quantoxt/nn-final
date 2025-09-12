<script lang="ts" setup>
const { getBooks,/*  error, isLoading: loading */ } = useBooks()

const books = getBooks({
    status: 'published',
    limit: 6,
    category: 'werewolf'
})
</script>

<template>
    <section>
        <div class="wrapper">
            <div class="sect-details">
                <h1 class="sect-title">Werewolf</h1>
                <p class="sect-subtitle"></p>
            </div>
            <div class="card-wrap">
                <mui-cards-col-book-card v-for="book in books" :key="book.title" :cover="book.cover_image_url"
                    :title="book.title" :author="book.profiles?.username" :saves="book.saves" :book-slug="book.slug"
                    :rating="book.rating" :category-slug="book.category_slug" :trope="book.trope" />
            </div>
        </div>
    </section>
</template>

<style lang="postcss" scoped></style>
