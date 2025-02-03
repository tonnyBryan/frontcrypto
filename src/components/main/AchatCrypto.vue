<template>
  <div class="row justify-content-center" style="margin: 0; margin-top: 2rem">
    <div class="col-12 col-md-7 col-lg-5">
      <div class="card bg-dark text-light cd1" style="padding: 1rem; border: solid 1px #4b4b4b">
        <div class="card-body">
          <div>
            <h3 class="card-title" style="margin-bottom: 25px; color: rgb(253, 248, 248); font-weight: 700">Buy Crypto</h3>
            <h3 class="card-title" style="margin-bottom: 25px; color: #dadada">
              <i class="bi bi-credit-card"></i> :
              <span v-if="user" style="color: #fff; font-weight: 700">{{
                formatCurrency(user.monnaie)
              }}</span>
            </h3>
          </div>

          <div v-if="step === 1">
            <form @submit.prevent="nextStep">
              <div class="mb-3">
                <VueSelect
                  v-if="cryptoOptions"
                  v-model="selectedCrypto"
                  :options="cryptoOptions"
                  label="label"
                  item-value="value"
                  item-text="label"
                  :clearable="false"
                  placeholder="Choose crypto"
                  @option-selected="(option) => handleChange(option.value)"
                >
                  <template #value="{ option }">
                    <div class="custom-value d-flex align-items-center">
                      <img
                        :src="'/assets/images/logo/' + option.unit + '.png'"
                        alt="crypto logo"
                        class="me-2 img-responsive"
                      />
                      <h5 style="margin: 0" class="crypto-text">
                        {{ option.unit }} <span style="color: #b2b2b2">{{ option.label }}</span>
                      </h5>
                    </div>
                  </template>

                  <template #option="{ option }">
                    <div class="d-flex align-items-center">
                      <img
                        :src="'/assets/images/logo/' + option.unit + '.png'"
                        alt="crypto logo"
                        width="24"
                        height="24"
                        class="me-2"
                      />
                      <span>{{ option.label }}</span>
                    </div>
                  </template>
                </VueSelect>
                <div v-else class="loading">
                  <LoaderV style="position: relative; top: -35px; left: -28px"></LoaderV>
                </div>
              </div>
              <div class="mb-3 dip">
                <div class="row">
                  <div class="col-4">
                    <label for="quantity" class="form-label">Receive</label>
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
                <label for="spend" class="form-label">Spend <span style="color: #a6a6a6">(with {{ commission_achat }}% commission)</span></label>
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
                id="buyBtn"
                type="submit"
                class="btn btn-warning w-100"
                style="margin-top: 3rem; font-size: larger; font-weight: 700"
                :disabled="!canBuy"
              >
                Buy (need email validation)
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
        placeholder="Enter confirmation key"
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
          Congratulations on your crypto purchase! 🎉 We truly appreciate your trust, and we're
          excited to accompany you on your crypto journey.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import UtilClass from '@/util/UtilClass'
import CryptoJS from 'crypto-js'
import VueSelect from 'vue3-select-component'
import { ref } from 'vue'
import LoaderV from '../util/LoaderV.vue'
import * as bootstrap from 'bootstrap'

export default {
  components: {
    VueSelect,
    LoaderV,
  },
  computed: {
    formattedSpendAmount() {
      return this.formatCurrency(this.getSpendAmountWithCommission())
    },
    formattedPriceOne() {
      return this.formatCurrency(this.priceOne)
    },
    canBuy() {
      return (
        this.cryptoOptions &&
        this.quantity !== 0 &&
        this.quantity &&
        this.selectedCrypto &&
        this.user &&
        this.estimation <= this.user.monnaie
      )
    },
  },
  data() {
    return {
      decryptedData: null,

      step: 1,
      selectedCrypto: ref(null),
      quantity: 0,
      cryptoOptions: null,

      estimation: 0,
      cryptoList: null,

      priceOne: 0,

      showConfirmationModal: false,
      confirmationKey: '',
      errorMessageKey: '',

      user: null,

      commission_achat: null
    }
  },

  async mounted() {
    window.scrollTo(0, 0)
    this.getUser()
    await this.fetchCryptoOptions()
    await this.fetchCommissions()
    await this.connectWebSocket()

    try {
      const encryptedData = localStorage.getItem('cryptoData')
      if (encryptedData) {
        const bytes = CryptoJS.AES.decrypt(encryptedData, UtilClass.SECRET_KET)
        this.decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

        this.selectedCrypto = this.decryptedData.cryptoId
        this.quantity = this.decryptedData.quantity
        this.updatePriceOne()
      } else {
        console.warn('No data found in the localStorage.')
      }
    } catch (error) {
      console.error('Error while decrypting or recovering data :', error)
    }
  },
  beforeUnmount() {
    localStorage.removeItem('cryptoData')
    if (this.socket) {
      this.socket.close()
    }
  },
  methods: {
    getSpendAmountWithCommission() {
      if (this.commission_achat === 0) {
        return this.estimation
      }
      else if (this.commission_achat && this.estimation) {
        const co = this.estimation * (this.commission_achat / 100);
        return this.estimation + co;
      }

      return 0;
    },
    async fetchCommissions() {
      try {
        const response = await fetch(UtilClass.BACKEND_BASE_URL + "/crypto/commission");
        const result = await response.json();

        if (result.success && result.data) {
          this.commission_achat = result.data.commission_achat;
        } else {
          console.error("Erreur dans les données reçues :", result.message);
        }
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    },
    updateSpend() {
      this.estimation = this.priceOne * this.quantity

      const div = document.getElementById('div_dip')
      if (this.estimation > this.user.monnaie) {
        div.style.borderColor = '#922121'
      } else {
        div.style.borderColor = '#686868'
      }
    },
    handleChange(id_crypto) {
      const id = id_crypto
      if (this.cryptoList) {
        const finded = this.cryptoList.find((crypto) => crypto.crypto.id_crypto === parseInt(id))
        this.priceOne = finded.valeur
        this.updateSpend()
      }
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
    async fetchCryptoOptions() {
      try {
        const token = UtilClass.getLocalToken()
        const response = await axios.get(UtilClass.BACKEND_BASE_URL + '/crypto', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.cryptoOptions = response.data.data.map((crypto) => ({
          value: crypto.id_crypto,
          label: crypto.nom,
          unit: crypto.unit_nom,
        }))
      } catch (error) {
        console.error('Error recovering crypto:', error)
      }
    },

    connectWebSocket() {
      this.socket = new WebSocket(UtilClass.BACKEND_SOCKET_BASE_UR + '/ws/crypto')
      this.socket.onmessage = (event) => {
        this.cryptoList = JSON.parse(event.data)
        this.updatePriceOne()
        this.updateSpend()
      }
      this.socket.onopen = () => {
        console.log('WebSocket connected')
        this.getLastCour()
      }
      this.socket.onclose = () => {
        console.log('WebSocket disconnected')
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
          this.updatePriceOne()
        } else {
          throw new Error(data.message || 'Error retrieving user information')
        }
      } catch (error) {
        console.error(error)
      }
    },
    async nextStep() {
      if (!this.canBuy) {
        return
      }

      if (this.estimation > this.user.monnaie) {
        return
      }

      const trButton = document.getElementById('buyBtn')
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
          throw new Error('An error occurred while calling the API.')
        }

        UtilClass.endLoadedButton(trButton, 'Buy (need email validation)')

        if (!data.success) {
          UtilClass.showErrorToast(data.message || 'Unknown error')
          return
        }
        this.showConfirmationModal = true
      } catch (error) {
        UtilClass.endLoadedButton(trButton, 'Buy (need email validation)')
        UtilClass.showErrorToast('An error occurred ! Please try again later')
        console.error(error)
      }
    },
    closeModalAcc() {
      this.confirmationKey = ''
      this.errorMessageKey = ''
      this.showConfirmationModal = false
    },
    clearForm() {
      this.selectedCrypto = null
      this.priceOne = 0
      this.quantity = 0
    },
    async confirmAccount() {
      if (!this.confirmationKey) {
        this.errorMessageKey = 'Please enter a confirmation key'
        return
      }

      const confirmAccButton = document.getElementById('confirmAccBtn')
      UtilClass.loadButton(confirmAccButton)
      try {
        const response = await fetch(UtilClass.BACKEND_BASE_URL + '/crypto/user/buy', {
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
          await this.getUser()
          this.closeModalAcc()
          this.clearForm()

          // const finded = this.cryptoList.find(
          //   (crypto) => crypto.crypto.id_crypto === parseInt(this.selectedCrypto),
          // )
          // const message = `
          //   <div style="display: flex; align-items: center;">
          //     <img src="/assets/crypto/${finded.crypto.logo}" alt="Logo" style="width: 30px; height: 30px; margin-right: 10px;">
          //     <span>+ ${this.quantity}</span>
          //   </div>
          // `

          // this.clearForm()
          // UtilClass.showSuccessToastDelay(message, 100000)

          const thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'))
          thankYouModal.show()
        } else {
          throw new Error(data.message || 'Invalid confirmation key.')
        }
      } catch (error) {
        UtilClass.endLoadedButton(confirmAccButton, 'Validate')
        this.errorMessageKey = error.message
      }
    },
    async getUser() {
      try {
        const response = await fetch(UtilClass.BACKEND_BASE_URL + '/crypto/user/sm', {
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
          this.user = data.data
        } else {
          throw new Error(data.message || 'Error retrieving user information')
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style scoped>
.v-select .vs__dropdown-toggle {
  display: flex;
  align-items: center;
}

.v-select .vs__dropdown-option img {
  margin-right: 8px;
}

:deep(.vue-select .custom-value) {
  display: flex;
  align-items: center;
  gap: 6px;
}

:deep(.vue-select .custom-option) {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #171717;
  font-weight: 500;
  font-size: 16px;
}

:deep(.vue-select .custom-option small) {
  color: #525252;
  font-weight: 500;
  font-size: 14px;
}

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

:deep(.single-value) {
  color: #fff !important;
  flex-direction: column;
}

:deep(.control) {
  border-radius: 10px !important;
  border: solid 1px #686868 !important;
  height: 6rem;
}

:deep(.search-input) {
  color: #fff !important;
  position: absolute !important;
  width: 100% !important;
}

:deep(.no-results) {
  color: #fff !important;
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
