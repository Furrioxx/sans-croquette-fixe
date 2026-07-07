import MokaImage from '@/assets/cats/moka.jpg'
import NovaImage from '@/assets/cats/nova.jpg'
import SimbaImage from '@/assets/cats/simba.jpg'

export type CatProfile = {
  name: string
  role: string
  age: string
  mood: string
  story: string
  imageUrl: string
  creditLabel: string
  creditUrl: string
  licenseLabel: string
  accentClass: string
}

export const featuredCats: CatProfile[] = [
  {
    name: 'Moka',
    role: 'Profil calme',
    age: '2 ans',
    mood: 'Besoin d’un foyer stable',
    story:
      'Moka observe, s’adapte vite et cherche surtout un environnement rassurant avec des habitudes simples.',
    imageUrl: MokaImage,
    creditLabel: 'Photo CC0 par Bicanski via Pixnio',
    creditUrl: 'https://pixnio.com/media/tabby-cat-eyes-greenish-yellow-nose-portrait',
    licenseLabel: 'CC0',
    accentClass: 'cat-accent-primary',
  },
  {
    name: 'Nova',
    role: 'Profil joueur',
    age: '8 mois',
    mood: 'Curieuse et vive',
    story:
      'Nova est parfaite pour une famille présente, capable de lui offrir jeux, exploration et temps d’adaptation.',
    imageUrl: NovaImage,
    creditLabel: 'Photo CC0 par Bicanski via Pixnio',
    creditUrl: 'https://pixnio.com/media/playful-kitten-adorable-green-eyes',
    licenseLabel: 'CC0',
    accentClass: 'cat-accent-secondary',
  },
  {
    name: 'Simba',
    role: 'Profil senior',
    age: '7 ans',
    mood: 'Doux et très sociable',
    story:
      'Simba recherche une adoption responsable, avec une attention particulière au confort, aux soins et à la routine.',
    imageUrl: SimbaImage,
    creditLabel: 'Photo CC0 par Bicanski via Pixnio',
    creditUrl: 'https://pixnio.com/media/kitten-portrait-adorable-greenish-yellow-eyes',
    licenseLabel: 'CC0',
    accentClass: 'cat-accent-tertiary',
  },
]
