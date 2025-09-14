<script lang="ts" setup>
definePageMeta({
    layout: 'dash-layout'
})
</script>

<template>
    <div>
        <misc-dashboard-my-books-navbar>
            <template #navbar />
        </misc-dashboard-my-books-navbar>

        <form-book-upload/>
    </div>
</template>

<style lang="postcss" scoped></style>
