
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
        <img src="@/assets/App-icon.png" alt="Logo" style="width: 30px; height: 30px" />
      </div>


      <form @submit.prevent="handleLogin" novalidate>
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
         
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
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

       
        <button id="submit-btn" type="submit" class="btn btn-warning w-100 mb-3 fw-bold">
          Continue
        </button>
      </form>
    </div>

    
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
          <h3 class="mb-4">We want to make sure that it's really you</h3>
          <p class="text-muted">Please enter the PIN code sent to your e-mail.</p>
          <div class="d-flex justify-content-center mb-4">
            <input
              v-for="(digit, index) in pin"
              :key="index"
              type="text"
              maxlength="1"
              v-model="pin[index]"
              ref="pinInput"
              class="form-control text-center mx-2"
              style="
                width: 3rem;
                font-size: 2rem;
                background-color: #444;
                color: #fff;
                border: none;
                border-radius: 5px;
              "
              @input="handleInput(index, $event)"
              @keydown="handleKeyDown(index, $event)"
            />
          </div>
          <p class="text-danger mb-3" v-if="errorMessagePin">{{ errorMessagePin }}</p>
          <p class="text-muted mb-4">
            Remaining time : <strong>{{ timer }}</strong> seconds
          </p>
          <button
            id="confirmPinBtn"
            class="btn btn-warning w-100 fw-bold"
            style="font-size: 1.2rem"
            @click="confirmPin"
          >
            Confirm
          </button>
          <button @click="closePinModal" style="font-size: 1.2rem" class="btn w-100 annuler">
            Cancel
          </button>
        </div>
     </div>

 
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
        <h3 class="mb-4 text-warning">Account confirmation required</h3>
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
        <p class="text-muted">or, you can call the URL sent to your email in Postman</p>
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
        <h3 class="mb-4 text-danger">Your account has been locked !</h3>
        <p class="text-muted">
          To regain access,please request a password reset through your email address.
        </p>

       
        <button
          id="demandeBtn"
          class="btn btn-warning w-100 fw-bold"
          style="font-size: 1.2rem"
          @click="requestReset"
          :disabled="isResetRequested"
        >
          Request a password reset
        </button>
        <button
          v-if="!isResetRequested"
          @click="closeModalBlocked"
          style="font-size: 1.2rem"
          class="btn w-100 annuler"
        >
          Cancel
        </button>

        
        <div v-if="isResetRequested">
          <p class="text-muted" style="margin-bottom: 0.5rem; margin-top: 2rem">
            Please enter the reset key that we send to your email adress.
          </p>
          <p class="text-muted">or, you can call the URL sent to your email in Postman</p>
          <input
            type="text"
            v-model="resetKey"
            class="form-control mb-3"
            placeholder="Reset key"
            style="background-color: #444; color: #fff"
          />
          <p class="text-danger mt-3" v-if="resetErrorMessage">{{ resetErrorMessage }}</p>

          <button
            id="confirmResetBtn"
            class="btn btn-success w-100 fw-bold"
            style="font-size: 1.2rem; margin-top: 3rem"
            @click="confirmResetKey"
          >
            Confirm
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
    handleKeyDown(index, event) {
      
      if (event.key === "Backspace") {
        if (!this.pin[index] && index > 0) {
          event.preventDefault();
          this.$nextTick(() => {
            const inputs = this.$refs.pinInput;
            if (inputs && inputs[index - 1]) {
              this.pin[index - 1] = "";
              inputs[index - 1].focus();
            }
          });
        }
      }
    },
    handleInput(index, event) {
      const value = event.target.value;
      if (value && value.length === 1) {
        this.$nextTick(() => {
          const inputs = this.$refs.pinInput;
          if (inputs && inputs[index + 1]) {
            inputs[index + 1].focus();
          }
        });
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    async handleLogin() {
      this.errors = {}

      if (UtilClass.isAdminLogin(this.email, this.password)) {
        this.$router.push('/app/backoffice')
      }

      if (!this.email) {
        this.errors.email = 'Email adress required.'
      } else if (!UtilClass.validateEmail(this.email)) {
        this.errors.email = 'Please enter an email adress valide.'
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
          UtilClass.endLoadedButton(submitButton, 'Continue')

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
          console.error('Error during connection :', error.message)
          UtilClass.showErrorToast('Connection lost')
          UtilClass.endLoadedButton(submitButton, 'Continue')
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
        this.errorMessagePin = 'Please enter the full PIN code.'
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
        UtilClass.endLoadedButton(confirmPinButton, 'Confirm')

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
        UtilClass.endLoadedButton(confirmPinButton, 'Confirm')
        this.errorMessagePin = error.message
      }
    },

    async confirmAccount() {
      if (!this.confirmationKey) {
        this.errorMessageKey = 'Please enter the confirmation key.'
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
        UtilClass.endLoadedButton(demandeBtn, 'Request a password reset')

        if (data.isSuccess) {
          this.isResetRequested = true
        } else {
          throw new Error(data.message || 'Reset request failed')
        }
      } catch (error) {
        UtilClass.endLoadedButton(demandeBtn, 'Request a password reset')
        UtilClass.showErrorToast(error.message)
      }
    },

    async confirmResetKey() {
      if (!this.resetKey) {
        this.resetErrorMessage = 'Please enter reset key.'
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
        UtilClass.endLoadedButton(confirmResetButton, 'Confirm')

        if (data.isSuccess) {
          UtilClass.showSuccessToast('Your account is now clean.')
          this.closeModalBlocked()
        } else {
          throw new Error(data.message || 'Reset key invalid.')
        }
      } catch (error) {
        UtilClass.endLoadedButton(confirmResetButton, 'Confirm')
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
  color: #aaaaaa; 
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
