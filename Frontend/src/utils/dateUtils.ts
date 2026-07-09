export const DateUtils = {
  formatDate: (dateValue: string | Date): string => {
    const date = new Date(dateValue)

    const datePart = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)

    const timePart = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date)

    return `${datePart} à ${timePart.replace(':', 'h')}`
  },
}
