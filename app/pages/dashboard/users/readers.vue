<script lang="ts" setup>
definePageMeta({
    layout: 'dash-layout',
    middleware: 'auth',
})
</script>

<template>
    <div>
        <misc-dashboard-users-settings-navbar>
            <template #navbar />
        </misc-dashboard-users-settings-navbar>

        <h1>All Readers</h1>
    </div>
</template>

<style lang="postcss" scoped></style>
