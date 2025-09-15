<template>
    <div v-if="error">
        <div class="error-page">
            <h1>Error</h1>
            <p>{{ error.data.message }}</p>
            <NuxtLink to="/">Go Home</NuxtLink>
        </div>
    </div>
    <div v-else-if="book" class="big-book-card card mt-10">
        <div v-if="book.cover_image_url">
            <img :src="book.cover_image_url" :alt="book.title" class="img" />
        </div>
        <div class="content">
            <div class="info">
                <h1 class="title">{{ book.title }}</h1>
                <div class="row ">
                    <span class="author">By: {{ book.profiles?.username }}</span>
                    <span class="category">
                        <nuxt-link :to="`/category/${book.category_slug}`">{{book.categories?.name}}</nuxt-link>
                    </span>
                </div>
                <div class="language">Language: English</div>
            </div>
            <div class="stats">
                <div class="rating-details">
                    <h1 class="rate">
                        {{book.rating}}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z">
                            </path>
                        </svg>
                    </h1>
                    <div class="mini-row">
                        <span class="rate-count"> 0 Ratings</span>
                        <span class="review-count">0 Reviews</span>
                    </div>
                </div>
                <div class="chap-count">
                    <h1 class="num">
                        {{ chapters.length }}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM12 5V19H20V5H12ZM13 7H19V9H13V7ZM13 10H19V12H13V10Z">
                            </path>
                        </svg>
                    </h1>
                    <div class="mini-row">Available chapters</div>
                </div>
                <div class="book-saves">
                    <h1 class="num">
                        {{ book.saves }}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2Z">
                            </path>
                        </svg>
                    </h1>
                    <div class="mini-row">Total saves</div>
                </div>
            </div>
            <div class="btn-wrap">
                <nuxt-link :to="`/category/${book.category_slug}/${book.slug}`">
                    <button class="read">Read</button>
                </nuxt-link>
                <nuxt-link>
                    <button class="add-to-library">Add to library</button>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    title: 'Book Details',
    meta: [
        { name: 'description', content: 'Detailed view of the selected book.' },
    ],
    layout: 'default'
})
const {
    book,
    error,
} = useSingleBook()

const {chapters } = useChapters()

/* const formattedSaveCount = computed(() => {
    if (typeof book.saves !== 'number') {
        return book.saves;
    }

    const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1
    });

    return formatter.format(book.saves);
}); */

</script>

<style scoped>
@reference "tailwindcss";

.big-book-card {
    @apply max-w-[100%] w-full py-0 flex-row flex-wrap gap-[4em] border-none;
}

.img {
    @apply w-[23em] max-w-[50em] h-[25em] rounded-2xl;
}

.img>img {
    @apply w-full h-full object-cover;
}

.content {
    .info {
        .title {
            @apply text-left font-[500];
        }

        .row {
            .category {
                @apply text-[var(--color-secondary)] font-semibold;
            }

            .book-status {
                @apply text-gray-500;
            }

            @apply flex justify-between gap-5;
        }

        .language {
            @apply text-gray-500;
        }

        @apply flex flex-col gap-2.5;
    }

    .stats {
        .rating-details {
            .rate {
                * {
                    @apply h-6 w-6 text-amber-400;
                }

                @apply inline-flex items-center justify-center text-[30px] gap-1;
            }

            .mini-row {
                @apply flex gap-2 text-gray-500;
            }
        }

        @apply flex items-center justify-center gap-10;
    }

    .chap-count,
    .book-saves {
        .num {
            * {
                @apply h-6 w-6 text-gray-600;
            }

            @apply inline-flex items-center justify-center text-[30px] gap-1;
        }

        .mini-row {
            @apply text-gray-500;
        }

        @apply flex items-start justify-center gap-1 flex-col;
    }

    @apply flex flex-col gap-4 items-start justify-center;
}

.btn-wrap {
    .add-to-library {
        @apply bg-none border text-black
    }
}
</style>
