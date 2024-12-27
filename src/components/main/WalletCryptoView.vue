<template>
    <div class="table-container">
      <h4 class="yellow" style="margin-top:16px;margin-left: 10px;">Cryptho-Wallet</h4>
        <table class="table table-dark tba">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Estimade value</th>
              <th scol="col">Quantity</th>
              <th scol="col" colspan="2"></th>
             
            </tr>
          </thead>
          <tbody>
            <tr v-for="Mycryphos in paginatedMycryphoss" :key="Mycryphos.ref">
              <td class="unit">{{ Mycryphos.cryptoName }}</td>
              <td class="unit">{{ formatAmount(Mycryphos.amount) }}</td>
              <td>{{ Mycryphos.qtt }}</td>
              <td>
                <button  
                class="btn  btn-sm btn-warning w-50 fw-bold"
                type="submit"
                @click="handleTransaction('buy',Mycryphos)">
                Buy </button>
              </td>
              <td><button  class="btn  btn-sm btn-success w-50 fw-bold"
                type="submit"
                @click="handleTransaction('Sell',Mycryphos)">Sell</button></td>
            </tr>
          </tbody>
        </table>
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
        <p class="mb-3">Type de transaction: <span class="text-warning">{{ transactionType }}</span></p>
        <p class="mb-3">Cryptomonai type : <span class="text-warning">{{ cryptoId.cryptoName}}</span></p>
        
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
        <p class="text-muted ">
          or, vous pouvez juste appeler dans postman l'url envoyé à votre email
        </p>
      </div>
    </div>
    
    
  </template>
  
  <script>
  export default {
    props: {
      Mycryphoss: {
        type: Array,
        required: true
      },
      limit: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        Qtt: '',
        errorMessageKey: '',
        errorMessage: '',
        showConfirmationModal: false,
        transactionType: '',
        cryptoId:[],
      }
    },
    computed: {
      paginatedMycryphoss() {
        return this.limit ? this.Mycryphoss.slice(0, this.limit) : this.Mycryphoss
      }
    },
    methods: {
      handleTransaction(type,crypto) {
        this.errorMessage = '';
        this.transactionType = type === 'buy' ? 'Achats' : 'Vente'
        this.cryptoId=crypto;
        this.showConfirmationModal = true
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      },
      formatAmount(amount) {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'USD'
        }).format(amount)
      },
      async confirmAccount() {
        if (!this.Qtt) {
          this.errorMessageKey = 'Veuillez entrer une clé de confirmation.'
          return
        }

        const confirmAccButton = document.getElementById('confirmAccBtn')
        UtilClass.loadButton(confirmAccButton)
        try {
          const response = await fetch(
            UtilClass.BACKEND_BASE_URL + '/crypto/auth/validate?key=' + this.confirmationKey,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )

          const data = await response.json()
          UtilClass.endLoadedButton(confirmAccButton, 'Confirmer')

          if (data.isSuccess) {
            const token = data.data.token
            UtilClass.setToken(token)
            this.closeModalAcc()
            this.$router.push('/app/accueil')
          } else {
            throw new Error(data.message || 'Clé de confirmation invalide.')
          }
        } catch (error) {
          UtilClass.endLoadedButton(confirmAccButton, 'Confirmer')
          this.errorMessageKey = error.message
        }
      },
      closeModalAcc() {
        this.confirmationKey = ''
        this.errorMessageKey = ''
        this.showConfirmationModal = false,
        this.cryptoId=[]
      }
    }
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
  color: rgb(161, 160, 160);
}
.unit {
  font-weight: 600;
  color: #fdf8f8;
}

.table tbody tr {
  height: initial;
}
.table-container {
  position: relative;
}

th {
  font-weight: bold;
}
td {
  color: antiquewhite;
}
  </style>