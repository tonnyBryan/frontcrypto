import axios from 'axios'
import CryptoJS from 'crypto-js'
import './footer/mystyle.css';

export default class UtilClass {
  static LOCAL_TOKEN_NAME = 'token'

  static BACKEND_BASE_URL = 'http://192.168.43.107:8080'
  static BACKEND_SOCKET_BASE_UR = 'ws://192.168.43.107:8080'

  static SECRET_KET = 'secretkey123456789'
  static EM_ADMIN = 'em_admin';
  static PW_ADMIN = 'pw_admin';

  static redirectToLogin(router) {
    router.push('/app')
  }

  static hasInternetAccess() {
    return navigator.onLine;
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

  static showAlert(type, message, duration = 5000) {
    const icon = type === 'success'
        ? '<i class="bi bi-check-circle-fill text-success"></i>' 
        : '<i class="bi bi-exclamation-triangle-fill text-danger"></i>'; 

   
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-dismissible fade show d-flex align-items-center custom-alert`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
      ${icon}
      <span class="ms-2">${message}</span>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertDiv.classList.add(type === 'success' ? 'alert-success' : 'alert-danger');
    alertDiv.style.transform = 'translateY(-100px)';
    alertDiv.style.opacity = '0';
    alertDiv.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';

  
    let alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
      alertContainer = document.createElement('div');
      alertContainer.id = 'alert-container';
      alertContainer.className = 'position-fixed start-50 translate-middle-x';
      alertContainer.style.top = '20px';
      alertContainer.style.zIndex = '1050';
      alertContainer.style.width = '400px';
      document.body.appendChild(alertContainer);
    }

    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.style.transform = 'translateY(0)';
      alertDiv.style.opacity = '1';
    }, 100);

    
    setTimeout(() => {
      alertDiv.style.transform = 'translateY(-100px)';
      alertDiv.style.opacity = '0';
      setTimeout(() => alertDiv.remove(), 500);
    }, duration);
  }

  static showSuccessToast(message, duration = 5000) {
    this.showAlert('success', message, duration);
  }

  static showErrorToast(message, duration = 5000) {
    this.showAlert('error', message, duration);
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
