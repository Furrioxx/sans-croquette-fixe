import MokaImage from '@/assets/cats/moka.jpg'
import NovaImage from '@/assets/cats/nova.jpg'
import SimbaImage from '@/assets/cats/simba.jpg'
import { i18n } from '@/i18n'

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

export function getFeaturedCats(): CatProfile[] {
  const { t } = i18n.global

  return [
    {
      name: 'Moka',
      role: t('cats.moka.role'),
      age: t('cats.moka.age'),
      mood: t('cats.moka.mood'),
      story: t('cats.moka.story'),
      imageUrl: MokaImage,
      creditLabel: t('cats.creditLabel'),
      creditUrl: 'https://pixnio.com/media/tabby-cat-eyes-greenish-yellow-nose-portrait',
      licenseLabel: t('cats.licenseLabel'),
      accentClass: 'cat-accent-primary',
    },
    {
      name: 'Nova',
      role: t('cats.nova.role'),
      age: t('cats.nova.age'),
      mood: t('cats.nova.mood'),
      story: t('cats.nova.story'),
      imageUrl: NovaImage,
      creditLabel: t('cats.creditLabel'),
      creditUrl: 'https://pixnio.com/media/playful-kitten-adorable-green-eyes',
      licenseLabel: t('cats.licenseLabel'),
      accentClass: 'cat-accent-secondary',
    },
    {
      name: 'Simba',
      role: t('cats.simba.role'),
      age: t('cats.simba.age'),
      mood: t('cats.simba.mood'),
      story: t('cats.simba.story'),
      imageUrl: SimbaImage,
      creditLabel: t('cats.creditLabel'),
      creditUrl: 'https://pixnio.com/media/kitten-portrait-adorable-greenish-yellow-eyes',
      licenseLabel: t('cats.licenseLabel'),
      accentClass: 'cat-accent-tertiary',
    },
  ]
}
