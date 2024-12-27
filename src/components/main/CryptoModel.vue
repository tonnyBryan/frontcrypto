<template>
  <div>
    <!-- Affichage des détails de la crypto -->
    <div v-if="crypto">
      <h2>{{ crypto.nom }} ({{ crypto.unit_nom }})</h2>
      <div class="crypto-details">
        <img :src="getLogoUrl(crypto.crypto.logo)" alt="logo" class="crypto-logo" />
        <p>Prix actuel: {{ formatCurrency(crypto.valeur) }}</p>
        <p>Volume 24h: {{ formatVolume(crypto.volume) }}</p>
        <p>Capitalisation: {{ formatCurrency(crypto.capitalisation) }}</p>
        <p>
          Variation:
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
    </div>
    <div v-else>
      <p>Chargement des données...</p>
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
    }
  },
  methods: {
    // Récupérer l'ID de la crypto de l'URL
    getCryptoId() {
      return this.$route.query.id
    },

    // Fonction pour formater la devise en USD
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    },

    // Fonction pour formater la variation
    formatVariation(variation) {
      return (
        new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(variation) + '%'
      )
    },

    // Fonction pour formater le volume
    formatVolume(volume) {
      return (
        new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(volume) + 'B'
      )
    },

    // Fonction pour obtenir l'URL du logo de la crypto
    getLogoUrl(logo) {
      if (!logo) {
        return '/assets/crypto/default-logo.png'
      }
      return `/assets/crypto/${logo}`
    },

    // Mettre à jour les informations de la crypto
    updateCryptoData(data) {
      const selectedCrypto = data.find(
        (crypto) => crypto.crypto.id_crypto === parseInt(this.getCryptoId()),
      )

      console.log(data)
      console.log(selectedCrypto)
      if (selectedCrypto) {
        this.crypto = {
          ...selectedCrypto,
          variation: Math.random() * 10 - 5, // Variation aléatoire pour l'exemple
          volume: Math.random() * 1000000000, // Volume simulé
          capitalisation: selectedCrypto.valeur * 1000000, // Capitalisation calculée
        }
      }
    },

    // Configurer la WebSocket pour recevoir les mises à jour
    connectWebSocket() {
      this.socket = new WebSocket('ws://localhost:8080/ws/crypto')

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.updateCryptoData(data) // Met à jour les données de la crypto sélectionnée
      }

      this.socket.onopen = () => {
        console.log('WebSocket connecté')
      }

      this.socket.onclose = () => {
        console.log('WebSocket déconnecté')
      }
    },
  },
  mounted() {
    this.connectWebSocket() // Connexion WebSocket lors du montage du composant
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close() // Fermer la WebSocket lorsque le composant est détruit
    }
  },
}
</script>

<style scoped>
.crypto-details {
  padding: 20px;
}

.crypto-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}
</style>
