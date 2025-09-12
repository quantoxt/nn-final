<template>
    <section class="small">
        <div class="card-wrap">
            <mui-cards-hook-card v-for="hook in hooks" :key="hook.label" :label="hook.label" :icon="hook.icon" :value="hook.value"/>
        </div>
    </section>
</template>

<script setup lang="ts">
import hooks from "~/data/hooks.json";
</script>

<style scoped>
</style>