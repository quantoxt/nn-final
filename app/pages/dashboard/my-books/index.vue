<script lang="ts" setup>
definePageMeta({
    middleware: 'auth',
    layout: 'dash-my-books-layout'
})
onMounted(() => {
    navigateTo('/dashboard/my-books/all')
})
</script>
