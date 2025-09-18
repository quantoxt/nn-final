<template>
    <div class="container py-12 max-w-3xl mx-auto">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">Become an Author</h1>
            <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
                Share your stories with the world and join our community of passionate writers
            </p>
        </div>

        <!-- User not logged in -->
        <div v-if="!user" class="text-center py-8">
            <Card class="max-w-md mx-auto">
                <CardContent class="pt-6">
                    <div class="flex flex-col items-center gap-4">
                        <AlertCircle class="h-12 w-12 text-muted-foreground" />
                        <h3 class="text-lg font-medium">Authentication Required</h3>
                        <p class="text-muted-foreground text-center">
                            Please log in to your account to become an author
                        </p>
                        <Button @click="router.push('/auth/login')">
                            Log In
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Main content for logged-in users -->
        <div v-else class="space-y-8">
            <!-- Section 1: User info card -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Users class="h-5 w-5" />
                        Your Account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="flex items-center gap-4">
                        <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span class="text-lg font-medium text-primary">
                                {{ profile?.username?.charAt(0).toUpperCase() ||
                                    user.user_metadata?.username?.charAt(0).toUpperCase() ||
                                    user.email?.charAt(0).toUpperCase() }}
                            </span>
                        </div>
                        <div>
                            <h3 class="font-medium">
                                {{ profile?.username || user.user_metadata?.username || 'User' }}
                            </h3>
                            <p class="text-sm text-muted-foreground">
                                {{ user.email }}
                            </p>
                            <div class="mt-2">
                                <Badge variant="outline">
                                    Current role: {{ profile?.role || 'reader' }}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Section 2: Become author CTA -->
            <Card>
                <CardHeader>
                    <CardTitle>Ready to Start Your Author Journey?</CardTitle>
                    <CardDescription>
                        Click the button below to become an author and unlock all the tools you need to succeed
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <!-- Alerts for status messages -->
                    <Alert v-if="error" variant="destructive">
                        <AlertDescription>{{ error }}</AlertDescription>
                    </Alert>
                    <Alert v-if="success" variant="default" class="border-green-200 bg-green-50">
                        <AlertDescription class="text-green-800">
                            Success! Redirecting to your dashboard...
                        </AlertDescription>
                    </Alert>

                    <!-- CTA Button with Confirmation Dialog -->
                    <AlertDialog :open="showConfirmationDialog" @update:open="showConfirmationDialog = $event">
                        <AlertDialogTrigger as-child>
                            <Button class="w-full" size="lg"
                                :disabled="loading || success || profile?.role === 'author' || profile?.role === 'admin'">
                                <span v-if="loading">Processing...</span>
                                <span v-else-if="success">Welcome Aboard!</span>
                                <span v-else-if="profile?.role === 'author' || profile?.role === 'admin'">Already an
                                    Author</span>
                                <span v-else>Become an Author</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle class="flex items-center gap-2">
                                    <TriangleAlert class="h-5 w-5 text-amber-500" />
                                    Confirm Your Decision
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to become an author? This action will update your account role
                                    and grant you access to the author dashboard.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel @click="closeConfirmationDialog">Cancel</AlertDialogCancel>
                                <AlertDialogAction @click="confirmBecomeAuthor">Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <!-- Dashboard link -->
                    <div class="text-center">
                        <Button variant="ghost" @click="goToDashboard" class="text-sm">
                            Return to Dashboard
                            <ArrowRight class="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <!-- Section 3: Benefits and information -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <BookOpen class="h-5 w-5" />
                        Why Become an Author?
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="flex items-start gap-3">
                        <CheckCircle class="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                            <h4 class="font-medium">Share Your Stories</h4>
                            <p class="text-sm text-muted-foreground">
                                Publish your work and reach readers around the world
                            </p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <CheckCircle class="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                            <h4 class="font-medium">Earn from Your Writing</h4>
                            <p class="text-sm text-muted-foreground">
                                Monetize your content through our coin system
                            </p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <CheckCircle class="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                            <h4 class="font-medium">Build Your Audience</h4>
                            <p class="text-sm text-muted-foreground">
                                Connect with readers and grow your fanbase
                            </p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <CheckCircle class="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                            <h4 class="font-medium">Get Insights</h4>
                            <p class="text-sm text-muted-foreground">
                                Track your performance with detailed analytics
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Section 4: What you can do -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <PenTool class="h-5 w-5" />
                        What You Can Do
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="flex items-center gap-3">
                        <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span class="text-sm font-medium text-primary">1</span>
                        </div>
                        <div>
                            <h4 class="font-medium">Create Books</h4>
                            <p class="text-sm text-muted-foreground">
                                Write and publish unlimited books
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span class="text-sm font-medium text-primary">2</span>
                        </div>
                        <div>
                            <h4 class="font-medium">Manage Chapters</h4>
                            <p class="text-sm text-muted-foreground">
                                Organize your content with flexible chapter management
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span class="text-sm font-medium text-primary">3</span>
                        </div>
                        <div>
                            <h4 class="font-medium">Engage with Readers</h4>
                            <p class="text-sm text-muted-foreground">
                                Respond to comments and build a community
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBecomeAuthor } from '~/composables/useBecomeAuthor'
import { useAuthState } from '~/composables/useAuthState'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { toast } from 'vue-sonner'
import {
    BookOpen,
    PenTool,
    Users,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    TriangleAlert
} from 'lucide-vue-next'

const router = useRouter()
const { user, profile, fetchProfile } = useAuthState()
const { loading, error, success, becomeAuthor } = useBecomeAuthor()

// State for confirmation dialog
const showConfirmationDialog = ref(false)

// Redirect authors and admins away from this page
watch(profile, (newProfile) => {
    if (newProfile && (newProfile.role === 'author' || newProfile.role === 'admin')) {
        toast.info("You already have author access. Redirecting to your dashboard.")
        router.push('/dashboard')
    }
}, { immediate: true })


// Handle the become author action
const handleBecomeAuthor = async () => {
    const result = await becomeAuthor()

    if (result.success) {
        toast.success('Welcome to the author community! 🎉')
        // Refresh the profile to get updated role
        await fetchProfile()
        // The watch effect will handle the redirect automatically after the profile updates
    } else if (result.alreadyAuthor) {
        toast.info('You are already an author!')
        // Refresh the profile just in case the local state is out of sync
        await fetchProfile()
    } else {
        toast.error(result.error || 'Failed to become an author')
    }
}

// Handle confirmation dialog actions
const closeConfirmationDialog = () => {
    showConfirmationDialog.value = false
}

const confirmBecomeAuthor = async () => {
    closeConfirmationDialog()
    await handleBecomeAuthor()
}

// Navigate to dashboard
const goToDashboard = () => {
    router.push('/dashboard')
}
</script>
