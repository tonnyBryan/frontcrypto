<script setup>
import LoaderV from '../util/LoaderV.vue'
import ChartView from '../util/ChartView.vue'
import UtilClass from '@/util/UtilClass'
</script>

<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-lg-8 col-md-6 mb-4">
        <div v-if="crypto">
          <div class="crypto-header d-flex align-items-center mb-3">
            <img :src="getLogoUrl(crypto.crypto.logo)" alt="logo" class="crypto-logo me-3" />
            <h2 class="mb-0 bold">{{ crypto.crypto.nom }} ({{ crypto.crypto.unit_nom }})</h2>
          </div>
          <div class="crypto-details">
            <p class="mb-2" style="font-size: larger">
              1 <span class="bold">{{ crypto.crypto.nom }}</span> est égal à
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
          <!-- Graphique (vide pour l'instant) -->
          <div class="crypto-chart">
            <ChartView :data="chartData" />
          </div>
        </div>

        <div style="display: flex; justify-content: center" v-else>
          <LoaderV></LoaderV>
        </div>
      </div>

      <!-- Section droite : formulaire d'achat -->
      <div class="col-lg-4 col-md-6">
        <div class="card shadow-sm bg-dark text-light">
          <div class="card-body">
            <h3 class="card-title text-light">
              Buy {{ crypto ? crypto.crypto.unit_nom : 'crypto' }}
            </h3>
            <form @submit.prevent="handleBuy">
              <div class="mb-3">
                <label for="cryptoBuy" class="form-label text-light"> You Buy </label>
                <input
                  type="number"
                  id="cryptoBuy"
                  v-model.number="buyAmount"
                  @input="updateSpend"
                  class="form-control bg-secondary text-light border-0"
                  placeholder="Enter amount"
                />
              </div>
              <div class="mb-3">
                <label for="cryptoSpend" class="form-label text-light">You Spend (USD)</label>
                <input
                  type="number"
                  id="cryptoSpend"
                  v-model.number="spendAmount"
                  class="form-control bg-secondary text-light border-0"
                  placeholder="Auto-calculated"
                  readonly
                />
              </div>
              <button type="submit" class="btn btn-warning w-100">
                Buy {{ crypto ? crypto.crypto.unit_nom : 'crypto' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CryptoModel',
  data() {
    return {
      crypto: null,
      socket: null,
      buyAmount: 0,
      spendAmount: 0,
      chartData: [],
    }
  },
  methods: {
    updateSpend() {
      if (this.crypto && this.crypto.valeur) {
        this.spendAmount = (this.buyAmount * this.crypto.valeur).toFixed(2)
      }
    },
    handleBuy() {
      alert(`You are buying ${this.buyAmount} ${this.crypto.unit_nom} for $${this.spendAmount}`)
    },
    getCryptoId() {
      return this.$route.query.id
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
    formatVariation(variation) {
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
      return `/assets/crypto/${logo}`
    },
    updateCryptoData(data) {
      const selectedCrypto = data.find(
        (crypto) => crypto.crypto.id_crypto === parseInt(this.getCryptoId()),
      )

      if (selectedCrypto) {
        this.crypto = {
          ...selectedCrypto,
          variation: Math.random() * 10 - 5,
          volume: Math.random() * 1000000000,
          capitalisation: selectedCrypto.valeur * 1000000,
        }

        this.chartData.push({
          x: selectedCrypto.date_changement, // Ajout de la date pour l'axe X
          y: selectedCrypto.valeur, // Valeur pour l'axe Y
        })

        if (this.chartData.length > 10) {
          this.chartData.shift() // Garder uniquement les 10 dernières valeurs
        }
      } else {
        this.$router.push('/app/accueil')
      }
    },
    connectWebSocket() {
      this.socket = new WebSocket(UtilClass.BACKEND_SOCKET_BASE_UR + '/ws/crypto')
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.updateCryptoData(data)
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

        if (data.success) {
          this.updateCryptoData(data.data)
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
  mounted() {
    this.connectWebSocket()
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
  border-color: #ffc107; /* Bordure bleu clair au focus */
  outline: none; /* Enlever le contour par défaut */
  box-shadow: none; /* Enlever le contour bleu spécifique à Bootstrap */
}

input::placeholder {
  color: #888; /* Couleur de la placeholder */
  opacity: 1; /* Assure que la couleur est visible (valeur par défaut : 0.5) */
}
</style>
