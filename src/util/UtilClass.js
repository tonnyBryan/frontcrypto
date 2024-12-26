import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

export default class UtilClass {
  static LOCAL_TOKEN_NAME = 'token'
  static BACKEND_BASE_URL = 'http://localhost:8080'

  static redirectToLogin(router) {
    router.push('/app')
  }

  static getLocalToken() {
    return localStorage.getItem(UtilClass.LOCAL_TOKEN_NAME)
  }

  static removeLocalToken() {
    localStorage.removeItem(UtilClass.LOCAL_TOKEN_NAME)
  }

  static setToken(token) {
    localStorage.setItem(UtilClass.LOCAL_TOKEN_NAME, token)
  }

  static async verifyToken(router) {
    const token = UtilClass.getLocalToken()
    if (!token) {
      UtilClass.redirectToLogin(router)
    } else {
      try {
        await axios.get(`${UtilClass.BACKEND_BASE_URL}/crypto/auth/validateToken`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (error) {
        console.error('Token invalide ou expiré', error)

        UtilClass.removeLocalToken()
        UtilClass.redirectToLogin(router)
      }
    }
  }

  static validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  static loadButton(button) {
    button.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Chargement...
    `
    button.disabled = true
  }

  static endLoadedButton(button, initialtext) {
    button.innerHTML = initialtext
    button.disabled = false
  }

  static showErrorToast(message) {
    toastr.error(message || 'Une erreur est survenue. Veuillez réessayer.', 'Erreur', {
      closeButton: true,
      progressBar: true,
      timeOut: 5000,
      positionClass: 'toast-top-right',
    })
  }

  static showSuccessToast(message) {
    toastr.success(message, 'Succès', {
      closeButton: true,
      progressBar: true,
      timeOut: 5000,
      positionClass: 'toast-top-right',
    })
  }

  static formatNumber(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }
}
