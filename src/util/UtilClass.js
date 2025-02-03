import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import CryptoJS from 'crypto-js'

export default class UtilClass {
  static LOCAL_TOKEN_NAME = 'token'

  static BACKEND_BASE_URL = 'http://localhost:8080'
  static BACKEND_SOCKET_BASE_UR = 'ws://localhost:8080'

  static SECRET_KET = 'secretkey123456789'
  static EM_ADMIN = 'em_admin';
  static PW_ADMIN = 'pw_admin';

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
      loading...
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

  static showSuccessToastDelay(message, delay) {
    toastr.success(message, 'Succès', {
      closeButton: true,
      progressBar: true,
      timeOut: delay,
      positionClass: 'toast-top-center',
    })
  }

  static formatNumber(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  static isInvalidTokenError(body) {
    return !body.data && body.message === 'false' && !body.success
  }

  static blinkText(id) {
    const textElement = document.getElementById(id)

    if (textElement) {
      textElement.style.color = 'red'

      setTimeout(function () {
        textElement.style.color = ''
      }, 1000)
    } else {
      console.error("Élément non trouvé avec l'id:", id)
    }
  }

  static formatCurrency(value) {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)

    return formatted.replace('$', '$ ')
  }

  static isAdminAuth() {
    const encryptedData = localStorage.getItem('ad_data')
    if (!encryptedData) {
      return false;
    }

    const bytes = CryptoJS.AES.decrypt(encryptedData, UtilClass.SECRET_KET)
    try {
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
      if (!decryptedData.email || !decryptedData.password) {
        return false;
      }
      return decryptedData.email === UtilClass.EM_ADMIN && decryptedData.password === UtilClass.PW_ADMIN;
    } catch {
      return false;
    }
  }

  static isAdminLogin(email, password) {
    if (!email || !password) {
      return false;
    }
    var eas = email === UtilClass.EM_ADMIN && password === UtilClass.PW_ADMIN;
    if (eas) {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify({ email: email, password: password }),
        UtilClass.SECRET_KET,
      ).toString()
      localStorage.setItem('ad_data', encryptedData)
    }
    return eas;
  }
}
