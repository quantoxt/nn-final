<script lang="ts" setup>
definePageMeta({
    layout: 'dash-layout',
    middleware: 'auth',
})
const status = ref('published')
const { books } = useUserBooks(status);
const { isLoading, profile} = useAuthState()
</script>

<template>
    <div>
        <h2 v-if="!isLoading">Hello {{ profile?.username }}</h2>
        <role-author-only>
            <p>You have {{ books.length }} {{ books.length === 1 ? 'Book' : 'Books' }} Published </p>
        </role-author-only>

        <role-admin>
            <p>You have {{ books.length }} {{ books.length === 1 ? 'Book' : 'Books' }} Published </p>
        </role-admin>
        <div>
            <misc-logout-button/>
        </div>
    </div>
</template>

<style lang="css" scoped>
    
</style>
