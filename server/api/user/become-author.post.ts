// server/api/user/become-author.post.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // 1. Get user from session
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const supabase = await serverSupabaseClient(event)

    // 2. Check user's profile for current role
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (fetchError) {
      console.error('Error fetching user profile:', fetchError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch user profile'
      })
    }

    // 3. If already an author, return early
    if (profile.role === 'author') {
      return {
        message: 'You are already an author',
        success: false,
        alreadyAuthor: true
      }
    }

    // 4. Update user role to author in profiles table
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'author' })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating user role:', updateError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update user role'
      })
    }

    // 5. Return success response
    return {
      message: 'Successfully became an author!',
      success: true,
      profile: updatedProfile
    }
  } catch (err: unknown) {
    console.error('Error in become-author API:', err)
    
    // Handle Error instances
    if (err instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: err.message
      })
    }
    
    // Handle object-like errors
    if (err !== null && typeof err === 'object') {
      const errorObj = err as Record<string, unknown>
      const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error'
      const code = typeof errorObj.code === 'string' ? errorObj.code : 'INTERNAL_ERROR'
      throw createError({
        statusCode: 500,
        statusMessage: `${code}: ${message}`
      })
    }
    
    // Fallback for non-object errors
    throw createError({
      statusCode: 500,
      statusMessage: `Unexpected error: ${String(err)}`
    })
  }
})