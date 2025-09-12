<template>
  <section class="full">
    <div class="wrapper">
      <div class="sect-details">
        <h1 class="sect-title">
          Discover Your Next<br />
          <span>Romance Adventure</span>
        </h1>
        <p class="sect-subtitle">
          Curated romance that flirts, teases, and delivers the swoon. From
          slow-burn aches to off-the-charts spice, we publish stories that leave
          you breathless and reaching for one more chapter.
        </p>
      </div>
      <div class="card-wrap">
        <mui-cards-cat-card
          v-for="catcard in catcards"
          :key="catcard.title"
          :title="catcard.title"
          :slug="catcard.slug"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import catcards from "~/data/cat-cards.json";
</script>

<style scoped>
</style>
