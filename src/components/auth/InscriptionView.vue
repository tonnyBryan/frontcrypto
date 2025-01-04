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
        <h2 class="text-left">Inscription</h2>
        <img src="@/assets/binance-logo.svg" alt="Logo" style="width: 30px; height: 30px" />
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
            placeholder="Entrez votre Username"
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
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            placeholder="Entrez votre mot de passe"
            style="background-color: transparent; padding: 13px"
            required
          />
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
      <h3 class="mb-4 text-warning">Valider votre email pour continuer</h3>
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
    }
  },
  methods: {
    async handleInscription() {
      this.errors = {}
      if (!this.username) {
        this.errors.username = 'Username Obligatoire'
      }
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
          UtilClass.endLoadedButton(submitButton, 'Continuer')

          if (data.isSuccess) {
            this.showConfirmationModal = true
          } else {
            if (data.error.code === 500) {
              UtilClass.showErrorToast(data.message)
            }
          }
        } catch (error) {
          console.error('Erreur lors de la connexion :', error.message)
          UtilClass.showErrorToast('Connection Perdue')
          UtilClass.endLoadedButton(submitButton, 'Continuer')
        }
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
