// server/api/chapters/unlock.post.ts

import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

/**
 * Handles the unlocking of a chapter by a reader.
 * Expects a `chapterId` in the request body.
 */
export default defineEventHandler(async (event) => {
    // 1. Get the authenticated user (the reader)
    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication is required.' })
    }

    // 2. Get the chapter ID from the request body
    const { chapterId } = await readBody(event)
    if (!chapterId || typeof chapterId !== 'string') {
        throw createError({ statusCode: 400, statusMessage: 'A valid chapter ID is required.' })
    }

    try {
        const supabase = await serverSupabaseClient<Database>(event)

        // 3. Check if the user has already unlocked this chapter
        const { data: existingUnlock, error: checkError } = await supabase
            .from('unlocked_chapters')
            .select('chapter_id')
            .eq('reader_id', user.id)
            .eq('chapter_id', chapterId)
            .maybeSingle()

        if (checkError) throw checkError // Forward database errors
        
        if (existingUnlock) {
            // This prevents a user from being charged twice for the same chapter.
            return { success: true, message: 'Chapter already unlocked.' }
        }

        // 4. Call the powerful RPC function to handle the entire transaction
        const { data, error: rpcError } = await supabase.rpc('unlock_chapter_and_process_earnings', {
            reader_id_param: user.id,
            chapter_id_param: chapterId
        })

        if (rpcError) {
            // The database function will raise specific errors we can catch.
            if (rpcError.message.includes('insufficient_funds')) {
                throw createError({ statusCode: 402, statusMessage: 'Insufficient coin balance.' })
            }
            // For other database-level errors
            throw rpcError
        }

        // 5. Return the success response from the RPC function
        return data

    } catch (err: unknown) {
        console.error('Error in /api/chapters/unlock:', err)

        // Re-throw H3Errors directly
        if (typeof err === 'object' && err !== null && 'statusCode' in err) {
            throw err
        }
        
        // Handle standard Error instances (including Supabase & API errors)
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

