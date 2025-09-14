<script lang="ts" setup>
definePageMeta({
    layout: 'dash-layout'
})
const status = ref('published')
const { books } = useUserBooks(status);
</script>

<template>
    <div>
        <role-author-only>
            {{ books.length }} {{ books.length === 1 ? 'Book' : 'Books' }} Published
        </role-author-only>
    </div>
</template>

<style lang="postcss" scoped>
    
</style>
