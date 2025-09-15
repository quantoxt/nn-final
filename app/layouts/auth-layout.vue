<script setup lang="ts">

</script>

<template>
    <main class="auth-layout">
        <slot />
    </main>
</template>

<style lang="postcss" scoped>
.auth-layout {
    background: linear-gradient(to bottom right, var(--color-primary), var(--color-accent));
}
</style>