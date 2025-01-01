<template>
  <div class="table-container">
    <h4 style="margin-left: 7px">Cryptho-Wallet</h4>
    <div class="table-responsive">
      <table class="table table-dark tba">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Estimated value</th>
            <th scope="col">Quantity</th>
            <th scope="col" class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="Mycryphos in paginatedMycryphoss" :key="Mycryphos.crypto.id_crypto">
            <td class="unit">
              <img
                :src="'/assets/crypto/' + Mycryphos.crypto.logo"
                alt="Bitcoin"
                width="20"
                class="me-2"
              />

              {{ Mycryphos.crypto.nom }}
            </td>
            <td>{{ formatCurrency(Mycryphos.estimation) }}</td>
            <td>{{ Mycryphos.valeur }}</td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-warning fw-bold"
                type="submit"
                @click="handleTransaction('buy', Mycryphos)"
              >
                Buy
              </button>
              <button
                class="btn btn-sm btn-success fw-bold"
                type="submit"
                @click="handleTransaction('Sell', Mycryphos)"
              >
                Sell
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal pour la confirmation du compte -->
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
      class="card p-5 text-center shadow-lg"
      style="width: 35rem; background-color: #2c2c2c; border-radius: 15px; color: #fff"
    >
      <button
        class="btn-close position-absolute"
        style="
          top: 10px;
          right: 10px;
          color: white;
          background-color: transparent;
          font-size: 1.5rem;
        "
        @click="closeModalAcc"
      ></button>
      <p class="mb-3">
        Type de transaction: <span class="text-warning">{{ transactionType }}</span>
      </p>
      <p class="mb-3">
        Cryptomonai type : <span class="text-warning">{{ cryptoId.crypto.nom }}</span>
      </p>

      <input
        type="number"
        v-model="Qtt"
        required
        class="form-control mb-3 text-center"
        style="background-color: #444; color: #fff; border: none; border-radius: 5px"
        placeholder="Entrez  quantite"
      />
      <p class="text-danger mb-3" v-if="errorMessageKey">{{ errorMessageKey }}</p>

      <button
        id="confirmAccBtn"
        class="btn btn-warning w-100 fw-bold"
        style="font-size: 1.2rem"
        @click="confirmAccount"
      >
        Confirmer
      </button>
      <p class="text-muted">
        or, vous pouvez juste appeler dans postman l'url envoyé à votre email
      </p>
    </div>
  </div>
</template>

<script>
import UtilClass from '@/util/UtilClass'

export default {
  props: {
    Mycryphoss: {
      type: Array,
      required: true,
    },
    limit: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      Qtt: '',
      errorMessageKey: '',
      errorMessage: '',
      showConfirmationModal: false,
      transactionType: '',
      cryptoId: [],
      socket: null,
    }
  },
  mounted() {
    this.initializeWebSocket()
  },
  unmounted() {
    if (this.socket) {
      this.socket.close()
    }
  },
  computed: {
    paginatedMycryphoss() {
      return this.limit ? this.Mycryphoss.slice(0, this.limit) : this.Mycryphoss
    },
  },
  methods: {
    handleTransaction(type, crypto) {
      if (type === 'buy') {
        this.$router.push('/app/accueil/crypto?id=' + crypto.crypto.id_crypto)
        return
      }

      this.errorMessage = ''
      this.transactionType = type === 'buy' ? 'Achats' : 'Vente'
      this.cryptoId = crypto
      this.showConfirmationModal = true
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    },
    async confirmAccount() {
      if (!this.Qtt) {
        this.errorMessageKey = 'Veuillez entrer une clé de confirmation.'
        return
      }
    },
    closeModalAcc() {
      this.confirmationKey = ''
      this.errorMessageKey = ''
      ;(this.showConfirmationModal = false), (this.cryptoId = [])
    },
    initializeWebSocket() {
      const socket = new WebSocket(UtilClass.BACKEND_SOCKET_BASE_UR + '/ws/crypto')

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.updateCryptoEstimations(data)
      }

      socket.onopen = () => {
        console.log('WebSocket connecté')
      }

      socket.onclose = () => {
        console.log('WebSocket déconnecté')
        this.isConnected = false
      }

      this.socket = socket
    },
    updateCryptoEstimations(data) {
      data.forEach((newCrypto) => {
        const cryptoToUpdate = this.Mycryphoss.find(
          (crypto) => crypto.crypto.id_crypto === newCrypto.crypto.id_crypto,
        )
        if (cryptoToUpdate) {
          cryptoToUpdate.estimation = cryptoToUpdate.valeur * newCrypto.valeur
        }
      })
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
  },
}
</script>

<style scoped>
.table-container {
  position: relative;
  padding: 0 20px;
}

h4 {
  margin-top: 16px;
  font-weight: 700;
  color: white;
  text-align: left;
  margin-bottom: 10px; /* Pour l'espacement avec la table */
}

.table {
  margin: 0 auto;
  width: 100%;
}

.table-dark {
  --bs-table-bg: transparent !important;
  --bs-table-color: inherit !important;
}

.table th,
.table td {
  padding: 10px;
  color: rgb(161, 160, 160);
}

.unit {
  font-weight: 600;
  color: #fdf8f8;
}

.table tbody tr {
  height: initial;
}

td {
  color: antiquewhite;
}

.btn {
  border-radius: 5px;
  font-size: 1rem;
}

.btn-sm {
  font-size: 1.1rem;
}

.btn-warning,
.btn-success {
  width: 45%; /* Ajuster la largeur pour alignement optimal */
  margin: 0 2%; /* Ajouter un léger espacement entre les boutons */
}

th {
  font-weight: bold;
}

/* Réduire la taille des polices et masquer certaines colonnes sur les petits écrans */
@media (max-width: 576px) {
  .table th:nth-child(2),
  .table td:nth-child(2) {
    display: none;
  }

  .btn-warning,
  .btn-success {
    width: 100%; /* Prendre toute la largeur pour les petits écrans */
    margin: 5px 0; /* Espacement vertical entre les boutons */
  }
}
</style>
