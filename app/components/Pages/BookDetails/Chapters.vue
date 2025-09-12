<template>
  <section class="half shade">
    <div>
      <mui-cards-chapter-card
        :title="chapter.title"
        :chapter-number="chapter.chapter_number"
        :word-count="chapter.word_count"
        :read-time="chapter.read_time"
        :chapter-price="chapter.coin_cost === 0 ? 'Free' : chapter.coin_cost"
      />
    </div>
  </section>
</template>

<script setup>
defineProps({
  chapters: {
    type: Array,
    required: true
  }
});
</script>
<style scoped>
section.half{
}
</style>