<template>
  <div class="row justify-content-center" style="margin: 0; margin-top: 2rem">
    <div class="col-12 col-md-4">
      <div class="card bg-dark text-light cd" style="padding: 1rem; border: solid 1px #4b4b4b">
        <div class="card-body">
          <h3 class="card-title" style="margin-bottom: 25px; color: #dadada">Buy Crypto</h3>

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
                        :src="'/assets/crypto/' + option.logo"
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
                        :src="'/assets/crypto/' + option.logo"
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
                      min="1"
                      required
                      name="qtty"
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
              <div class="mb-3 dip">
                <label for="spend" class="form-label">Spend</label>
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
                type="submit"
                class="btn btn-warning w-100"
                style="margin-top: 3rem; font-size: larger; font-weight: 700"
                :disabled="!cryptoOptions || quantity === 0 || !quantity"
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
</template>

<script>
import axios from 'axios'
import UtilClass from '@/util/UtilClass'
import CryptoJS from 'crypto-js'
import VueSelect from 'vue3-select-component'
import { ref } from 'vue'
import LoaderV from '../util/LoaderV.vue'

export default {
  components: {
    VueSelect,
    LoaderV,
  },
  computed: {
    formattedSpendAmount() {
      return this.formatCurrency(this.estimation)
    },
    formattedPriceOne() {
      return this.formatCurrency(this.priceOne)
    },
  },
  data() {
    return {
      decryptedData: null,

      step: 1,
      selectedCrypto: ref(null),
      quantity: 0,
      confirmationKey: '',
      cryptoOptions: null,

      estimation: 0,
      cryptoList: null,

      priceOne: 0,
    }
  },
  async mounted() {
    await this.fetchCryptoOptions()
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
        console.warn('Aucune donnée trouvée dans le localStorage.')
      }
    } catch (error) {
      console.error('Erreur lors du décryptage ou de la récupération des données :', error)
    }
  },
  beforeUnmount() {
    localStorage.removeItem('cryptoData')
    if (this.socket) {
      this.socket.close()
    }
  },
  methods: {
    updateSpend() {
      this.estimation = this.priceOne * this.quantity
    },
    handleChange(id_crypto) {
      const id = id_crypto
      console.log(this.selectedCrypto)
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
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)

      return formatted.replace('$', '$ ')
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
          logo: crypto.logo,
          unit: crypto.unit_nom,
        }))
      } catch (error) {
        console.error('Erreur lors de la récupération des cryptos:', error)
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
    nextStep() {},
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

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
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

  .cd {
    border: none !important;
    padding: 0 !important;
  }
}

input:focus {
  outline: none;
  box-shadow: none;
  border: none !important;
}
</style>
