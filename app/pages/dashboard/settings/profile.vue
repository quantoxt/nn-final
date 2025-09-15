<script lang="ts" setup>
definePageMeta({
    layout: 'dash-layout',
    middleware: 'auth',
})
</script>

<template>
    <div>
        <misc-dashboard-settings-navbar>
            <template #navbar />
        </misc-dashboard-settings-navbar>

        <h1>Profile</h1>
    </div>
</template>

<style lang="postcss" scoped></style>
