<!-- components/ChapterEditor.vue -->
<script setup lang="ts">
import type { Database } from '~/types/database.types'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useChapter } from '~/composables/useChapter'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Checkbox } from '~/components/ui/checkbox'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { toast } from 'vue-sonner'

// type Chapter = Database['public']['Tables']['chapters']['Row']

const props = defineProps<{
    chapterId: string
    bookSlug: string
    visible: boolean
}>()

const emit = defineEmits<{
    'update:visible': (visible: boolean) => void
    'chapter-updated': () => void
}>()

// Get chapter data
const { chapter, loading, error, updateChapter } = useChapter(props.chapterId)

// Form state
const formData = ref({
    chapter_title: '',
    content: '',
    coin_cost: 0,
    is_locked: false,
    chapter_number: 1
})

// UI state
const hasUnsavedChanges = ref(false)
const autoSaveTimer = ref<number | null>(null)
const isAutoSaving = ref(false)
const showPreview = ref(false)
const wordCount = ref(0)
const readingTime = ref('')

// Computed
const isFormValid = computed(() => {
    return formData.value.chapter_title.trim() && formData.value.content.trim()
})

const saveButtonText = computed(() => {
    if (isAutoSaving.value) return 'Auto-saving...'
    return hasUnsavedChanges.value ? 'Save Changes' : 'Saved'
})

// Watch for chapter data changes
watch(() => chapter.value, (newChapter) => {
    if (newChapter) {
        formData.value = {
            chapter_title: newChapter.chapter_title,
            content: newChapter.content,
            coin_cost: newChapter.coin_cost,
            is_locked: newChapter.is_locked,
            chapter_number: newChapter.chapter_number
        }
        updateWordCount()
        hasUnsavedChanges.value = false
    }
}, { immediate: true })

// Watch for form changes to trigger auto-save
watch(
    () => formData.value,
    () => {
        hasUnsavedChanges.value = true
        scheduleAutoSave()
    },
    { deep: true }
)

// Word count calculation
const updateWordCount = () => {
    const text = formData.value.content.trim()
    wordCount.value = text ? text.split(/\s+/).filter(word => word.length > 0).length : 0

    // Calculate reading time (200 words per minute)
    const minutes = Math.ceil(wordCount.value / 200)
    readingTime.value = minutes > 0 ? `${minutes} min read` : '< 1 min read'
}

// Auto-save functionality
const scheduleAutoSave = () => {
    if (autoSaveTimer.value) {
        clearTimeout(autoSaveTimer.value)
    }

    autoSaveTimer.value = window.setTimeout(() => {
        performAutoSave()
    }, 3000) // Auto-save after 3 seconds of inactivity
}

const performAutoSave = async () => {
    if (!isFormValid.value || !hasUnsavedChanges.value) return

    isAutoSaving.value = true

    try {
        const result = await updateChapter(formData.value)
        if (result.success) {
            hasUnsavedChanges.value = false
            // Show subtle auto-save notification
            toast.success('Auto-saved', {
                duration: 2000,
                action: {
                    label: 'Undo',
                    onClick: () => {
                        // TODO: Implement undo functionality
                    }
                }
            })
        }
    } catch (err) {
        toast.error('Auto-save failed')
    } finally {
        isAutoSaving.value = false
    }
}

// Manual save
const handleSave = async () => {
    if (!isFormValid.value) return

    try {
        const result = await updateChapter(formData.value)
        if (result.success) {
            hasUnsavedChanges.value = false
            toast.success('Chapter saved successfully')
            emit('chapter-updated')
        } else {
            toast.error(result.message)
        }
    } catch (err) {
        toast.error('Failed to save chapter')
    }
}

// Close handler
const handleClose = () => {
    if (hasUnsavedChanges.value) {
        if (confirm('You have unsaved changes. Are you sure you want to close?')) {
            emit('update:visible', false)
        }
    } else {
        emit('update:visible', false)
    }
}

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
    // Cmd/Ctrl + S to save
    if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault()
        handleSave()
    }

    // Cmd/Ctrl + W to close
    if ((event.metaKey || event.ctrlKey) && event.key === 'w') {
        event.preventDefault()
        handleClose()
    }

    // Cmd/Ctrl + P to toggle preview
    if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
        event.preventDefault()
        showPreview.value = !showPreview.value
    }
}

// Lifecycle
onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    if (autoSaveTimer.value) {
        clearTimeout(autoSaveTimer.value)
    }
})

// Content formatting helpers
const insertText = (text: string) => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = formData.value.content.substring(0, start)
    const after = formData.value.content.substring(end)

    formData.value.content = before + text + after

    // Set cursor position after inserted text
    setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length
        textarea.focus()
    }, 0)

    updateWordCount()
}

const insertHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' '
    insertText(prefix)
}

const insertBold = () => {
    const selected = window.getSelection()?.toString() || ''
    insertText(`**${selected}**`)
}

const insertItalic = () => {
    const selected = window.getSelection()?.toString() || ''
    insertText(`*${selected}*`)
}

// Template helpers for preview
const renderMarkdown = (text: string) => {
    return text
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n/gim, '<br>')
}
</script>

<template>
    <Dialog :open="visible" @update:open="emit('update:visible', $event)">
        <DialogContent class="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
                <DialogTitle>
                    Edit Chapter
                    <Badge v-if="hasUnsavedChanges" variant="outline" class="ml-2">
                        Unsaved changes
                    </Badge>
                </DialogTitle>
            </DialogHeader>

            <div v-if="loading" class="flex-1 flex items-center justify-center">
                <div class="text-center">
                    <div
                        class="h-8 w-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p class="mt-2 text-sm text-muted-foreground">Loading chapter...</p>
                </div>
            </div>

            <Alert v-else-if="error" variant="destructive">
                <AlertDescription>{{ error }}</AlertDescription>
            </Alert>

            <div v-else-if="chapter" class="flex-1 overflow-hidden flex flex-col">
                <!-- Editor toolbar -->
                <div class="flex items-center justify-between p-4 border-b">
                    <div class="flex items-center gap-2">
                        <Button variant="ghost" size="sm" @click="insertHeading(1)" title="Heading 1">
                            H1
                        </Button>
                        <Button variant="ghost" size="sm" @click="insertHeading(2)" title="Heading 2">
                            H2
                        </Button>
                        <Button variant="ghost" size="sm" @click="insertHeading(3)" title="Heading 3">
                            H3
                        </Button>
                        <div class="w-px h-6 bg-border" />
                        <Button variant="ghost" size="sm" @click="insertBold" title="Bold">
                            <strong>B</strong>
                        </Button>
                        <Button variant="ghost" size="sm" @click="insertItalic" title="Italic">
                            <em>I</em>
                        </Button>
                    </div>

                    <div class="flex items-center gap-4">
                        <div class="text-sm text-muted-foreground">
                            {{ wordCount }} words • {{ readingTime }}
                        </div>
                        <Button variant="ghost" size="sm" @click="showPreview = !showPreview">
                            {{ showPreview ? 'Edit' : 'Preview' }}
                        </Button>
                    </div>
                </div>

                <!-- Editor content -->
                <div class="flex-1 overflow-auto">
                    <div v-if="!showPreview" class="p-4 space-y-4">
                        <!-- Chapter metadata -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <Label for="chapter-title">Chapter Title</Label>
                                <Input id="chapter-title" v-model="formData.chapter_title"
                                    placeholder="Enter chapter title" />
                            </div>

                            <div>
                                <Label for="chapter-number">Chapter Number</Label>
                                <Input id="chapter-number" v-model.number="formData.chapter_number" type="number"
                                    min="1" />
                            </div>
                        </div>

                        <!-- Chapter content -->
                        <div>
                            <Label for="content">Content</Label>
                            <Textarea id="content" v-model="formData.content"
                                placeholder="Write your chapter content here..." rows="15" class="font-mono text-sm"
                                @input="updateWordCount" />
                            <p class="text-xs text-muted-foreground mt-1">
                                Tip: Use ** for bold, * for italic, # for headings
                            </p>
                        </div>

                        <!-- Chapter settings -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <Label for="coin-cost">Coin Cost (0-10)</Label>
                                <Input id="coin-cost" v-model.number="formData.coin_cost" type="number" min="0"
                                    max="10" />
                            </div>

                            <div class="flex items-center space-x-2">
                                <Checkbox id="is-locked" v-model:checked="formData.is_locked" />
                                <Label for="is-locked">Lock Chapter</Label>
                            </div>
                        </div>
                    </div>

                    <!-- Preview mode -->
                    <div v-else class="p-6">
                        <div class="prose max-w-none">
                            <h1>{{ formData.chapter_title }}</h1>
                            <div v-html="renderMarkdown(formData.content)" />
                        </div>
                    </div>
                </div>

                <!-- Footer actions -->
                <div class="flex items-center justify-between p-4 border-t">
                    <div class="flex items-center gap-2 text-sm text-muted-foreground">
                        <kbd class="px-2 py-1 bg-muted rounded text-xs">⌘S</kbd>
                        <span>Save</span>
                        <kbd class="px-2 py-1 bg-muted rounded text-xs">⌘W</kbd>
                        <span>Close</span>
                        <kbd class="px-2 py-1 bg-muted rounded text-xs">⌘P</kbd>
                        <span>Preview</span>
                    </div>

                    <div class="flex items-center gap-2">
                        <Button variant="outline" @click="handleClose">
                            Close
                        </Button>
                        <Button @click="handleSave" :disabled="!isFormValid">
                            {{ saveButtonText }}
                        </Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>