<template>
  <form @submit.prevent="onSubmit" class="book-form">
    <div class="form-group">
      <label for="title">Title</label>
      <input id="title" v-model="form.title" type="text" required />
    </div>
    <div class="form-group">
      <label for="description">Description</label>
      <textarea id="description" v-model="form.description" required></textarea>
    </div>
    <div class="form-group">
      <label for="author">Author</label>
      <input id="author" v-model="form.author" type="text" required />
    </div>
    <div class="form-group">
        <label for="trope" class="trope">Trope</label>
        <input id="trope" v-model="form.trope" type="text"></div>
    <div class="form-group">
      <label for="category_slug">Category</label>
      <select id="category_slug" v-model="form.category_slug" required>
        <option disabled value="">Select Category</option>
        <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
          {{ cat.name }}
        </option>
      </select>
    </div>
    <button type="submit" class="submit-button">Submit Book</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['submitForm']);

const categories = ref([]);
const form = ref({
  title: '',
  description: '',
  author: '',
  category_slug: ''
});

onMounted(async () => {
  try {
    const response = await axios.get('/api/categories/category');
    categories.value = response.data;
    // Set the initial value to the first category if available
    if (categories.value.length > 0) {
      form.value.category_slug = categories.value[0].slug;
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
});

const onSubmit = () => {
  emit('submitForm', { ...form.value });
};

definePageMeta({
    layout: 'author',
})
</script>

<style scoped>
.book-form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
input,
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>