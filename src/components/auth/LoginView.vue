<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div
      class="card p-4 shadow lg"
      style="
        width: 22rem;
        background-color: transparent;
        color: #fff;
        border-radius: 10px;
        border: solid 1px #666365;
      "
    >
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="text-left">Connexion</h2>
        <img src="@/assets/binance-logo.svg" alt="Logo" style="width: 30px; height: 30px" />
      </div>
      <form @submit.prevent="handleLogin" novalidate>
        <!-- Champ Email -->
        <div class="mb-3">
          <label for="email" class="form-label">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            placeholder="Entrez votre e-mail"
            style="background-color: transparent; padding: 13px"
            autocomplete="off"
            required
          />
          <div class="invalid-feedback">
            {{ errors.email }}
          </div>
        </div>
        <!-- Champ Mot de Passe -->
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <div class="input-group" style="position: relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              placeholder="password"
              style="
                background-color: transparent;
                padding: 13px;
                border-radius: 0.375rem !important;
              "
              autocomplete="off"
              required
            />
            <span
              @click="togglePasswordVisibility"
              class="hide"
              style="
                position: absolute;
                right: 18px;
                top: 50%;
                transform: translateY(-50%);
                height: 20px;
                z-index: 999;
              "
            >
              <i
                style="cursor: pointer"
                :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
              ></i>
            </span>
          </div>
          <div class="invalid-feedback">
            {{ errors.password }}
          </div>
        </div>

        <!-- Bouton Continuer -->
        <button id="submit-btn" type="submit" class="btn btn-warning w-100 mb-3 fw-bold">
          Continuer
        </button>
      </form>
    </div>

    <!-- Modale pour le code PIN -->
    <div
      class="modal d-flex justify-content-center align-items-center"
      v-if="showPinModal"
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1050;
      "
    >
      <div
        class="card fade-in p-5 text-center shadow-lg cd"
        style="width: 35rem; background-color: #1e2329; border-radius: 15px; color: #fff"
      >
        <h5 class="mb-4 email">{{ email }}</h5>
        <h3 class="mb-4">On veut s’assurer que c’est bien vous</h3>
        <p class="text-muted">Veuillez entrer le code PIN à 6 chiffres envoyé à votre e-mail.</p>
        <div class="d-flex justify-content-center mb-4">
          <input
            v-for="(digit, index) in pin"
            :key="index"
            type="text"
            maxlength="1"
            v-model="pin[index]"
            class="form-control text-center mx-2"
            style="
              width: 3rem;
              font-size: 2rem;
              background-color: #444;
              color: #fff;
              border: none;
              border-radius: 5px;
            "
          />
        </div>
        <p class="text-danger mb-3" v-if="errorMessagePin">{{ errorMessagePin }}</p>
        <p class="text-muted mb-4">
          Temps restant : <strong>{{ timer }}</strong> secondes
        </p>
        <button
          id="confirmPinBtn"
          class="btn btn-warning w-100 fw-bold"
          style="font-size: 1.2rem"
          @click="confirmPin"
        >
          Confirmer
        </button>
        <button @click="closePinModal" style="font-size: 1.2rem" class="btn w-100 annuler">
          Cancel
        </button>
      </div>
    </div>

    <!-- Modal pour la confirmation du compte -->
    <div
      class="modal d-flex justify-content-center align-items-center"
      v-if="showConfirmationModal"
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1050;
      "
    >
      <div
        class="card fade-in p-5 text-center shadow-lg cd"
        style="width: 35rem; background-color: #1e2329; border-radius: 15px; color: #fff"
      >
        <h5 class="mb-4 email">{{ email }}</h5>
        <h3 class="mb-4 text-warning">Confirmation de compte requise</h3>
        <p class="text-muted">
          Veuillez entrer la clé de confirmation envoyée à votre e-mail pour activer votre compte.
        </p>
        <input
          type="text"
          v-model="confirmationKey"
          class="form-control mb-3 text-center"
          style="background-color: #444; color: #fff; border: none; border-radius: 5px"
          placeholder="Entrez la clé de confirmation"
        />
        <p class="text-danger mb-3" v-if="errorMessageKey">{{ errorMessageKey }}</p>
        <p class="text-muted">
          or, vous pouvez juste appeler dans postman l'url envoyé à votre email
        </p>
        <button
          id="confirmAccBtn"
          class="btn btn-warning w-100 fw-bold"
          style="font-size: 1.2rem; margin-top: 2rem"
          @click="confirmAccount"
        >
          Confirmer
        </button>
        <button @click="closeModalAcc" style="font-size: 1.2rem" class="btn w-100 annuler">
          Cancel
        </button>
      </div>
    </div>

    <!-- Modale pour compte bloqué -->
    <div
      class="modal d-flex justify-content-center align-items-center"
      v-if="showBlockedAccountModal"
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1050;
      "
    >
      <div
        class="card fade-in p-5 text-center shadow-lg cd"
        style="width: 35rem; background-color: #1e2329; border-radius: 15px; color: #fff"
      >
        <h5 class="mb-4 email">{{ email }}</h5>
        <h3 class="mb-4 text-danger">Votre compte est bloqué</h3>
        <p class="text-muted">Veuillez demander une réinitialisation via votre e-mail.</p>

        <!-- Bouton pour demander une réinitialisation -->
        <button
          id="demandeBtn"
          class="btn btn-warning w-100 fw-bold"
          style="font-size: 1.2rem"
          @click="requestReset"
          :disabled="isResetRequested"
        >
          Demander une réinitialisation
        </button>
        <button
          v-if="!isResetRequested"
          @click="closeModalBlocked"
          style="font-size: 1.2rem"
          class="btn w-100 annuler"
        >
          Cancel
        </button>

        <!-- Formulaire de réinitialisation -->
        <div v-if="isResetRequested">
          <p class="text-muted" style="margin-bottom: 0.5rem; margin-top: 2rem">
            Veuillez saisir la clé de réinitialisation envoyée à votre e-mail.
          </p>
          <p class="text-muted">
            or, vous pouvez juste appeler dans postman l'url envoyé à votre email
          </p>
          <input
            type="text"
            v-model="resetKey"
            class="form-control mb-3"
            placeholder="Clé de réinitialisation"
            style="background-color: #444; color: #fff"
          />
          <p class="text-danger mt-3" v-if="resetErrorMessage">{{ resetErrorMessage }}</p>

          <button
            id="confirmResetBtn"
            class="btn btn-success w-100 fw-bold"
            style="font-size: 1.2rem; margin-top: 3rem"
            @click="confirmResetKey"
          >
            Confirmer
          </button>
          <button @click="closeModalBlocked" style="font-size: 1.2rem" class="btn w-100 annuler">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UtilClass from '@/util/UtilClass'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      errors: {},
      showPinModal: false,
      pin: Array(6).fill(''), // pin
      timer: 90,
      countdown: null,
      errorMessagePin: '',
      errorMessageKey: '',
      aKey: '',
      showConfirmationModal: false,
      confirmationKey: '',
      showBlockedAccountModal: false,
      isResetRequested: false,
      resetKey: '',
      resetErrorMessage: '',
      showPassword: false,
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    async handleLogin() {
      this.errors = {}
      if (!this.email) {
        this.errors.email = "L'adresse e-mail est obligatoire."
      } else if (!UtilClass.validateEmail(this.email)) {
        this.errors.email = 'Veuillez entrer une adresse e-mail valide.'
      }
      if (!this.password) {
        this.errors.password = 'Le mot de passe est obligatoire.'
      }

      if (Object.keys(this.errors).length === 0) {
        const submitButton = document.getElementById('submit-btn')
        try {
          UtilClass.loadButton(submitButton)
          const response = await fetch(UtilClass.BACKEND_BASE_URL + '/crypto/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password,
            }),
          })

          const data = await response.json()
          UtilClass.endLoadedButton(submitButton, 'Continuer')

          if (data.isSuccess) {
            this.aKey = data.data
            this.showPinModal = true
            this.startCountdown()
          } else {
            if (data.error.code === 500) {
              UtilClass.showErrorToast(data.message)
            } else if (data.error.code === 555) {
              this.showConfirmationModal = true
            } else if (data.error.code === 550) {
              this.showBlockedAccountModal = true
            }
          }
        } catch (error) {
          console.error('Erreur lors de la connexion :', error.message)
          UtilClass.showErrorToast('Connection Perdue')
          UtilClass.endLoadedButton(submitButton, 'Continuer')
        }
      }
    },
    startCountdown() {
      this.countdown = setInterval(() => {
        if (this.timer > 0) {
          this.timer--
        } else {
          this.closePinModal()
        }
      }, 1000)
    },
    async confirmPin() {
      const enteredPin = this.pin.join('')
      if (enteredPin.length !== 6) {
        this.errorMessagePin = 'Veuillez entrer un code PIN complet.'
        return
      }

      const confirmPinButton = document.getElementById('confirmPinBtn')
      UtilClass.loadButton(confirmPinButton)
      try {
        const response = await fetch(UtilClass.BACKEND_BASE_URL + '/crypto/auth/confirmPin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            aKey: this.aKey,
            pin: enteredPin,
          }),
        })

        const data = await response.json()
        UtilClass.endLoadedButton(confirmPinButton, 'Confirmer')

        if (data.isSuccess) {
          const token = data.data.token
          UtilClass.setToken(token)
          this.closePinModal()
          this.$router.push('/app/v1')
        } else {
          if (data.error.code === 500) {
            this.errorMessagePin = data.message
          } else if (data.error.code === 550) {
            this.errorMessagePin = ''
            this.closePinModal()
            this.showBlockedAccountModal = true
          }
        }
      } catch (error) {
        UtilClass.endLoadedButton(confirmPinButton, 'Confirmer')
        this.errorMessagePin = error.message
      }
    },

    async confirmAccount() {
      if (!this.confirmationKey) {
        this.errorMessageKey = 'Veuillez entrer une clé de confirmation.'
        return
      }

      const confirmAccButton = document.getElementById('confirmAccBtn')
      UtilClass.loadButton(confirmAccButton)
      try {
        const response = await fetch(
          UtilClass.BACKEND_BASE_URL + '/crypto/auth/validate?key=' + this.confirmationKey,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const data = await response.json()
        UtilClass.endLoadedButton(confirmAccButton, 'Confirmer')

        if (data.isSuccess) {
          const token = data.data.token
          UtilClass.setToken(token)
          this.closeModalAcc()
          this.$router.push('/app/v1')
        } else {
          throw new Error(data.message || 'Clé de confirmation invalide.')
        }
      } catch (error) {
        UtilClass.endLoadedButton(confirmAccButton, 'Confirmer')
        this.errorMessageKey = error.message
      }
    },

    async requestReset() {
      const demandeBtn = document.getElementById('demandeBtn')
      UtilClass.loadButton(demandeBtn)
      try {
        const response = await fetch(UtilClass.BACKEND_BASE_URL + '/crypto/auth/reset/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: this.email }),
        })

        const data = await response.json()
        UtilClass.endLoadedButton(demandeBtn, 'Demander une réinitialisation')

        if (data.isSuccess) {
          this.isResetRequested = true
        } else {
          throw new Error(data.message || 'Échec de la demande de réinitialisation.')
        }
      } catch (error) {
        UtilClass.endLoadedButton(demandeBtn, 'Demander une réinitialisation')
        UtilClass.showErrorToast(error.message)
      }
    },

    async confirmResetKey() {
      if (!this.resetKey) {
        this.resetErrorMessage = 'Veuillez entrer une clé de réinitialisation.'
        return
      }

      const confirmResetButton = document.getElementById('confirmResetBtn')
      UtilClass.loadButton(confirmResetButton)

      try {
        const response = await fetch(
          UtilClass.BACKEND_BASE_URL + '/crypto/auth/reset?key=' + this.resetKey,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const data = await response.json()
        UtilClass.endLoadedButton(confirmResetButton, 'Confirmer')

        if (data.isSuccess) {
          UtilClass.showSuccessToast('Votre compte a été réinitialisé.')
          this.closeModalBlocked()
        } else {
          throw new Error(data.message || 'Clé de réinitialisation invalide.')
        }
      } catch (error) {
        UtilClass.endLoadedButton(confirmResetButton, 'Confirmer')
        this.resetErrorMessage = error.message
      }
    },
    closeModalBlocked() {
      this.isResetRequested = false
      this.resetKey = ''
      this.resetErrorMessage = ''
      this.showBlockedAccountModal = false
    },
    closeModalAcc() {
      this.confirmationKey = ''
      this.errorMessageKey = ''
      this.showConfirmationModal = false
    },
    closePinModal() {
      clearInterval(this.countdown)
      this.showPinModal = false
      this.timer = 90
      this.errorMessagePin = ''
      this.pin = Array(this.pin.length).fill('')
    },
  },
}
</script>

<style scoped>
.text-muted {
  color: #bbbbbb !important;
}

input::placeholder {
  color: #aaaaaa; /* Exemple : texte du placeholder gris clair */
}

input {
  color: #ffffff;
  font-size: larger;
  font-weight: 600;
}

input:focus {
  color: #ffffff;
  border-color: #ffc107;
  outline: none;
  box-shadow: none;
}

input:-webkit-autofill {
  background-color: #1e1e1e !important;
  color: #c7c6c6 !important;
}

.border-red {
  border: 3px solid #c82333 !important;
}

.email {
  font-weight: revert;
  color: #d3d3d3;
}

@media (max-width: 480px) {
  .vh-100 {
    height: unset !important;
  }
}
</style>
