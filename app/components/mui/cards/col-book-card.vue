<template>
    <nuxt-link :to="`/category/${categorySlug}/${bookSlug}`">
        <div class="flex flex-col items-start p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <!-- Image -->
            <div class="relative aspect-[3.7/4] w-50 overflow-hidden rounded-md mb-2">
                <img :src="cover" :alt="title" class="w-full h-full object-cover" />
            </div>
            <!-- Title -->
            <h3 class="text-base font-semibold text-gray-900 line-clamp-1">{{ title }}</h3>
            <!-- Author -->
            <p class="text-sm text-gray-600 mt-1">{{ author }}</p>
            <!-- Genre Tags -->
            <div v-for="trope in props.tropes" v-bind:key="trope" class="flex flex-wrap gap-1 mt-1">
                <span class="text-xs px-2 py-0.5 bg-pink-100 text-pink-700 rounded">
                    {{ trope }}
                </span>
            </div>
            <!-- Rating & Views -->
            <div class="flex items-center justify-between w-full text-xs text-gray-500 mt-2">
                <div class="flex items-center gap-1">
                    <StarIcon class="size-4 text-yellow-400" />
                    <span>{{ rating }}</span>
                </div>
                <span>{{ formattedsaves }} saves</span>
            </div>
        </div>
    </nuxt-link>
</template>

<script setup lang="ts">
import { StarIcon } from 'lucide-vue-next'

const props = defineProps<{
    title: string
    cover: string
    author: string
    tropes: string[]
    rating: number
    saves: number | string
    bookSlug: string
    categorySlug: string
}>()
const formattedsaves = useCompactNumber(computed(() => props.saves))

</script>