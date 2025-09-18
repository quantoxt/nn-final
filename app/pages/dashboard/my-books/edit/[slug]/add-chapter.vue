<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useBook } from '~/composables/useBook'
import { useCreateChapter } from '~/composables/useCreateChapter'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Checkbox } from '~/components/ui/checkbox'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
import { toast } from 'vue-sonner'
import { ArrowLeft, FileText, Clock } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

definePageMeta({
    layout: 'dash-layout',
    middleware: 'auth',
})
// Get book data
const { book, pending: bookLoading, error: bookError } = useBook(slug)

// Create chapter composable
const { loading, error: createError, createChapter } = useCreateChapter()

// Form state
const formData = ref({
    chapter_title: '',
    content: '',
    coin_cost: 0,
    is_locked: true
})

// UI state
const wordCount = ref(0)
const readingTime = ref('')
const isSubmitting = ref(false)

// Computed
const isFormValid = computed(() => {
    return formData.value.chapter_title.trim() && formData.value.content.trim()
})

// ✨ NEW: Computed property to calculate the next chapter number
const nextChapterNumber = computed(() => {
    if (book.value) {
        // The next chapter is the current count + 1
        return book.value.chapter_count + 1
    }
    // Default or loading state
    return '...'
})


// Calculate word count and reading time
const updateWordCount = () => {
    const text = formData.value.content.trim()
    wordCount.value = text ? text.split(/\s+/).filter(word => word.length > 0).length : 0

    // Calculate reading time (200 words per minute)
    const minutes = Math.ceil(wordCount.value / 200)
    readingTime.value = minutes > 0 ? `${minutes} min read` : '< 1 min read'
}

// Handle form submission
const handleSubmit = async () => {
    if (!isFormValid.value || isSubmitting.value) return

    isSubmitting.value = true

    try {
        const result = await createChapter(slug, formData.value)

        if (result.success) {
            toast.success('Chapter created successfully!')
            await router.push(`/dashboard/my-books/edit/${slug}`)
        } else {
            toast.error(result.message || 'Failed to create chapter')
        }
    } catch (err) {
        toast.error('An error occurred while creating the chapter')
    } finally {
        isSubmitting.value = false
    }
}

// Navigate back
const handleGoBack = () => {
    router.push(`/dashboard/my-books/edit/${slug}`)
}
</script>

<template>
    <div class="container py-8 max-w-4xl mx-auto">
        <!-- Header with back button -->
        <div class="flex items-center mb-6">
            <Button variant="ghost" size="sm" @click="handleGoBack" class="mr-4">
                <ArrowLeft class="h-4 w-4 mr-1" />
                Back to Book
            </Button>
            <div>
                <h1 class="text-3xl font-bold">Add New Chapter</h1>
                <p v-if="book" class="text-muted-foreground">
                    For "{{ book.title }}"
                </p>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="bookLoading" class="space-y-4">
            <div class="h-8 bg-muted rounded animate-pulse" />
            <div class="h-64 bg-muted rounded animate-pulse" />
        </div>

        <!-- Error state -->
        <div v-else-if="bookError" class="p-4 bg-destructive/10 text-destructive rounded">
            {{ bookError }}
        </div>

        <!-- Book not found -->
        <div v-else-if="!book" class="p-4 text-center text-muted-foreground">
            Book not found or you don't have access.
        </div>

        <!-- Main form -->
        <div v-else class="space-y-6">
            <!-- Book info card -->
            <Card>
                <CardHeader>
                    <CardTitle class="text-lg">Book Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="flex items-center gap-4">
                        <div class="flex-1">
                            <h3 class="font-medium">{{ book.title }}</h3>
                            <p class="text-sm text-muted-foreground">
                                {{ book.description || 'No description available' }}
                            </p>
                        </div>
                        <div class="text-right">
                            <Badge variant="outline">{{ book.status?.replace('_', ' ') }}</Badge>
                            <p class="text-xs text-muted-foreground mt-1">
                                {{ book.category_slug }}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Chapter form -->
            <Card>
                <!-- ✨ UPDATED: Header now includes the chapter number -->
                <CardHeader class="flex flex-row items-center justify-between">
                    <CardTitle>Chapter Details</CardTitle>
                    <Badge v-if="book" variant="secondary">
                        Chapter number: {{ nextChapterNumber }}
                    </Badge>
                </CardHeader>
                <CardContent class="space-y-6">
                    <!-- Chapter title -->
                    <div class="space-y-2">
                        <Label for="chapter-title">Chapter Title *</Label>
                        <Input id="chapter-title" v-model="formData.chapter_title" placeholder="Enter chapter title"
                            :class="{ 'border-red-500': !formData.chapter_title.trim() }" />
                    </div>

                    <!-- Chapter content -->
                    <div class="space-y-2">
                        <Label for="content">Chapter Content *</Label>
                        <Textarea id="content" v-model="formData.content"
                            placeholder="Write your chapter content here..." rows="15"
                            :class="{ 'border-red-500': !formData.content.trim() }" @input="updateWordCount" />
                        <div class="flex items-center justify-between text-sm text-muted-foreground">
                            <div class="flex items-center gap-4">
                                <div class="flex items-center gap-1">
                                    <FileText class="h-4 w-4" />
                                    <span>{{ wordCount }} words</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <Clock class="h-4 w-4" />
                                    <span>{{ readingTime }}</span>
                                </div>
                            </div>
                            <p class="text-xs">
                                Tip: Use ** for bold, * for italic, # for headings
                            </p>
                        </div>
                    </div>

                    <!-- Chapter settings -->
                    <div class="grid grid-cols-2 gap-6">
                        <!-- Coin cost -->
                        <div class="space-y-2">
                            <Label for="coin-cost">Coin Cost (0-10)</Label>
                            <Select v-model="formData.coin_cost">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select coin cost" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem :value="0">Free (0 coins)</SelectItem>
                                    <SelectItem :value="1">1 coin</SelectItem>
                                    <SelectItem :value="2">2 coins</SelectItem>
                                    <SelectItem :value="3">3 coins</SelectItem>
                                    <SelectItem :value="4">4 coins</SelectItem>
                                    <SelectItem :value="5">5 coins</SelectItem>
                                    <SelectItem :value="6">6 coins</SelectItem>
                                    <SelectItem :value="7">7 coins</SelectItem>
                                    <SelectItem :value="8">8 coins</SelectItem>
                                    <SelectItem :value="9">9 coins</SelectItem>
                                    <SelectItem :value="10">10 coins</SelectItem>
                                </SelectContent>
                            </Select>
                            <p class="text-xs text-muted-foreground">
                                Readers will need to spend coins to unlock this chapter
                            </p>
                        </div>

                        <!-- Lock status -->
                        <div class="space-y-4">
                            <div class="flex items-center space-x-2">
                                <Checkbox id="is-locked" v-model:checked="formData.is_locked" />
                                <Label for="is-locked">Lock this chapter</Label>
                            </div>
                            <p class="text-xs text-muted-foreground">
                                When locked, readers must spend the specified number of coins to access this chapter
                            </p>
                        </div>
                    </div>

                    <!-- Error display -->
                    <Alert v-if="createError" variant="destructive">
                        <AlertDescription>{{ createError }}</AlertDescription>
                    </Alert>

                    <!-- Actions -->
                    <div class="flex justify-between pt-4">
                        <Button variant="outline" @click="handleGoBack">
                            Cancel
                        </Button>
                        <Button @click="handleSubmit" :disabled="!isFormValid || isSubmitting || loading">
                            {{ isSubmitting ? 'Creating...' : 'Create Chapter' }}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
