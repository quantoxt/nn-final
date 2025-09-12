<template>
  <header :class="{
    'scrolled': scrolled,
    'static': !scrolled,
    'nav-hidden': isNavHidden,
    'nav-visible': !isNavHidden
  }">
    <div class="left">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger class="nav-trigger">
              categories
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div class="dropdown-grid">
                <NavigationMenuLink v-for="navLink in navLinks" :key="navLink.title" as-child>
                  <nuxt-link :to="navLink.href" class="dropdown-item">
                    <span class="dropdown-title">{{ navLink.title }}</span>
                  </nuxt-link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>

    <nuxt-link to="/" class=" logo">NN</nuxt-link>

    <div class="flex gap-10 right">

      <nuxt-link  :to="`/library`">
        <button v-if="auth" class="library-btn">
            <LibraryBig class="w-4 h-4" /> Library
        </button>
      </nuxt-link>

      <nuxt-link class="auth-btn" :to="auth ? '/login' : '/signup'">
        <!-- This will change based on the auth state -->
        <button> {{auth ? "Login" : "Signup" }}</button>
      </nuxt-link>

    </div>
  </header>
</template>

<script setup lang="ts">
import { navLinks } from "~/data/navLinks";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
/*    navigationMenuTriggerStyle,  */
} from "../ui/navigation-menu"
import { LibraryBig } from "lucide-vue-next";

const auth = true;

const scrolled = ref(false)
const isNavHidden = ref(false)
const lastScrollPosition = ref(0)
const scrollThreshold = 400 // Minimum scroll before navbar starts hiding

const handleScroll = () => {
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop

  // Update scrolled state for styling
  scrolled.value = currentScrollPosition > 50

  // Determine scroll direction
  if (currentScrollPosition > lastScrollPosition.value) {
    // Scrolling down
    if (currentScrollPosition > scrollThreshold) {
      isNavHidden.value = true
    }
  } else {
    // Scrolling up - show navbar immediately
    isNavHidden.value = false
  }

  // Update last scroll position
  lastScrollPosition.value = currentScrollPosition
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@reference "tailwindcss";

/* Header Styles */
.static {
}

.scrolled {
  @apply mx-auto backdrop-blur-[10px] bg-white shadow-md;
}

header {
  @apply flex items-center justify-evenly bg-red-100 sticky top-[0] border-b border-[#00000033] left-0 right-0 px-8 py-3 z-10 transition-transform duration-300 ease-in-out;
}
.logo{
  @apply inline-flex items-center justify-center w-12 h-12 text-xl font-bold bg-red-200 rounded-full
}
.logo.router-link-active{
  @apply text-red-500
}
/* Navbar visibility states */
.nav-hidden {
  @apply transform -translate-y-full;
}

.nav-visible {
  @apply transform translate-y-0;
}

/* Navigation Links */
.nav-link {
  @apply inline-flex items-center justify-center p-2 px-3 transition-all duration-150;
}

/* Navigation Triggers */
.nav-trigger {
  @apply  text-[18px] inline-flex items-center justify-center p-2 px-3 transition-all duration-150;
}

/* Dropdown Grid */
.dropdown-grid {
  @apply py-2 gap-2 flex flex-wrap items-center justify-center w-[max-content] max-w-[300px] bg-white;
}

/* Dropdown Items */
.dropdown-item {
  @apply block px-3 py-1 border border-transparent rounded-md transition-colors duration-150
}
.dropdown-item:hover{
  @apply bg-red-50 border-red-200 text-[var(--color-primary)] border;
}
.dropdown-item.router-link-active{
  @apply bg-red-50 border-red-200 text-[var(--color-primary)] border cursor-default
}
.dropdown-title {
  @apply text-sm font-medium leading-tight;
}
.auth-btn{
  @apply bg-[var(--color-primary)] font-semibold rounded-md text-white px-3 py-1
}
.library-btn{
  @apply inline-flex items-center justify-center gap-2 py-1
}
.library-btn.router-link-active{
  @apply text-[var(--color-primary)]
}
</style>