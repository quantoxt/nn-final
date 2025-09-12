<template>
    <main>
        <pages-home-hero />
        <pages-home-hooks />
        <pages-home-category-popular-books class="shade" /> <!-- row card -->
        <pages-home-category-latest-books /> <!-- column cards -->
        <pages-home-category-trending-books class="shade" /> <!-- special card (2 sections) -->
        <pages-home-category-werewolf-books /> <!-- row card from here below -->
        <pages-home-category-billionaire-books class="shade"/>
        <pages-home-category-mafia-books />
        <pages-home-category-young-adult-books class="shade"/>
        <pages-home-category-fantasy-books />
        <pages-home-category-erotica-books  class="shade"/>
        <pages-home-category-lgbtq-books />
        <pages-home-reviews class="shade" />
    </main>
</template>

<script setup lang="ts">
useSeoMeta({
    title: "NN - Home",
})
</script>
