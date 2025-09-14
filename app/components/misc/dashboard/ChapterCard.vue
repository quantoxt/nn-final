<!-- components/misc/dashboard/MiscDashboardChapterCard.vue -->
<script setup lang="ts">
import type { Database } from '~/types/database.types'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'

type Chapter = Database['public']['Tables']['chapters']['Row']

const props = defineProps<{
    chapter: Chapter
}>()

const emit = defineEmits<{
    (e: 'update-field', field: keyof Pick<Chapter, 'chapter_title' | 'is_locked' | 'coin_cost'>, value: Chapter[typeof field]): void
    (e: 'delete'): void
}>()
</script>

<template>
    <div class="border rounded-lg p-4 space-y-4">
        <!-- Drag Handle + Chapter Number + Title -->
        <div class="flex items-center gap-4">
            <div class="cursor-grab text-muted-foreground">☰</div>
            <div class="font-medium">Chapter {{ props.chapter.chapter_number }}</div>
            <Input 
                :value="props.chapter.chapter_title" placeholder="Chapter Title" class="flex-1"
                @blur="(e: Event) => emit('update-field', 'chapter_title', (e.target as HTMLInputElement).value)" />
            <Button size="sm" variant="ghost" @click="emit('delete')">
                Delete
            </Button>
        </div>

        <!-- Lock + Coin Cost -->
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
                <Switch 
                    :checked="props.chapter.is_locked"
                    @update:checked="(val: boolean) => emit('update-field', 'is_locked', val)" />
                <Label>Locked</Label>
            </div>
            <div v-if="props.chapter.is_locked" class="flex items-center gap-2">
                <Label>Coin Cost</Label>
                <Input 
                    type="number" :value="props.chapter.coin_cost || 10" min="1" class="w-20"
                    @blur="(e: Event) => emit('update-field', 'coin_cost', parseInt((e.target as HTMLInputElement).value))" />
            </div>
        </div>

        <!-- Edit Content Button (placeholder) -->
        <div>
            <Button size="sm" variant="outline">
                Edit Content
            </Button>
        </div>
    </div>
</template>

<style scoped>
.cursor-grab {
    padding: 0.5rem;
    border-radius: 4px;
}

.cursor-grab:hover {
    background-color: hsl(var(--muted));
}
</style>