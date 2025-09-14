<script lang="ts" setup>
definePageMeta({
    middleware: 'auth',
    layout: 'dash-layout'
})
onMounted(() => {
    navigateTo('/dashboard/overview')
})
const { user } = useAuthState()
console.log('User:', user.value)
</script>
