<template>
  <div>
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
import { onMounted, ref, onUnmounted } from 'vue'

export default {
  name: 'CryptoTable',
  setup() {
    const cryptos = ref([])

    let socket

    const updateData = (data) => {
      cryptos.value = data.map((item) => ({
        ...item,
        variation: Math.random() * 10 - 5, // Variation aléatoire entre -5% et 5%
        volume: Math.random() * 1000000000, // Volume simulé
        capitalisation: item.valeur * 1000000, // Calcul basé sur le prix
      }))
    }

    onMounted(() => {
      socket = new WebSocket('ws://localhost:8080/ws/crypto')

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        updateData(data)
      }

      socket.onopen = () => {
        console.log('WebSocket connecté')
      }

      socket.onclose = () => {
        console.log('WebSocket déconnecté')
      }
    })

    onUnmounted(() => {
      if (socket) {
        socket.close()
      }
    })

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    }

    const formatVariation = (variation) => {
      return (
        new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(variation) + '%'
      )
    }

    const formatVolume = (volume) => {
      return (
        new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(volume) + 'B'
      )
    }

    const getLogoUrl = (logo) => {
      if (!logo) {
        return '/assets/crypto/default-logo.png'
      }
      return `/assets/crypto/${logo}`
    }

    return {
      cryptos,
      formatCurrency,
      formatVariation,
      formatVolume,
      getLogoUrl,
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
  padding: 10px; /* Style par défaut */
}

.table tbody tr {
  height: initial; /* Hauteur des lignes uniquement dans tbody */
}

.crypto-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px; /* Espacement entre le logo et le nom */
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

button {
  margin: 0 5px;
  padding: 0; /* Supprimer l'espace autour de l'icône */
  border: none; /* Supprimer les bordures */
  background: transparent; /* Supprimer l'arrière-plan */
}

button i {
  font-size: 15px; /* Taille de l'icône */
  color: inherit; /* Garde la couleur d'origine des boutons */
}

button.icon-button:hover {
  background: transparent; /* Aucun changement de fond au survol */
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
}
</style>
