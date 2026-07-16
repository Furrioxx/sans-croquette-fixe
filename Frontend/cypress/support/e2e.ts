// Sur un serveur Vite fraîchement démarré (toujours le cas en CI, rarement en local où le
// cache .vite persiste entre les runs), la première navigation vers une page qui utilise des
// composants PrimeVue pas encore pré-bundlés déclenche un rechargement complet de la page
// ("optimized dependencies changed, reloading"). Ce rechargement interrompt le premier
// import() dynamique en cours et Cypress le remonte comme une exception non interceptée.
// On l'ignore spécifiquement ici : la page se recharge d'elle-même juste après, et les
// commandes Cypress suivantes (avec leur retry intégré) retrouvent un DOM cohérent.
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Failed to fetch dynamically imported module')) {
    return false
  }
  return true
})
