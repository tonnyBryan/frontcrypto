<script setup>
import LoaderV from '../util/LoaderV.vue'
import UtilClass from '@/util/UtilClass'
import TradingView from '../util/TradingView.vue'

</script>

<template>
  <div class="container mt-4 mb-4">
    <div class="row">
      <div class="col-lg-8 col-md-6 mb-4">
        <div v-if="crypto">
          <div class="crypto-header d-flex align-items-center mb-3">
            <img :src="getLogoUrl(crypto.crypto.unit_nom)" alt="logo" class="crypto-logo me-3" />
            <h2 class="mb-0 bold">{{ crypto.crypto.nom }} ({{ crypto.crypto.unit_nom }})</h2>
          </div>
          <div class="crypto-details">
            <p class="mb-2" style="font-size: larger">
              1 <span class="bold">{{ crypto.crypto.nom }}</span> equals to
              <strong class="bold" style="margin-right: 5px"
                >{{ formatCurrency(crypto.valeur) }}
              </strong>
              <span
                :class="{
                  'text-success': crypto.variation >= 0,
                  'text-danger': crypto.variation < 0,
                }"
              >
                {{ formatVariation(crypto.variation) }}
              </span>
            </p>
          </div>
          <div class="crypto-chart">
            <TradingView :idCrypto="getCryptoId()" :updatedCryptoData="socketData" :isfavories="isfav"></TradingView>
          </div>
        </div>

        <div style="display: flex; justify-content: center" v-else>
          <LoaderV></LoaderV>
        </div>
      </div>

     
      <div class="col-lg-4 col-md-6">
        <div class="card shadow-sm bg-dark text-light">
          <div class="card-body">
            <h3 class="card-title text-light">
              Buy {{ crypto ? crypto.crypto.unit_nom : 'crypto' }}
            </h3>
            <form @submit.prevent="handleBuy">
              <div class="mb-3">
                <label for="cryptoBuy" class="form-label text-light">You Buy</label>
                <div class="position-relative">
                  <input
                    type="number"
                    id="cryptoBuy"
                    v-model.number="buyAmount"
                    @input="updateSpend"
                    class="form-control bg-transparent text-light border-0 ps-3"
                    placeholder="Enter quantity"
                  />
                  <img
                    v-if="crypto"
                    :src="getLogoUrl(crypto.crypto.unit_nom)"
                    alt="Logo"
                    style="
                      position: absolute;
                      right: 18px;
                      top: 50%;
                      transform: translateY(-50%);
                      height: 20px;
                    "
                  />
                </div>
              </div>

              <div class="mb-3">
                <label for="cryptoSpend" class="form-label text-light">You Spend</label>
                <input
                  type="text"
                  id="cryptoSpend"
                  :value="formattedSpendAmount"
                  class="form-control bg-secondary text-light border-0"
                  placeholder="Auto-calculated"
                  readonly
                />
              </div>
              <button style="font-weight: 700" type="submit" class="btn btn-warning w-100">
                Buy {{ crypto ? crypto.crypto.unit_nom : 'crypto' }}
              </button>
            </form>
          </div>
        </div>

        <div style="margin-top: 2rem" class="card shadow-sm bg-dark text-light">
          <div class="card-body">
            <h3 class="card-title text-light">You have</h3>
            <h1 class="mb-0" id="qtyLab">
              {{ quantite }}
              <span style="font-size: large; color: #cbcbcb" class="unit">{{
                crypto ? crypto.crypto.unit_nom : 'crypto'
              }}</span>
            </h1>
            <h4>
              <span style="color: rgb(203, 203, 203)">equals to </span
              >{{ formatCurrency(estimation) }}
            </h4>
            <button
              @click="handleSell"
              style="margin-top: 2rem; font-weight: 700"
              class="btn btn-warning w-100"
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'

export default {
  name: 'CryptoModel',
  data() {
    return {
      crypto: null,
      isfav:false,
      socket: null,
      buyAmount: '',
      spendAmount: 0,
      quantite: null,
      socketData: null,
      estimation: null,
    }
  },
  computed: {
    formattedSpendAmount() {
      return this.formatCurrency(this.spendAmount)
    },

  },
  methods: {
    updateSpend() {
      if (this.buyAmount < 0) {
        this.buyAmount = 0
      }
      if (this.crypto && this.crypto.valeur) {
        this.spendAmount = (this.buyAmount * this.crypto.valeur).toFixed(2)
      }
    },
    updateEstimation() {
      if (this.crypto && this.quantite) {
        this.estimation = this.crypto.valeur * this.quantite
      }
    },
    handleBuy() {
      if (!this.buyAmount) {
        this.buyAmount = 0
      }

      const data = {
        quantity: this.buyAmount,
        cryptoId: this.crypto.crypto.id_crypto,
      }

      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        UtilClass.SECRET_KET,
      ).toString()

      localStorage.setItem('cryptoData', encryptedData)

      this.$router.push({
        name: 'cryptoAchat',
      })
    },
    handleSell() {
      if (!this.quantite || this.quantite <= 0) {
        UtilClass.blinkText('qtyLab')
        return
      }

      this.$router.push('/app/v1/vente?id=' + this.crypto.crypto.id_crypto)
    },
    getCryptoId() {
      return this.$route.query.id
    },
    formatCurrency(value) {
      return UtilClass.formatCurrency(value)
    },
    formatAmount(amount) {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    },
    formatVariation(variation) {
      if (variation === undefined) {
        return '--'
      }
      return (
        new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(variation) + '%'
      )
    },
    formatVolume(volume) {
      return (
        new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(volume) + 'B'
      )
    },
    getLogoUrl(logo) {
      if (!logo) {
        return '/assets/crypto/default-logo.png'
      }
      return `/assets/images/logo/${logo}.png`
    },
    updateCryptoData(data) {
      const selectedCrypto = data.find(
        (crypto) => crypto.crypto.id_crypto === parseInt(this.getCryptoId()),
      )

      this.socketData = selectedCrypto

      if (selectedCrypto) {
        this.crypto = {
          ...selectedCrypto,
          volume: Math.random() * 1000000000,
          capitalisation: selectedCrypto.valeur * 1000000,
        }

        this.updateSpend()
        this.updateEstimation()
      } else {
        this.$router.push('/app/v1')
      }
    },
    connectWebSocket() {
      this.socket = new WebSocket(UtilClass.BACKEND_SOCKET_BASE_UR + '/ws/crypto')
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.updateCryptoData(data)
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
          this.updateCryptoData(data.data)
          this.getUserWallet()
        } else {
          throw new Error(data.message || 'Error retrieving user information')
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getUserWallet() {
      try {
        const response = await fetch(
          UtilClass.BACKEND_BASE_URL + '/crypto/user/wallet/' + this.getCryptoId(),
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
          this.quantite = data.data.quantite
          this.updateEstimation()
        } else {
          throw new Error(data.message || 'Error retrieving user information')
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getFavorie() {
      try {
        const response = await fetch(
          UtilClass.BACKEND_BASE_URL + '/crypto/user/favoris/' + this.getCryptoId(),
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
          this.isfav = data.data
          console.log( "tyyyy aaaa"+this.isfav );
        } else {
          throw new Error(data.message || 'Error retrieving user information')
        }
      } catch (error) {
        console.error(error)
      }
    },

  },
  async mounted() {
    window.scrollTo(0, 0)
    this.connectWebSocket()
    await this.getFavorie()
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close()
    }
  },
}
</script>

<style scoped>
.bg-dark {
  background-color: transparent !important;
  border: solid 1px #454545;
  border-radius: 10px;
}
.crypto-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.bold {
  color: #fdf8f8;
  font-weight: 700;
}

input {
  padding: 1rem;
  background: transparent !important;
  border: solid 1px #454545 !important;
  color: #fdf8f8 !important;
  font-weight: 700;
  font-size: larger;
}

input:focus {
  border-color: #ffc107; 
  outline: none;
  box-shadow: none;
}

input::placeholder {
  color: #888; 
  opacity: 1; 
}
</style>
