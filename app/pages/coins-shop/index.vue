<!-- pages/coins-shop.vue -->
<template>
  <div class="container py-12 max-w-4xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">Coins Shop</h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        Purchase coins to unlock exclusive stories and support your favorite authors.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center">
      <p class="text-muted-foreground">Loading packages...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center">
      <Alert variant="destructive" class="max-w-md mx-auto">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>Error Loading Packages</AlertTitle>
        <AlertDescription>
          {{ error }}
        </AlertDescription>
      </Alert>
    </div>

    <!-- Not Authenticated State -->
    <div v-else-if="!isAuthenticated" class="text-center py-8">
      <Card class="max-w-md mx-auto">
        <CardContent class="pt-6">
          <div class="flex flex-col items-center gap-4">
            <AlertCircle class="h-12 w-12 text-muted-foreground" />
            <h3 class="text-lg font-medium">Please Log In</h3>
            <p class="text-muted-foreground text-center">
              You need to be logged in to purchase coins.
            </p>
            <Button @click="router.push('/auth/login')">
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Packages Display -->
    <div v-else-if="packages && packages.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="pkg in packages" :key="pkg.id" class="flex flex-col">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">{{ pkg.name }}</CardTitle>
          <CardDescription>{{ pkg.description }}</CardDescription>
        </CardHeader>
        <CardContent class="flex-grow flex flex-col items-center justify-center">
          <div class="my-4">
            <span class="text-4xl font-bold">{{ pkg.coins_amount.toLocaleString() }}</span>
            <span class="text-lg text-muted-foreground ml-1">Coins</span>
          </div>
          <div class="text-3xl font-semibold mb-6">
            {{ pkg.price }} <span class="text-base font-normal">{{ pkg.currency }}</span>
          </div>
          <Button @click="handlePurchase(pkg.id)" :disabled="purchaseInProgressId === pkg.id" class="w-full" size="lg">
            <span v-if="purchaseInProgressId === pkg.id">Processing...</span>
            <span v-else>Purchase Now</span>
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- No Packages State -->
    <div v-else class="text-center">
      <p class="text-muted-foreground">No coin packages are available at the moment. Please check back later.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseClient } from '#imports'
import { useAuthState } from '~/composables/useAuthState'
import type { Database } from '~/types/database.types'
import { toast } from 'vue-sonner'

// Import UI components
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '~/components/ui/alert'
import { AlertCircle } from 'lucide-vue-next'


type CoinPackage = Database['public']['Tables']['coin_packages']['Row']

const router = useRouter()
const supabase = useSupabaseClient<Database>()
const { isAuthenticated } = useAuthState()

const packages = ref<CoinPackage[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const purchaseInProgressId = ref<string | null>(null)

// Fetch coin packages from Supabase
const fetchPackages = async () => {
  try {
    isLoading.value = true
    const { data, error: fetchError } = await supabase
      .from('coin_packages')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true })

    if (fetchError) throw fetchError
    packages.value = data || []
  } catch (err: unknown) {
    console.error('Error fetching coin packages:', err)
    let errorMessage = 'An unknown error occurred while fetching packages.';
    if (err instanceof Error) {
      errorMessage = err.message
    } else if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
      errorMessage = err.message
    } else {
      errorMessage = String(err)
    }
    error.value = errorMessage
    toast.error('Could not load coin packages.')
  } finally {
    isLoading.value = false
  }
}

// Handle purchase button click
const handlePurchase = async (packageId: string) => {
  if (purchaseInProgressId.value) return // Prevent multiple clicks

  try {
    purchaseInProgressId.value = packageId
    toast.info('Redirecting to payment gateway...')

    // Call our server endpoint
    const response = await $fetch<{ authorization_url: string }>('/api/paystack/initialize-transaction', {
      method: 'POST',
      body: { packageId }
    })

    // Redirect user to Paystack's payment page
    if (response && response.authorization_url) {
      window.location.href = response.authorization_url
    } else {
      throw new Error('Could not retrieve payment URL.')
    }

  } catch (err: unknown) {
    console.error('Payment initialization failed:', err)
    let errorMessage = 'An unexpected error occurred during payment initialization.'

    // Check for Nuxt's $fetch error structure first
    if (err && typeof err === 'object' && 'data' in err && err.data && typeof err.data === 'object' && 'statusMessage' in err.data) {
      errorMessage = (err.data as { statusMessage: string }).statusMessage;
    } else if (err instanceof Error) {
      errorMessage = err.message
    } else if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
      errorMessage = err.message
    } else {
      errorMessage = String(err)
    }

    toast.error(`Payment failed: ${errorMessage}`)
  } finally {
    // Ensure the button is re-enabled on failure
    purchaseInProgressId.value = null
  }
}

onMounted(() => {
  fetchPackages()
})
</script>
