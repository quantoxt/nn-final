<template>
    <nuxt-link :to="`/category/${categorySlug}/${bookSlug}`">
        <div class=" max-w-[320px] flex flex-row items-start gap-4 p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <!-- Image -->
            <div class="relative aspect-square w-24 overflow-hidden rounded-md">
                <img :src="cover" :alt="title" class="w-full h-full object-cover" />
            </div>
            <!-- Content -->
            <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 line-clamp-1">{{ title }}</h3>
                <p class="text-sm text-pink-500 mt-1">{{ trope }} • {{ author }}</p>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2 book-description">{{ description }}</p>
                <div class="flex items-center text-xs text-gray-500 mt-2 space-x-3">
                    <span class="inline-flex gap-1 text-[15px] font-semibold">{{ formattedsaves }} <Bookmark class="size-4"/></span>
                    <span>{{ updatedAt }}</span>
                </div>
            </div>
        </div>
    </nuxt-link>
</template>

<script setup lang="ts">
import { Bookmark } from 'lucide-vue-next';
import { useCompactNumber } from "~/composables/useCompactNumber";
import { computed } from 'vue';

const props = defineProps < {
    title: string
    cover: string
    trope: string
    author: string
    description: string
    saves: number | string
    editedAt: string
    bookSlug: string
    categorySlug: string
}>()

const updatedAt = computed(() => {
    return useRelativeTime(props.editedAt)
})
const formattedsaves = useCompactNumber(computed(() => props.saves))
</script>

<style lang="css" scoped>
.book-description {
    margin-top: 0.5rem;
    color: #444;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>