export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  // If the user is unauthenticated AND the route is NOT an authentication page
  // Redirect them to the login page.
  if (!user.value && !to.path.startsWith('/auth')) {
    return navigateTo('/auth/login');
  }
  // If the user is authenticated AND trying to access an authentication page
  // Redirect them to the homepage.
  if (user.value && to.path.startsWith('/auth')) {
    return navigateTo('/');
  }
});