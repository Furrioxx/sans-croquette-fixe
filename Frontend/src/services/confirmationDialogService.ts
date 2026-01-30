let confirmSrv: any

function showConfirmDelete(
  header: string,
  message: string,
  acceptCallback: Function,
  rejectCallback: Function,
) {
  confirmSrv.require({
    message: message,
    header: header,
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Annuler',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Supprimer',
      severity: 'danger',
    },
    accept: () => {
      acceptCallback()
    },
    reject: () => {
      rejectCallback()
      confirmSrv.close()
    },
    onHide: () => {
      confirmSrv.close() // Assure la fermeture quand on clique en dehors
    },
  })
}

function showConfirmValidation(
  header: string,
  message: string,
  acceptCallback: Function,
  rejectCallback: Function,
) {
  confirmSrv.require({
    message: message,
    header: header,
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Annuler',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Valider',
      severity: 'primary',
    },
    accept: () => {
      acceptCallback()
    },
    reject: () => {
      rejectCallback()
    },
  })
}

function init(confirm: any) {
  confirmSrv = confirm
}

export default {
  init,
  showConfirmDelete,
  showConfirmValidation,
}