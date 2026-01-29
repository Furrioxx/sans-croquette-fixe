let toastSvc: any

function showInfo(title: string, message: string, duration = 3000) {
  toastSvc.add({
    severity: 'info',
    summary: title,
    detail: message,
    life: duration,
  })
}

function showSuccess(title: string, message: string, duration = 3000) {
  toastSvc.add({
    severity: 'success',
    summary: title,
    detail: message,
    life: duration,
  })
}

function showAlert(title: string, message: string, duration = 3000) {
  toastSvc.add({
    severity: 'warn',
    summary: title,
    detail: message,
    life: duration,
  })
}

function showError(title: string, message: string, duration = 3000) {
  toastSvc.add({
    severity: 'error',
    summary: title,
    detail: message,
    life: duration,
  })
}

function init(toast: any) {
  toastSvc = toast
}

export default {
  init,
  showInfo,
  showAlert,
  showError,
  showSuccess,
}