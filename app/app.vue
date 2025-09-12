<template>
  <NuxtLoadingIndicator />
  <Transition>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </Transition>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Narrative Nexus",
  ogTitle: "Narrative Nexus",
  description: "Discover your next romance novel addiction!",
  ogDescription: "Discover your next romance novel addiction!",
  ogImage: "https://oprghyjjqfvtbdxxzyqn.supabase.co/storage/v1/object/sign/meta/meta.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hYzg4NWYxNi0yYjNmLTQ1MWUtYmEzNC03OTBmOWFiY2M2ZjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZXRhL21ldGEuanBlZyIsImlhdCI6MTc1NTY1NTg1MiwiZXhwIjoyMDcxMDE1ODUyfQ.YaujovpxyMuwjLskN4gel_Wkdwzia4ZDMnxIBD43nqo",
  ogUrl: "",
  ogType: "website",
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.5s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10%);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}

.nuxt-loading-indicator {
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary)) !important;
}
</style>
