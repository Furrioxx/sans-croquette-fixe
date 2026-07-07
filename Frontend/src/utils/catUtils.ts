import type { Cat } from '@/models/Cat'

export const isKitten = (cat: Cat) => {
  if (!cat.birthDate) return false
  const months = Math.floor(
    (Date.now() - new Date(cat.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44),
  )
  return months <= 12
}
