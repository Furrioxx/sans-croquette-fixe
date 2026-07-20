export const assetUrlToFile = async (url: string, filename: string): Promise<File> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Impossible de charger l'image de démonstration (${response.status}).`)
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type || 'image/jpeg' })
}
