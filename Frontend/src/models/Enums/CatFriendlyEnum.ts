export enum CatFriendly {
  NO = 'no',
  YES = 'yes',
  UNKNOWN = 'unknown',
}

const getLabel = (value: string) => {
  switch (value) {
    case 'no':
      return 'Non'
    case 'yes':
      return 'Oui'
    case 'unknown':
      return 'Inconnu'
  }
}

export const CatFriendlyList = Object.values(CatFriendly).map((value) => ({
  label: getLabel(value),
  value: value,
}))
