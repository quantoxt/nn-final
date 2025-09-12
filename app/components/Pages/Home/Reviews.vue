<template>
  <section>
    <div class="wrapper">
      <div class="sect-details">
        <h1 class="sect-title">Readers Are <span>Blushing</span></h1>
        <p class="sect-subtitle">What readers are saying about our platform</p>
      </div>
      <div class="card-wrap">
        <mui-cards-review-card
          v-for="(review, index) in top_reviews"
          :key="index"
          :title="review.title"
          :review="review.review"
          :reviewer="review.reviewer"
          :rating="review.rating"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import reviews from "~/data/reviews.json";
const top_reviews = reviews.slice(0, 6);
</script>

<style scoped>
</style>
