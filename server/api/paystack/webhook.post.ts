// server/api/paystack/webhook.post.ts
import { defineEventHandler, readRawBody, getHeader } from 'h3'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'
import crypto from 'node:crypto'

// This endpoint listens for and processes webhooks from Paystack.
export default defineEventHandler(async (event) => {
    const { paystackSecretKey, supabaseUrl, supabaseServiceKey } = useRuntimeConfig(event)

    // 1. Verify the webhook signature to ensure it's from Paystack
    const signature = getHeader(event, 'x-paystack-signature')
    const rawBody = await readRawBody(event)

    if (!signature || !rawBody) {
        // We don't use createError here because Paystack just needs a non-200 response
        event.node.res.statusCode = 400
        return 'Signature or body missing.'
    }
    
    // Create a hash using your secret key
    const hash = crypto.createHmac('sha512', paystackSecretKey).update(rawBody).digest('hex')

    // Compare the generated hash with the one from Paystack
    if (hash !== signature) {
        event.node.res.statusCode = 401
        return 'Invalid signature.'
    }

    // 2. Parse the verified request body
    const payload = JSON.parse(rawBody)

    // 3. We only care about successful charges
    if (payload.event !== 'charge.success') {
        return 'Event received but not processed.'
    }

    const { reference, status, metadata } = payload.data
    const { user_id, coins_to_be_credited } = metadata

    // Double-check the payload for required data
    if (status !== 'success' || !reference || !user_id || !coins_to_be_credited) {
        event.node.res.statusCode = 400
        return 'Payload missing required data.'
    }

    try {
        // Use the service_role key for elevated privileges to update any user's profile
        // This is necessary because the user is not authenticated in this context.
        const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

        // 4. Find the corresponding transaction in our database
        const { data: transaction, error: transactionError } = await supabaseAdmin
            .from('transactions')
            .select('id, status')
            .eq('reference', reference)
            .single()

        if (transactionError || !transaction) {
            console.error(`Webhook Error: Transaction with reference ${reference} not found.`)
            event.node.res.statusCode = 404
            return 'Transaction not found.'
        }
        
        // 5. Idempotency Check: If we've already processed this, don't do it again
        if (transaction.status === 'successful') {
            return 'Transaction already processed.'
        }

        // 6. Update the transaction status to 'successful'
        const { error: updateError } = await supabaseAdmin
            .from('transactions')
            .update({ status: 'successful' })
            .eq('id', transaction.id)
            
        if (updateError) throw new Error(`Failed to update transaction status: ${updateError.message}`)

        // 7. Call the RPC to safely credit the user's account
        const { error: rpcError } = await supabaseAdmin.rpc('increment_coin_balance', {
            target_user_id: user_id,
            coins_to_add: coins_to_be_credited
        })
        
        if (rpcError) throw new Error(`Failed to credit coins to user: ${rpcError.message}`)
        
        // 8. Success! Let Paystack know we're done.
        console.log(`Successfully processed transaction ${reference} for user ${user_id}.`)
        return 'Webhook processed successfully.'

    } catch (err: unknown) {
        console.error('CRITICAL: Error processing Paystack webhook:', err)
        let errorMessage = 'An unexpected server error occurred.'

        if (err instanceof Error) {
            errorMessage = err.message
        } else if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
            errorMessage = err.message
        }
        
        event.node.res.statusCode = 500
        return `Webhook processing failed: ${errorMessage}`
    }
})
