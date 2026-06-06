export enum CatStatus {
  EN_REFUGE = 'en_refuge',
  EN_FAMILLE_ACCUEIL = 'en_famille_accueil',
  ADOPTE = 'adopte',
  EN_SOINS = 'en_soins',
  DECEDE = 'decede',
  PERDU = 'perdu',
}

const getLabel = (value: string) => {
  switch (value) {
    case 'en_refuge':
      return 'En refuge'
    case 'en_famille_accueil':
      return "En famille d'accueil"
    case 'adopte':
      return 'Adopté'
    case 'en_soins':
      return 'En soins'
    case 'decede':
      return 'Décédé'
    case 'perdu':
      return 'Perdu'
  }
}

export const CatStatusList = Object.values(CatStatus).map((value) => ({
  label: getLabel(value),
  value: value,
}))
