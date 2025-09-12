export const useGreeting = () => {
  const greeting = ref<string>('Good evening')
  let greetingInterval: NodeJS.Timeout | null = null
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }
  
  const startGreetingUpdates = () => {
    // Set initial greeting
    greeting.value = getGreeting()
    
    // Update greeting every minute
    greetingInterval = setInterval(() => {
      greeting.value = getGreeting()
    }, 60000)
  }
  
  const stopGreetingUpdates = () => {
    if (greetingInterval) {
      clearInterval(greetingInterval)
      greetingInterval = null
    }
  }
  
  onUnmounted(() => {
    stopGreetingUpdates()
  })
  
  return {
    greeting,
    startGreetingUpdates,
    stopGreetingUpdates
  }
}