export function useRelativeTime(dateString: string): string {
  const now = new Date()
  const past = new Date(dateString)
  const diffMs = now.getTime() - past.getTime()

  if (diffMs < 0) return 'in the future'

  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHrs = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHrs / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30.4375) // avg month
  const diffYears = Math.floor(diffDays / 365.25)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHrs < 24) return `${diffHrs} hr ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffWeeks < 4) return `${diffWeeks} wks ago`
  if (diffMonths < 12) return `${diffMonths} mo ago`
  return `${diffYears} yr ago`
}