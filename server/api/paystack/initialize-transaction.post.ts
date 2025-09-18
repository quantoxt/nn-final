// server/api/paystack/initialize-transaction.post.ts

import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

/**
 * Initializes a payment transaction with Paystack.
 * Expects a `packageId` in the request body.
 * Returns an `authorization_url` for the client to redirect to.
 */
export default defineEventHandler(async (event) => {
    // 1. Get authenticated user
    const user = await serverSupabaseUser(event)
    if (!user || !user.email) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication is required to make a purchase.' })
    }

    // 2. Validate request body
    const { packageId } = await readBody(event)
    if (typeof packageId !== 'string' || !packageId) {
        throw createError({ statusCode: 400, statusMessage: 'A valid package ID is required.' })
    }
    
    // 3. Get Paystack secret from runtime config
    const { paystackSecretKey } = useRuntimeConfig(event)
    if (!paystackSecretKey) {
        console.error('Server error: Paystack secret key is not configured.')
        throw createError({ statusCode: 500, statusMessage: 'Payment provider configuration error.' })
    }

    try {
        const supabase = await serverSupabaseClient<Database>(event)

        // 4. Fetch the selected coin package from the database
        const { data: coinPackage, error: packageError } = await supabase
            .from('coin_packages')
            .select('id, price, currency, coins_amount')
            .eq('id', packageId)
            .eq('is_active', true)
            .single()

        // If there's an error or the package doesn't exist, throw an error
        if (packageError || !coinPackage) {
            throw createError({ statusCode: 404, statusMessage: 'The selected coin package was not found or is currently unavailable.' })
        }

        // 5. Create a unique reference for this transaction
        const reference = `NN_${crypto.randomUUID().replace(/-/g, '')}`

        // 6. Create a 'pending' transaction record in our database
        const { error: transactionError } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                amount: coinPackage.price,
                currency: coinPackage.currency,
                status: 'pending',
                reference: reference,
            })

        if (transactionError) {
            // This is a critical database error, re-throw it to be caught
            throw transactionError
        }

        // 7. Call Paystack API to initialize the transaction
        // Note: Paystack requires the amount in the smallest currency unit (kobo/cents)
        const amountInMinorUnit = Math.round(coinPackage.price * 100)

        const paystackResponse = await $fetch<{
            status: boolean
            message: string
            data: {
                authorization_url: string
                access_code: string
                reference: string
            }
        }>('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${paystackSecretKey}`,
                'Content-Type': 'application/json',
            },
            body: {
                email: user.email,
                amount: amountInMinorUnit,
                currency: coinPackage.currency,
                reference: reference,
                metadata: {
                    user_id: user.id,
                    package_id: coinPackage.id,
                    coins_to_be_credited: coinPackage.coins_amount,
                    custom_fields: [
                        {
                            display_name: "User ID",
                            variable_name: "user_id",
                            value: user.id
                        }
                    ]
                },
            },
        })

        if (!paystackResponse || !paystackResponse.status) {
            // If Paystack fails, update our transaction record to 'failed' for tracking
            await supabase.from('transactions').update({ status: 'failed' }).eq('reference', reference)
            throw new Error(paystackResponse.message || 'Failed to initialize payment with the provider.')
        }

        // 8. Success: Return the authorization URL to the client
        return {
            authorization_url: paystackResponse.data.authorization_url,
        }
    } catch (err: unknown) {
        // Robust error handling as requested
        console.error('Error in initialize-transaction API:', err)

        // Re-throw H3Errors directly
        if (typeof err === 'object' && err !== null && 'statusCode' in err) {
            throw err
        }
        
        // Handle standard Error instances (including Supabase & Paystack API errors)
        if (err instanceof Error) {
            throw createError({ statusCode: 500, statusMessage: err.message })
        }

        // Handle other object-like errors
        if (typeof err === 'object' && err !== null) {
            const errorObj = err as Record<string, unknown>
            const message = typeof errorObj.message === 'string' ? errorObj.message : 'An unknown error occurred.'
            throw createError({ statusCode: 500, statusMessage: message })
        }

        // Fallback for non-object errors (e.g., a string was thrown)
        throw createError({
            statusCode: 500,
            statusMessage: `An unexpected error occurred: ${String(err)}`,
        })
    }
})
