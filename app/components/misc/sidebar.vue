<template>
    <Sidebar collapsible="icon" class="border-r bg-background">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton as-child>
                        <NuxtLink to="/" class="flex items-center gap-2">
                            <BookIcon class="size-5" />
                            <span class="font-semibold">Narrative Nexus</span>
                        </NuxtLink>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <SidebarTrigger />
        </SidebarHeader>

        <SidebarContent class="px-2 py-4">

            <!-- Reader Menu -->
            <RoleReaderOnly>
                <SidebarGroup>
                    <SidebarGroupLabel>Reader</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem v-for="item in readerItems" :key="item.title">
                            <SidebarMenuButton as-child>
                                <NuxtLink :to="item.href" class="flex items-center gap-2">
                                    <component :is="item.icon" class="size-5" />
                                    <span>{{ item.title }}</span>
                                </NuxtLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </RoleReaderOnly>

            <!-- Author Menu -->
            <RoleAuthorOnly>
                <SidebarGroup>
                    <SidebarGroupLabel>Author</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem v-for="item in authorItems" :key="item.title">
                            <SidebarMenuButton as-child>
                                <NuxtLink :to="item.href" class="flex items-center gap-2">
                                    <component :is="item.icon" class="size-5" />
                                    <span>{{ item.title }}</span>
                                </NuxtLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </RoleAuthorOnly>

            <!-- Admin Menu -->
            <template v-if="loading">
                <div class="p-4 flex justify-center">
                    <misc-spinner />
                </div>
            </template>
            <template v-else>
                <RoleAdminOnly>
                    <SidebarGroup>
                        <SidebarGroupLabel>Admin</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem v-for="item in adminItems" :key="item.title">
                                <SidebarMenuButton as-child>
                                    <NuxtLink :to="item.href" class="flex items-center gap-2">
                                        <component :is="item.icon" class="size-5" />
                                        <span>{{ item.title }}</span>
                                    </NuxtLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </RoleAdminOnly>
            </template>

            <!-- General -->
            <SidebarGroup>
                <SidebarGroupLabel>Config</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem v-for="item in generalItems" :key="item.title">
                        <SidebarMenuButton as-child>
                            <NuxtLink :to="item.href" class="flex items-center gap-2">
                                <component :is="item.icon" class="size-5" />
                                <span>{{ item.title }}</span>
                            </NuxtLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>

        </SidebarContent>

        <SidebarRail />

    </Sidebar>
</template>

<script setup lang="ts">
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
    SidebarTrigger,
    useSidebar
} from '@/components/ui/sidebar'

import {
    HomeIcon,
    BookIcon,
    HeartIcon,
    LibraryIcon,
    UsersIcon,
    SettingsIcon,
/*     UserIcon,
 */    LayoutDashboardIcon
} from 'lucide-vue-next'

import { watch } from 'vue'
import { useRoute } from 'vue-router'

const { isLoading: loading } = useAuthState()
const route = useRoute()
const { toggleSidebar } = useSidebar()

// Auto-close sidebar on mobile when route changes
watch(
    () => route.path,
    () => {
        if (import.meta.client && window.innerWidth < 768) {
            toggleSidebar(false)
        }
    }
)

const generalItems = [
    { title: 'Settings', href: '/dashboard/settings/profile', icon: SettingsIcon }
]

const readerItems = [
    { title: 'Home', href: '/', icon: HomeIcon },
    { title: 'Library', href: '/library', icon: BookIcon },
    { title: 'Favorites', href: '/favorites', icon: HeartIcon }
]

const authorItems = [
    { title: 'Overview', href: '/dashboard/overview', icon: LayoutDashboardIcon },
    { title: 'Library', href: '/dashboard/library', icon: LibraryIcon },
    { title: 'Favorites', href: '/dashboard/favorites', icon: HeartIcon },
    { title: 'My Books', href: '/dashboard/my-books', icon: BookIcon },

]

const adminItems = [
    { title: 'Overview', href: '/dashboard/overview', icon: LayoutDashboardIcon },
    { title: 'Users', href: '/dashboard/users', icon: UsersIcon },
    { title: 'Reports', href: '/admin/reports', icon: BookIcon }
]
</script>

<style scoped>
@reference "tailwindcss";
.router-link-active {
    @apply text-red-500;
}
</style>