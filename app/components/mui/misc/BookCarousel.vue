<template>
  <div class="book-carousel">
    <Swiper
      :modules="[Navigation, Pagination, Autoplay]"
      :slides-per-view="1"
      :space-between="10"
      :breakpoints="{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }"
      :navigation="false"
      :pagination="{ clickable: true }"
      :loop="true"
      :autoplay="{
        delay: 1500,
        disableOnInteraction: false,
      }"
      class="mySwiper"
    >
      <slot />
    </Swiper>
  </div>
</template>

<script setup>
import { Swiper } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
</script>

<style scoped>
@reference "tailwindcss";

.book-carousel {
  padding: 2rem 0;
  @apply max-w-[1400px] w-full gap-5 mx-auto;
}
.mySwiper {
  width: 100%;
  height: auto;
  min-height: 0;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #ff7043;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #ff7043;
}
</style>
