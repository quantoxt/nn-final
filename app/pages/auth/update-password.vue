<script lang="ts" setup>
definePageMeta({
    middleware: "auth",
    layout: 'auth-layout'
})
</script>

<template>
    <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div class="w-full max-w-sm">
            <form-update-password/>
        </div>
    </div>
</template>

<style lang="postcss" scoped></style>