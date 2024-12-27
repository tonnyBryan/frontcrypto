<script setup>
import LoaderV from './LoaderV.vue'
</script>

<template>
  <div class="table-container">
    <div v-if="cryptos.length === 0 || !isConnected" class="loading-overlay">
      <LoaderV></LoaderV>
    </div>

    <table class="table table-dark tba">
      <thead>
        <tr>
          <th scope="col">Nom</th>
          <th scope="col">Prix</th>
          <th scope="col">Variation</th>
          <th scope="col">Volume 24h</th>
          <th scope="col">Capitalisation</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="crypto in cryptos"
          :key="crypto.crypto.id_crypto"
          style="border-style: unset !important"
          @click="goToCryptoDetails(crypto.crypto.id_crypto)"
        >
          <td>
            <img :src="getLogoUrl(crypto.crypto.logo)" alt="logo" class="crypto-logo" />
            <span class="unit">{{ crypto.crypto.unit_nom }}</span> {{ crypto.crypto.nom }}
          </td>
          <td class="unit">{{ formatCurrency(crypto.valeur) }}</td>
          <td>
            <span
              :class="{
                'text-success': crypto.variation >= 0,
                'text-danger': crypto.variation < 0,
              }"
            >
              {{ formatVariation(crypto.variation) }}
            </span>
          </td>
          <td>{{ formatVolume(crypto.volume) }}</td>
          <td class="unit">{{ formatCurrency(crypto.capitalisation) }}</td>
          <td>
            <button
              class="btn btn-sm btn-secondary icon-button"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Voir les détails"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              class="btn btn-sm btn-secondary icon-button"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Ajouter aux favoris"
            >
              <i class="fas fa-heart"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CryptoTable',
  data() {
    return {
      cryptos: [],
      isConnected: false,
      reconnectInterval: null,
    }
  },
  methods: {
    updateData(data) {
      this.cryptos = data.map((item) => ({
        ...item,
        variation: Math.random() * 10 - 5,
        volume: Math.random() * 1000000000,
        capitalisation: item.valeur * 1000000,
      }))
    },
    initializeWebSocket() {
      const socket = new WebSocket('ws://localhost:8080/ws/crypto')

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.updateData(data)
      }

      socket.onopen = () => {
        console.log('WebSocket connecté')
        this.isConnected = true
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval)
          this.reconnectInterval = null
        }
      }

      socket.onclose = () => {
        console.log('WebSocket déconnecté')
        this.isConnected = false
        this.cryptos = []
        this.reconnectWebSocket()
      }

      this.socket = socket
    },
    reconnectWebSocket() {
      if (!this.reconnectInterval) {
        this.reconnectInterval = setInterval(() => {
          console.log('Tentative de reconnexion WebSocket...')
          this.initializeWebSocket()
        }, 5000)
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
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
    goToCryptoDetails(idCrypto) {
      this.$router.push('/app/accueil/crypto?id=' + idCrypto)
    },
  },
  mounted() {
    this.initializeWebSocket()
  },
  unmounted() {
    if (this.socket) {
      this.socket.close()
    }
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval)
    }
  },
}
</script>

<style scoped>
.table {
  margin: 20px auto;
  width: 90%;
}

.table-dark {
  --bs-table-bg: transparent !important;
  --bs-table-color: inherit !important;
}

.table th,
.table td {
  padding: 10px;
}

.table tbody tr {
  height: initial;
}

.crypto-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

button {
  margin: 0 5px;
  padding: 0;
  border: none;
  background: transparent;
}

button i {
  font-size: 15px;
  color: inherit;
}

button.icon-button:hover {
  background: transparent;
}

.unit {
  font-weight: 600;
  color: #fdf8f8;
}

.tooltip-inner {
  background-color: #333 !important;
  color: #fff !important;
  border-radius: 10px;
  padding: 10px;
  font-size: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.tooltip-arrow {
  border-top-color: #333 !important;
}

.tooltip.bs-tooltip-top .tooltip-arrow {
  border-top-color: #333 !important;
}

.tooltip.bs-tooltip-top {
  animation: fadeInUp 0.3s ease-out;
}

.table tbody tr {
  transition: background 0.3s ease;
}

.table tbody tr:hover {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.table-container {
  position: relative;
}

.loading-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>
