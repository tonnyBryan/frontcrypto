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
        <h2 class="text-left">Sign up</h2>
        <img src="@/assets/App-icon.png" alt="Logo" style="width: 30px; height: 30px" />
      </div>
      <form @submit.prevent="handleInscription" novalidate>
        <!-- Champ Email -->
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="form-control"
            :class="{ 'is-invalid': errors.username }"
            placeholder="Enter your  Username"
            style="background-color: transparent; padding: 13px"
            autocomplete="off"
            required
          />
          <div class="invalid-feedback">
            {{ errors.username }}
          </div>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            placeholder="Enter your e-mail"
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
          <label for="password" class="form-label">Password</label>
          <div class="input-group" style="position: relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              placeholder="Enter your Password"
              style="background-color: transparent; padding: 13px; border-radius: var(--bs-border-radius) !important"
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
        <!-- Bouton Continuee-->
        <button id="submit-btn" type="submit" class="btn btn-warning w-100 mb-3 fw-bold">
          Continue
        </button>
      </form>
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
      <h3 class="mb-4 text-warning">Validate your email to continue</h3>
      <p class="text-muted">
       Please enter the confirmation key sent to your email to activate your account .
      </p>
      <input
        type="text"
        v-model="confirmationKey"
        class="form-control mb-3 text-center"
        style="background-color: #444; color: #fff; border: none; border-radius: 5px"
        placeholder="Enter confirmation key"
      />
      <p class="text-danger mb-3" v-if="errorMessageKey">{{ errorMessageKey }}</p>
      <p class="text-muted">
        or, you can call the URL sent to your email in Postman
      </p>
      <button
        id="confirmAccBtn"
        class="btn btn-warning w-100 fw-bold"
        style="font-size: 1.2rem; margin-top: 2rem"
        @click="confirmAccount"
      >
        Confirm
      </button>
      <button @click="closeModalAcc" style="font-size: 1.2rem" class="btn w-100 annuler">
        Cancel
      </button>
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
      username: '',
      errors: {},
      errorMessage: '',
      confirmationKey: '',
      errorMessageKey: '',
      showConfirmationModal: false,
      showPassword: false,
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    async handleInscription() {
      this.errors = {}
      if (!this.username) {
        this.errors.username = 'Username required'
      }
      if (!this.email) {
        this.errors.email = "E-mail adress  required."
      } else if (!UtilClass.validateEmail(this.email)) {
        this.errors.email = 'Please enter a valid e-mail adresse.'
      }
      if (!this.password) {
        this.errors.password = 'Password required.'
      }

      if (!UtilClass.hasInternetAccess()) {
        UtilClass.showErrorToast("Oups! Check your network and try again")
        return;
      }

      if (Object.keys(this.errors).length === 0) {
        const submitButton = document.getElementById('submit-btn')
        try {
          UtilClass.loadButton(submitButton)
          const response = await fetch(UtilClass.BACKEND_BASE_URL + '/crypto/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: this.username,
              email: this.email,
              password: this.password,
            }),
          })

          const data = await response.json()
          UtilClass.endLoadedButton(submitButton, 'Continue')

          if (data.isSuccess) {
            this.showConfirmationModal = true
          } else {
            if (data.error.code === 500) {
              UtilClass.showErrorToast(data.message)
            }
          }
        } catch (error) {
          console.error('Error during connection :', error.message)
          UtilClass.showErrorToast('Connection lost')
          UtilClass.endLoadedButton(submitButton, 'Continue')
        }
      }
    },
    async confirmAccount() {
      if (!this.confirmationKey) {
        this.errorMessageKey = 'Please enter confirmation key.'
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
        UtilClass.endLoadedButton(confirmAccButton, 'Confirm')

        if (data.isSuccess) {
          const token = data.data.token
          UtilClass.setToken(token)
          this.closeModalAcc()
          this.$router.push('/app/v1')
        } else {
          throw new Error(data.message || 'Invalid confirmation key.')
        }
      } catch (error) {
        UtilClass.endLoadedButton(confirmAccButton, 'Confirm')
        this.errorMessageKey = error.message
      }
    },
    closeModalAcc() {
      this.confirmationKey = ''
      this.errorMessageKey = ''
      this.showConfirmationModal = false
    },
  },
}
</script>

<style scoped>
.vh-100 {
  height: 100vh;
}

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
  color: #ffffff; /* Texte jaune vif au focus */
  border-color: #ffc107; /* Bordure bleu clair au focus */
  outline: none; /* Enlever le contour par défaut */
  box-shadow: none; /* Enlever le contour bleu spécifique à Bootstrap */
}

input:-webkit-autofill {
  background-color: #1e1e1e !important; /* Remettre un fond sombre */
  color: #c7c6c6 !important; /* Garder le texte en blanc */
}
.border-red {
  border: 3px solid #c82333 !important;
}

@media (max-width: 480px) {
  .vh-100 {
    height: unset !important;
  }
}
</style>
