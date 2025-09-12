<!-- layouts/default.vue -->
<template>
    <SidebarProvider>
        <div class="flex">
            <misc-sidebar />
            <SidebarInset>
                <main class="flex-1">
                    <misc-dashboard-settings-navbar />
                    <slot />
                </main>
            </SidebarInset>
        </div>
    </SidebarProvider>
</template>

<script setup>
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
</script>