<template>
  <div class="row justify-content-center" style="margin: 0; margin-top: 2rem">
    <div class="col-12 col-md-7 col-lg-5">
      <div class="card bg-dark text-light cd1" style="padding: 1rem; border: solid 1px #4b4b4b">
        <div class="card-body">
          <div>
            <h3 class="card-title" style="margin-bottom: 25px; color: #dadada">Sell Crypto</h3>
            <h3
              v-if="crypto"
              class="card-title"
              style="margin-bottom: 25px; color: #dadada; display: flex"
            >
              <img
                :src="'/assets/crypto/' + crypto.logo"
                alt="logo"
                class="crypto-logo"
                width="32"
              />&nbsp;:&nbsp;
              <span v-if="userWallet" style="color: #fff; font-weight: 700"
                >{{ userWallet }}&nbsp;{{ crypto.unit_nom }}</span
              >
            </h3>
            <div v-else style="margin-bottom: 2rem">
              <LoaderV style="height: 20px !important; position: relative; right: 3rem"></LoaderV>
            </div>
          </div>

          <div v-if="step === 1">
            <form @submit.prevent="nextStep">
              <div class="mb-3 dip" id="dipQty">
                <div class="row">
                  <div class="col-4">
                    <label for="quantity" class="form-label">Spend</label>
                    <input
                      type="number"
                      class="form-control"
                      id="quantity"
                      v-model="quantity"
                      min="0.01"
                      step="0.01"
                      required
                      name="qtty"
                      autocomplete="off"
                      @input="updateSpend"
                    />
                  </div>
                  <div class="col-8" style="text-align: end !important">
                    <label for="quantity" class="form-label">Price 1</label>
                    <input
                      type="text"
                      class="form-control"
                      id="quantity"
                      :value="formattedPriceOne"
                      min="1"
                      readonly
                      name="qtty"
                      style="text-align: end !important"
                    />
                  </div>
                </div>
              </div>
              <div class="mb-3 dip" id="div_dip">
                <label for="spend" class="form-label">Earn</label>
                <input
                  type="text"
                  class="form-control"
                  id="spend"
                  :value="formattedSpendAmount"
                  min="1"
                  readonly
                  name="qtty"
                />
              </div>
              <button
                id="sellBtn"
                type="submit"
                class="btn btn-warning w-100"
                style="margin-top: 3rem; font-size: larger; font-weight: 700"
                :disabled="!canSell"
              >
                Sell (need email validation)
              </button>
              <h6 style="font-size: small; color: #ababab; margin-top: 15px">
                Warning: The price of a cryptocurrency can fluctuate over time
              </h6>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal pour la confirmation du compte -->
  <div
    class="modal d-flex justify-content-center align-items-center"
    v-if="showConfirmationModal"
    style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1050"
  >
    <div
      class="card fade-in p-5 text-center shadow-lg cd"
      style="width: 35rem; background-color: #1e2329 !important; border-radius: 15px; color: #fff"
    >
      <h5 class="mb-4 email" style="text-align: left; font-size: x-large">Confirmation Requise</h5>

      <p style="margin-top: 4rem; text-align: left">
        A code has been sent to your email address. Please check your inbox and enter the code to
        proceed.
      </p>
      <input
        type="text"
        v-model="confirmationKey"
        class="form-control mb-3 text-center inp2"
        style="background-color: #444; color: #fff; border: none; border-radius: 5px"
        placeholder="Entrez la clé de confirmation"
      />
      <div v-if="errorMessageKey" class="alert alert-danger" role="alert">
        {{ errorMessageKey }}
      </div>
      <button
        id="confirmAccBtn"
        class="btn btn-warning w-100 fw-bold"
        style="font-size: 1.2rem; margin-top: 3rem"
        @click="confirmAccount"
      >
        Validate
      </button>
      <button @click="closeModalAcc" style="font-size: 1.2rem" class="btn w-100 annuler">
        Cancel
      </button>
    </div>
  </div>

  <!-- Modal -->
  <div
    class="modal fade"
    id="thankYouModal"
    tabindex="-1"
    aria-labelledby="thankYouModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="thankYouModalLabel">Thank You! 🦄</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          Thank you for your cryptocurrency sale! 😍 Your transaction has been successfully
          processed. We appreciate your trust in our platform.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UtilClass from '@/util/UtilClass'
import LoaderV from '../util/LoaderV.vue'
import * as bootstrap from 'bootstrap'

export default {
  components: {
    LoaderV,
  },
  computed: {
    formattedSpendAmount() {
      return this.formatCurrency(this.estimation)
    },
    formattedPriceOne() {
      return this.formatCurrency(this.priceOne)
    },
    canSell() {
      return (
        this.quantity !== 0 &&
        this.quantity &&
        this.selectedCrypto &&
        this.userWallet &&
        this.userWallet >= this.quantity
      )
    },
  },
  data() {
    return {
      step: 1,
      quantity: 0,

      estimation: 0,
      cryptoList: null,

      priceOne: 0,

      showConfirmationModal: false,
      confirmationKey: '',
      errorMessageKey: '',

      userWallet: null,

      selectedCrypto: null,

      crypto: null,
    }
  },
  async mounted() {
    window.scrollTo(0, 0)
    this.selectedCrypto = this.getCryptoId()
    this.getUserWallet()
    await this.connectWebSocket()
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close()
    }
  },
  methods: {
    getCryptoId() {
      return this.$route.query.id
    },
    updateSpend() {
      const div = document.getElementById('dipQty')

      if (this.userWallet && this.quantity > this.userWallet) {
        div.style.borderColor = '#922121'
      } else {
        div.style.borderColor = '#686868'
      }

      this.estimation = this.priceOne * this.quantity
    },
    updatePriceOne() {
      if (this.cryptoList && this.selectedCrypto) {
        const finded = this.cryptoList.find(
          (crypto) => crypto.crypto.id_crypto === parseInt(this.selectedCrypto),
        )
        this.priceOne = finded.valeur
        this.updateSpend()
      }
    },
    formatCurrency(value) {
      return UtilClass.formatCurrency(value)
    },
    connectWebSocket() {
      this.socket = new WebSocket(UtilClass.BACKEND_SOCKET_BASE_UR + '/ws/crypto')
      this.socket.onmessage = (event) => {
        this.cryptoList = JSON.parse(event.data)
        this.updatePriceOne()
      }
      this.socket.onopen = () => {
        console.log('WebSocket connecté')
        this.getLastCour()
      }
      this.socket.onclose = () => {
        console.log('WebSocket déconnecté')
      }
    },
    async getLastCour() {
      try {
        const response = await fetch(UtilClass.BACKEND_BASE_URL + '/crypto/cour', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + UtilClass.getLocalToken(),
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (!response.ok) {
          if (UtilClass.isInvalidTokenError(data)) {
            UtilClass.removeLocalToken()
            this.$router.push('/app/login')
          }
        }

        if (data.success) {
          this.cryptoList = data.data
          const finded = this.cryptoList.find(
            (crypto) => crypto.crypto.id_crypto === parseInt(this.selectedCrypto),
          )

          if (finded) {
            this.crypto = finded.crypto
          }
          this.updatePriceOne()
        } else {
          throw new Error(
            data.message || 'Erreur lors de la récupération des informations utilisateur.',
          )
        }
      } catch (error) {
        console.error(error)
      }
    },
    async nextStep() {
      const trButton = document.getElementById('sellBtn')
      UtilClass.loadButton(trButton)

      try {
        const response = await fetch(UtilClass.BACKEND_BASE_URL + '/crypto/user/vdrequest', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + UtilClass.getLocalToken(),
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (!response.ok) {
          if (UtilClass.isInvalidTokenError(data)) {
            UtilClass.removeLocalToken()
            this.$router.push('/app/login')
            return
          }
          throw new Error("Une erreur est survenue lors de l'appel à l'API.")
        }

        UtilClass.endLoadedButton(trButton, 'Sell (need email validation)')

        if (!data.success) {
          UtilClass.showErrorToast(data.message || 'Erreur inconnue')
          return
        }
        this.showConfirmationModal = true
      } catch (error) {
        UtilClass.endLoadedButton(trButton, 'Sell (need email validation)')
        UtilClass.showErrorToast("Une erreur s'est produite. Veuillez réessayer plus tard.")
        console.error(error)
      }
    },
    closeModalAcc() {
      this.confirmationKey = ''
      this.errorMessageKey = ''
      this.showConfirmationModal = false
    },
    clearForm() {
      this.quantity = 0
    },
    async confirmAccount() {
      if (!this.confirmationKey) {
        this.errorMessageKey = 'Veuillez entrer une clé de confirmation.'
        return
      }

      const confirmAccButton = document.getElementById('confirmAccBtn')
      UtilClass.loadButton(confirmAccButton)
      try {
        const response = await fetch(UtilClass.BACKEND_BASE_URL + '/crypto/user/sell', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + UtilClass.getLocalToken(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idCrypto: this.selectedCrypto,
            quantity: this.quantity,
            key: this.confirmationKey,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          if (UtilClass.isInvalidTokenError(data)) {
            UtilClass.removeLocalToken()
            this.$router.push('/app/login')
          }
        }

        UtilClass.endLoadedButton(confirmAccButton, 'Validate')

        if (data.success) {
          await this.getUserWallet()
          this.closeModalAcc()
          this.clearForm()

          // const finded = this.cryptoList.find(
          //   (crypto) => crypto.crypto.id_crypto === parseInt(this.selectedCrypto),
          // )
          // const message = `
          //   <div style="display: flex; align-items: center;">
          //     <img src="/assets/crypto/${finded.crypto.logo}" alt="Logo" style="width: 30px; height: 30px; margin-right: 10px;">
          //     <span>- ${this.quantity}</span>
          //   </div>
          // `
          // this.clearForm()
          // UtilClass.showSuccessToastDelay(message, 100000)

          const thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'))
          thankYouModal.show()
        } else {
          throw new Error(data.message || 'Clé de confirmation invalide.')
        }
      } catch (error) {
        UtilClass.endLoadedButton(confirmAccButton, 'Validate')
        this.errorMessageKey = error.message
      }
    },
    async getUserWallet() {
      try {
        const response = await fetch(
          UtilClass.BACKEND_BASE_URL + '/crypto/user/wallet/' + this.selectedCrypto,
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + UtilClass.getLocalToken(),
              'Content-Type': 'application/json',
            },
          },
        )

        const data = await response.json()

        if (!response.ok) {
          if (UtilClass.isInvalidTokenError(data)) {
            UtilClass.removeLocalToken()
            this.$router.push('/app/login')
          }
        }

        if (data.success) {
          this.userWallet = data.data.quantite
        } else {
          throw new Error(
            data.message || 'Erreur lors de la récupération des informations utilisateur.',
          )
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style scoped>
.card {
  background-color: transparent !important;
  border-radius: 10px;
}

.card-body {
  color: #fff;
}

.card-title,
h4,
h5 {
  color: #fff;
}

.form-label,
.form-control {
  color: #fff;
}

.form-control {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

input[type='number'] {
  color: #fff;
}

.dip {
  padding: 1rem;
  border: solid 1px #686868;
  border-radius: 10px;
  padding-left: 26px;
  padding-right: 26px;
}

.loading {
  border: solid 1px #686868 !important;
  border-radius: 10px;
}
.dip input {
  background-color: transparent;
  padding: 0;
  border: none;
  font-size: larger;
  font-weight: 700;
}

.inp2::placeholder {
  color: #888;
  opacity: 1;
}

.dip:focus-within {
  border-color: #ffc107;
}

.img-responsive {
  width: 40px;
  height: 40px;
}

@media (max-width: 576px) {
  .img-responsive {
    width: 30px !important;
    height: 30px !important;
  }

  .crypto-text {
    font-size: 1rem !important;
  }

  .cd1 {
    border: none !important;
    padding: 0 !important;
  }
}

input:focus {
  outline: none;
  box-shadow: none;
  border: none !important;
}

.alert-danger {
  --bs-alert-bg: #2c0b0e !important;
  --bs-alert-color: #ea868f !important;
  --bs-alert-border-color: #842029 !important;
}

.modal-content {
  background-color: #181a20;
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-bottom: 1px solid #444;
}

.modal-footer {
  border-top: 1px solid #444;
}
</style>
