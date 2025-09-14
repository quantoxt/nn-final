<template>
    <nav
        class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="container mx-auto px-4">
            <div class="flex h-16 items-center justify-between">
                <!-- Logo -->
                <div class="flex items-center">
                    <NuxtLink to="/" class="flex items-center space-x-2">
                        <BookIcon class="size-4 text-primary" />
                        <span class="font-bold text-md">Narrative Nexus</span>
                    </NuxtLink>
                </div>

                <!-- Desktop Nav -->
                <div class="hidden md:flex items-center space-x-6">
                    <NuxtLink v-for="item in navItems" :key="item.name" :to="item.href"
                        class="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <component :is="item.icon" class="h-4 w-4" />
                        <span>{{ item.name }}</span>
                    </NuxtLink>

                    <!-- Generic Dropdown (Optional — delete if not needed) -->
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child @mouseenter="isDropdownOpen = true"
                            @mouseleave="isDropdownOpen = false" class="cursor-default">
                            <div
                                class="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                <HeartIcon class="h-4 w-4" />
                                <span>Categories</span>
                                <ChevronDown class="h-3 w-3" />
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent :open="isDropdownOpen" @mouseenter="isDropdownOpen = true"
                            @mouseleave="isDropdownOpen = false" align="center" class="w-48">
                            <DropdownMenuItem v-for="item in dropdownItems" :key="item.name" as-child
                                @click="isDropdownOpen = false">
                                <NuxtLink :to="item.href" class="flex items-center space-x-2"
                                    @click="isDropdownOpen = false">
                                    <component :is="item.icon" class="h-4 w-4" />
                                    <span>{{ item.name }}</span>
                                </NuxtLink>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <!-- Auth Buttons -->
                <div class="hidden md:flex items-center space-x-2">
                    <Button size="sm" as-child variant="ghost">
                        <NuxtLink :to="isAuthenticated ? '/coins-shop' : '/auth/sign-up'"
                            class="flex items-center space-x-1">
                            <UserPlus v-if="!isAuthenticated" class="size-4" />
                            <Coins v-else class="size-4" />
                            <span>{{ isAuthenticated ? "Coins Shop" : "Sign Up" }}</span>
                        </NuxtLink>
                    </Button>
                    <Button size="sm" as-child>
                        <NuxtLink :to="isAuthenticated?'/dashboard':'/auth/login'" class="flex items-center space-x-1">
                            <LogIn v-if="!isAuthenticated" class="h-4 w-4" />
                            <LayoutDashboard v-else-if="isAuthenticated" class="size-4" />
                            <span>{{ isAuthenticated ? "Dashboard" : "Login" }}</span>
                        </NuxtLink>
                    </Button>
                </div>

                <!-- Mobile Menu -->
                <div class="md:hidden">
                    <Sheet v-model:open="isOpen">
                        <SheetTrigger as-child>
                            <Button variant="ghost" size="sm">
                                <Menu class="h-5 w-5" />
                                <span class="sr-only">Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" class="w-70">
                            <SheetHeader>
                                <SheetTitle class="flex items-center space-x-2">
                                    <BookIcon class="size-4 text-primary" />
                                    <span class="text-[15px]">Narrative Nexus</span>
                                </SheetTitle>
                            </SheetHeader>
                            <div class="mt-6 space-y-4">
                                <!-- Nav Links -->
                                <div class="space-y-2">
                                    <NuxtLink v-for="item in navItems" :key="item.name" :to="item.href"
                                        class="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                        @click="isOpen = false">
                                        <component :is="item.icon" class="h-4 w-4" />
                                        <span>{{ item.name }}</span>
                                    </NuxtLink>
                                </div>

                                <!-- Dropdown Items (Mobile) -->
                                <div class="border-t pt-4">
                                    <h4 class="px-3 text-sm font-semibold text-muted-foreground mb-2 text-left">Categories</h4>
                                    <div class="space-y-2">
                                        <NuxtLink v-for="item in dropdownItems" :key="item.name" :to="item.href"
                                            class="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                            @click="isOpen = false">
                                            <component :is="item.icon" class="h-4 w-4" />
                                            <span>{{ item.name }}</span>
                                        </NuxtLink>
                                    </div>
                                </div>

                                <!-- Auth (Mobile) -->
                                <div class="border-t pt-4 space-y-2">
                                    <NuxtLink :to="isAuthenticated ? '/dashboard' : '/auth/login'"
                                        class="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                        @click="isOpen = false">
                                        <LogIn v-if="isAuthenticated" class="size-4" />
                                        <LayoutDashboard v-else-if="!isAuthenticated" class="size-4" />
                                        <span>{{ isAuthenticated ? "Dashboard" : "Login" }}</span>
                                    </NuxtLink>
                                    <NuxtLink :to="isAuthenticated ? '/coins-shop' : '/auth/sign-up'"
                                        class="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                        @click="isOpen = false">
                                        <UserPlus v-if="!isAuthenticated" class="size-4" />
                                        <Coins v-else class="size-4" />
                                        <span>{{ isAuthenticated ? "Coins Shop" : "Sign Up" }}</span>
                                    </NuxtLink>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue'

import { Button } from '~/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '~/components/ui/sheet'

import {
    Menu,
    BookIcon,
    HeartIcon,
    LogIn,
    UserPlus,
    ChevronDown,
    LayoutDashboard,
    Coins
} from 'lucide-vue-next'

const isOpen = ref(false)
const isDropdownOpen = ref(false)
const {isAuthenticated} = useAuthState()

// Static nav items — edit as needed
const navItems = [
]

// Static dropdown items — edit or delete
const dropdownItems = [
    { name: 'Billionaire', href: '/category/billionaire',},
    { name: 'Mafia', href: '/category/mafia',},
    { name: 'Fantasy', href: '/category/fantasy', },
    { name: 'LQBTQ+', href: '/category/lgbtq', },
    { name: 'Erotica', href: '/category/erotica', },
    { name: 'Young Adult', href: '/category/young-adult', },
    { name: 'Werewolf', href: '/category/werewolf', }
]
</script>

<style lang="css" scoped>
@reference "tailwindcss";
.router-link-active {
    @apply text-red-400;
}
</style>