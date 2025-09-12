<template>
    <div class="card hook-card">
      <div class="svg hook-icon" v-html="icon"></div>
      <p>{{label}}</p>
      <h3>{{value}}</h3>
    </div>
</template>

<script setup lang="ts">
defineProps({
    icon: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
})
</script>

<style scoped>
@reference "tailwindcss";

.hook-card {
  .hook-icon {
    @apply w-12 h-12 text-[var(--color-primary)] bg-red-50 p-3 rounded-full;
  }
  p {
    @apply text-gray-500 text-lg;
  }
  h3 {
    @apply text-lg font-normal;
  }
  @apply items-center justify-center max-w-[350px]  py-2 border-none;
}
</style>