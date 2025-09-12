import type { Database } from '~/types/database.types'
type Role = Database['public']['Enums']['user_role']

export default defineNuxtRouteMiddleware(async (to) => {
  // Only check roles if the route has a role requirement
  if (to.meta.role) {
    const requiredRole = to.meta.role as Role
    
    // Get the user and client
    const user = useSupabaseUser()
    const client = useSupabaseClient<Database>()
    
    // If no user, let auth middleware handle it
    if (!user.value) return
    
    // Fetch the user's profile to get their role
    const { data: profile, error } = await client
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .single()
    
    if (error || !profile) {
      console.error('Error fetching profile:', error)
      return navigateTo('/unauthorized')
    }
    
    // Define role hierarchy
    const roleHierarchy: Role[] = ['reader', 'author', 'admin']
    
    // Check if user has the required role (including hierarchy)
    const userRole = profile.role
    const requiredIndex = roleHierarchy.indexOf(requiredRole)
    const userIndex = roleHierarchy.indexOf(userRole)
    
    // User has role if their role is at or above the required level
    if (userIndex < requiredIndex) {
      // Redirect to unauthorized page if role check fails
      return navigateTo('/dashboard')
    }
  }
})