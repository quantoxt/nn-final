<template>
    <footer class="border-t border-gray-200 bg-background text-muted-foreground">
        <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
                <!-- Brand -->
                <div class="col-span-1 md:col-span-1">
                    <NuxtLink to="/" class="flex items-center gap-2">
                        <BookIcon class="size-5 text-primary" />
                        <span class="text-xl font-bold">Narrative Nexus</span>
                    </NuxtLink>
                    <p class="mt-4 text-sm">
                        Romance novels, one chapter at a time.
                    </p>
                </div>

                <!-- Dynamic Columns -->
                <div v-for="col in footerColumns" :key="col.title">
                    <h6 class=" text-left text-md font-semibold uppercase tracking-wider">{{ col.title }}</h6>
                    <ul class="mt-4 space-y-2 flex flex-col items-center justify-center">
                        <li v-for="link in col.links" :key="link.href">
                            <NuxtLink :to="link.href" class="text-sm hover:text-primary">
                                {{ link.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Social + Copyright -->
            <div class="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p class="text-sm">
                    © {{ new Date().getFullYear() }} Narrative Nexus™
                </p>
                <div class="flex space-x-6 mt-4 md:mt-0">
                    <a 
                        v-for="social in socialLinks" :key="social.name" :href="social.href"
                        :aria-label="`Follow us on ${social.name}`" class="text-gray-400 hover:text-primary transition">
                        <component :is="social.icon" class="size-5" />
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import {
    BookIcon,
    InstagramIcon,
    FacebookIcon,
} from 'lucide-vue-next'

// Define dynamic columns
const footerColumns = [
    {
        title: 'About',
        links: [
            { label: 'About Us', href: '/about' },
            { label: 'Blog', href: '/blog' }
        ]
    },
    {
        title: 'Support',
        links: [
            { label: 'Help Center', href: '/help' },
            { label: 'Contact Us', href: '/contact' }
        ]
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms & Conditions', href: '/terms' }
        ]
    }
]

// Define social links
const socialLinks = [
    { name: 'Instagram', href: '#', icon: InstagramIcon },
    { name: 'Facebook', href: '#', icon: FacebookIcon }
]
</script>