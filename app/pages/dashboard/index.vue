<script lang="ts" setup>
definePageMeta({
    middleware: 'auth',
    layout: 'dash-layout'
})
onMounted(() => {
    navigateTo('/dashboard/overview')
})
</script>
