<template>
    <header :class="{'scrolled' : scrolled, 'static' : !scrolled}">
        <nav class="navbar">
            <ul>
                <li v-for="navlink in navlinks" :key="navlink.name">
                    <NuxtLink :to="navlink.path">{{ navlink.name }}</NuxtLink>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script setup>
import navlinks from '~/data/navlinks.json'
const scrolled = ref(false)

const handleScroll = () => {
    scrolled.value = window.scrollY > 500 // Change after 50px scroll
}
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})

</script>

<style scoped>
@reference "tailwindcss";

.scrolled{
    backdrop-filter: blur(10px);
    @apply mx-auto bg-red-50 max-w-[45vw]
}
.static{
    max-width: 40vw;
    @apply mx-auto bg-[transparent]
}
header{
    backdrop-filter: blur(10px);
    @apply rounded-full border fixed top-[2%] left-0 right-0 shadow-md p-4 py-3 z-10;
}
nav{
    @apply flex justify-center items-center
}
.navbar a {
    transition: .15s;
    @apply p-2 mx-1 px-1 relative inline-flex items-center justify-center
}

.navbar a::before {
    content: '';
    background: linear-gradient(to right, var(--100), var(--200));
    height: 3px;
    top: 85%;
    transition: width .3s ease-in-out;
    @apply w-0 absolute
}

.navbar a:hover::before {
    @apply w-full
}
.router-link-active{
    @apply text-[var(--100)]
}
.navbar .router-link-active::before {
    content: '';
    background: linear-gradient(to right, var(--100), var(--200));
    height: 3px;
    top: 85%;
    @apply absolute w-full
}
ul{
    a{
        @apply font-semibold
    }
    @apply flex gap-8 items-center justify-center
}
.btn-wrap{
    @apply gap-4 my-0
}
</style>