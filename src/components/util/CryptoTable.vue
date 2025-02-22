<script setup>
import LoaderV from './LoaderV.vue'

</script>

<template>
  <div class="row" style="width: 90%; margin: auto; margin-top: 2rem; margin-bottom: 1rem !important;">
    <h2 style="color: #fdf8f8; font-weight: 700;"><i class="bi bi-clipboard-data-fill"></i> Real-time price table</h2>
  </div>
  <div v-if="cryptos.length === 0" class="loading-overlay">
    <LoaderV></LoaderV>
  </div>
  <div class="table-container" style="min-height: 70vh">
    <div class="table-responsive">
      <table class="table table-dark tba">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col" class="d-none d-sm-table-cell">Change</th>
            <th scope="col" class="d-none d-sm-table-cell">24H volume</th>
            <th scope="col" class="d-none d-sm-table-cell">Market Cap</th>
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
              <img :src="getLogoUrl(crypto.crypto.unit_nom)" alt="logo" class="crypto-logo" />
              <span class="unit">{{ crypto.crypto.unit_nom }}</span> {{ crypto.crypto.nom }}
            </td>
            <td class="unit">{{ formatCurrency(crypto.valeur) }}</td>
            <td class="d-none d-sm-table-cell">
              <span
                :class="{
                  'text-success': crypto.variation >= 0,
                  'text-danger': crypto.variation < 0,
                }"
              >
                {{ formatVariation(crypto.variation) }}
              </span>
            </td>
            <td class="d-none d-sm-table-cell">{{ formatVolume(crypto.volume) }}</td>
            <td class="d-none d-sm-table-cell unit">{{ formatCurrency(crypto.capitalisation) }}</td>
            <td>
              <button
                class="btn btn-sm btn-secondary icon-button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="View details"
              >
                <i class="bi bi-graph-up-arrow"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import UtilClass from '@/util/UtilClass.js'

export default {
  name: 'CryptoTable',
  data() {
    return {
      cryptos: [],
    }
  },
  methods: {
    updateData(data) {
      this.cryptos = data.map((item) => ({
        ...item,
        volume: Math.random() * 1000000000,
        capitalisation: item.valeur * 1000000,
      }))
    },
    initializeWebSocket() {
      const socket = new WebSocket(UtilClass.BACKEND_SOCKET_BASE_UR + '/ws/crypto')

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.updateData(data)
      }

      socket.onopen = () => {
      
        this.getLastCour()
      }

      socket.onclose = () => {
        
        this.cryptos = []
      }

      this.socket = socket
    },
    formatCurrency(value) {
      return UtilClass.formatCurrency(value)
    },
    formatVariation(variation) {
      if (variation === undefined) {
        return '--';
      }
      const formattedValue = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(variation);

      return (variation > 0 ? `+${formattedValue}` : formattedValue) + '%';
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
    goToCryptoDetails(idCrypto) {
      this.$router.push('/app/v1/crypto?id=' + idCrypto)
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
          this.cryptos = data.data.map((item) => ({
            ...item,
            volume: Math.random() * 1000000000,
            capitalisation: item.valeur * 1000000,
          }))
        } else {
          throw new Error(data.message || 'Error retrieving user information')
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
  mounted() {
    this.initializeWebSocket()
  },
  unmounted() {
    if (this.socket) {
      this.socket.close()
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
  padding: 15px;
}

th {
  font-weight: 700;
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
  font-weight: 700;
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>
