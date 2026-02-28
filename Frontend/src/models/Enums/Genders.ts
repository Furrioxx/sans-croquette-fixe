export enum Genders {
  MALE = 'male',
  FEMALE = 'female',
  NOT_DETERMINED = 'not_determined',
}

const getLabel = (value: string) => {
  switch (value) {
    case 'male':
    case 'female':
      return value.charAt(0).toUpperCase() + value.slice(1)
    case 'not_determined':
      return 'Non déterminé'
  }
}

export const GenderList = Object.values(Genders).map((value) => ({
  label: getLabel(value),
  value: value,
}))
