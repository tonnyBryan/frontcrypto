<template>
  <div class="table-container">
    <h4 style="margin-left: 7px">
      Cryptho-Wallet :
      <span class="text-success ms-2" style="color: rgba(22, 216, 22, 0.445);font-weight: 700;">{{ formatCurrency(capitalValue) }}</span>
    </h4>
    <div class="table-responsive">
      <table class="table table-dark tba"  v-if="paginatedMycryphoss.length > 0">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Estimated value</th>
            <th scope="col">Quantity</th>
            <th scope="col" class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="Mycryphos in paginatedMycryphoss" :key="Mycryphos.crypto.id_crypto" >
            <td>
              <img
                :src="'/assets/images/logo/' + Mycryphos.crypto.unit_nom + '.png'"
                alt="Bitcoin"
                width="20"
                class="me-2"
              />

              <router-link :to="'/app/v1/crypto?id=' + Mycryphos.crypto.id_crypto">
                <span class="unit">{{ Mycryphos.crypto.unit_nom }}</span> {{ Mycryphos.crypto.nom }}
              </router-link>
            </td>
            <td class="unit">{{ formatCurrency(Mycryphos.estimation) }}</td>
            <td class="unit" :id="'qtyLab' + Mycryphos.crypto.id_crypto">{{ Mycryphos.valeur }}</td>
            <td class="text-center">
              <div class="d-flex flex-column flex-md-row justify-content-center">
                <button
                  class="btn btn-sm btn-outline-warning fw-bold mb-2 mb-md-0 me-md-2"
                  type="submit"
                  @click="handleTransaction('buy', Mycryphos)"
                >
                  Buy
                </button>
                <button
                  class="btn btn-sm btn-outline-success fw-bold"
                  type="submit"
                  @click="handleTransaction('sell', Mycryphos)"
                >
                  Sell
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex flex-column align-items-center" v-else>
        <i class="bi bi-wallet text-warning fs-2" ></i>
        <p class="mt-2 fw-bold "> Oops! Your crypto wallet is empty! It's time to invest! 🛒💰</p>
      </div>
    </div>
  </div>
</template>

<script>
import UtilClass from '@/util/UtilClass'
import CryptoJS from 'crypto-js'

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
      const filteredCryptos = this.Mycryphoss.filter(crypto => crypto.valeur > 0);
      return this.limit ? filteredCryptos.slice(0, this.limit) : filteredCryptos;
    },
    capitalValue() {
      return this.Mycryphoss.reduce((total, crypto) => total + crypto.estimation, 0);
    },
  },
  methods: {
    handleTransaction(type, crypto) {
      if (type === 'buy') {
        const data = {
          quantity: 0,
          cryptoId: crypto.crypto.id_crypto,
        }
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(data),
          UtilClass.SECRET_KET,
        ).toString()

        localStorage.setItem('cryptoData', encryptedData)

        this.$router.push({
          name: 'cryptoAchat',
        })

        return
      } else if (type === 'sell') {
        if (crypto.valeur <= 0) {
          UtilClass.blinkText('qtyLab' + crypto.crypto.id_crypto)
          return
        }
        this.$router.push('/app/v1/vente?id=' + crypto.crypto.id_crypto)
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    },
    initializeWebSocket() {
      const socket = new WebSocket(UtilClass.BACKEND_SOCKET_BASE_UR + '/ws/crypto')

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.updateCryptoEstimations(data)
      }

      socket.onopen = () => {
      
      }

      socket.onclose = () => {
        
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
      return UtilClass.formatCurrency(value)
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
  color: white;
  text-align: left;
  margin-bottom: 10px; 
}

.table {
  margin: 0 auto;
  width: 100%;
}

.table-dark {
  --bs-table-bg: transparent !important;
  --bs-table-color: inherit !important;
}

.table td {
  padding: 10px;
}

.unit {
  font-weight: 700;
  color: #fff;
}

.table tbody tr {
  height: initial;
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
  width: 45%;
  margin: 0 2%; 
}

th {
  font-weight: bold;
}


@media (max-width: 576px) {
  .table th:nth-child(2),
  .table td:nth-child(2) {
    display: none;
  }

  .btn-warning,
  .btn-success {
    width: 100%; 
    margin: 5px 0;
  }
}
</style>
