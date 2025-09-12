import { computed } from 'vue'
import type { Database } from '~/types/database.types'
type Role = Database['public']['Enums']['user_role']

export const useAuthorization = () => {
  const { user, profile, isAuthenticated, isLoading } = useAuthState()
  
  // Role hierarchy - higher index = higher permission level
  const roleHierarchy: Role[] = ['reader', 'author', 'admin']
  
  // Check if user has required role (including hierarchy)
  const hasRole = (requiredRole: Role, includeHigherRoles = true) => {
    if (!isAuthenticated.value || !profile.value) return false

    const userRole = profile.value.role
    if (!userRole) return false

    const requiredIndex = roleHierarchy.indexOf(requiredRole)
    const userIndex = roleHierarchy.indexOf(userRole)

    // If either role is not in the hierarchy, return false
    if (requiredIndex === -1 || userIndex === -1) return false

    // Check based on whether higher roles should be included
    if (includeHigherRoles) {
      // User has role if their role is at or above the required level
      return userIndex >= requiredIndex
    } else {
      // User has role only if their role is an exact match
      return userIndex === requiredIndex
    }
  }
  
  // Common role checks (computed for performance)
  const isAdmin = computed(() => hasRole('admin'))
  const isModerator = computed(() => hasRole('author'))
  const isRegularUser = computed(() => hasRole('reader'))
  
  // Require role with redirect
  const requireRole = (requiredRole: Role, redirectTo = '/unauthorized') => {
    if (isLoading.value) return false // Still loading
    
    if (!hasRole(requiredRole)) {
      navigateTo(redirectTo)
      return false
    }
    return true
  }
  
  return {
    user,
    profile,
    isLoading,
    hasRole,
    isAdmin,
    isModerator,
    isRegularUser,
    requireRole
  }
}