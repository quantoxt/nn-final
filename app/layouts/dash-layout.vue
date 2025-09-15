<!-- layouts/dashboard.vue -->
<template>
    <SidebarProvider>
        <div class="flex">
            <misc-sidebar />
            <SidebarInset>
                <slot name="navbar" />

                <!-- 👇 Page Content -->
                <main class="flex-1 p-4">
                    <slot />
                </main>
            </SidebarInset>
        </div>
    </SidebarProvider>
</template>

<script setup>
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
definePageMeta({
    middleware: 'auth'
})
</script>