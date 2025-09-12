<template>
    <div>
        <h1>All Chapters Show here</h1>
            <div v-for="chapter in books.chapters" :key="chapter.id">
                <h1>{{ chapter.title }}</h1>
            </div>
    </div>
</template>

<script setup>
import books  from "~/data/books.json";
</script>

<style lang="scss" scoped></style>