export const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) || 'dons@sanscroquettesfixes.fr'

export const buildMailtoLink = (subject?: string) => {
  if (!subject) return `mailto:${CONTACT_EMAIL}`
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
}
