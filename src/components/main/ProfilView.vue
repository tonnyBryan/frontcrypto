<script setup>
import LoaderV from '../util/LoaderV.vue'
</script>

<template>
  <div style="padding-top: 2rem; padding-bottom: 3rem" v-if="user">
    <div class="row">
      <div class="col-md-4">
        <div class="row m-1 d-flex align-items-center">
          <div class="col-auto">
            <img src="@/assets/bruce-mars.jpg" alt="profile_image" class="avatar" />
          </div>
          <div class="col">
            <h5 class="username">{{ user.nom }}</h5>
            <h6>{{ user.email }}</h6>
          </div>
        </div>
      </div>
    </div>

    <hr style="border-top: 4px solid gray" />
    <div class="row">
      <div class="card text-white bg-dark shadow rounded-custom">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5 class="card-title mb-2">Solde réel <i class="bi bi-eye"></i></h5>
              <h1 class="mb-0">{{ formatAmount(user.monnaie) }} <span class="unit">MGA</span></h1>
            </div>
            <div class="d-flex gap-2 flex-sm-row flex-column">
              <button
                @click="openTransactionModal('depot')"
                class="btn btn-secondary btn-sm bt bt-depot"
              >
                <i class="bi bi-arrow-bar-down"></i> Dépôt
              </button>
              <button
                @click="openTransactionModal('retrait')"
                class="btn btn-secondary btn-sm bt bt-retrait"
              >
                <i class="bi bi-arrow-bar-up"></i> Retrait
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr style="border-top: 4px solid gray" />
    <div class="row" style="padding-bottom: 2rem">
      <WalletCryptoView :Mycryphoss="this.mycrypto" :limit="10" />
    </div>
    <div class="row">
      <div class="col-md-6">
        <TransactionView :transactions="fundTransactions" :limit="5" />
      </div>
      <div class="col-md-6">
        <TransactionCrypt :transactions="cryptoTransactions" :limit="5" />
      </div>
    </div>
  </div>
  <div class="center" v-else>
    <LoaderV></LoaderV>
  </div>
  <!-- Modal pour entrer le solde -->
  <div
    class="modal d-flex justify-content-center align-items-center"
    v-if="showTransactionModal"
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
        @click="closeTransactionModal"
      ></button>
      <h5 class="mb-4">{{ transactionType === 'depot' ? 'Dépot' : 'Retrait' }}</h5>
      <input
        type="number"
        v-model="solde"
        class="form-control mb-3 text-center"
        style="background-color: #444; color: #fff; border: none; border-radius: 5px"
        placeholder="Entrez le montant"
      />
      <p class="text-danger mb-3" v-if="errorMessage">{{ errorMessage }}</p>
      <button id="confirmBtn" class="btn btn-warning w-100 fw-bold" @click="proceedToConfirmation">
        Confirmer
      </button>
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
      <h5 class="mb-4 email">{{ email }}</h5>
      <p class="mb-3">
        Type de transaction: <span class="text-warning">{{ transactionType }}</span>
      </p>
      <p class="mb-3">
        Montant: <span class="text-warning">{{ solde }}$</span>
      </p>
      <p>
        Veuillez entrer la clé de confirmation envoyée à votre e-mail pour confirmer transaction.
      </p>
      <input
        type="text"
        v-model="confirmationKey"
        class="form-control mb-3 text-center"
        style="background-color: #444; color: #fff; border: none; border-radius: 5px"
        placeholder="Entrez la clé de confirmation"
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
import TransactionView from './TransactionFond.vue'
import WalletCryptoView from './WalletCryptoView.vue'
import TransactionCrypt from './TransactionCrypt.vue'

export default {
  components: {
    TransactionView,
    WalletCryptoView,
  },
  data() {
    return {
      user: null,
      confirmationKey: '',
      errorMessageKey: '',
      errorMessage: '',
      solde: '',
      showConfirmationModal: false,
      showTransactionModal: false,
      transactionType: '',

      fundTransactions: [],
      cryptoTransactions: [],
      mycrypto: [],
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      try {
        const response = await fetch(UtilClass.BACKEND_BASE_URL + '/crypto/user', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + UtilClass.getLocalToken(),
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        console.log(data)

        if (data.success) {
          this.user = data.data
          this.mycrypto = data.data.portefeuille.cryptoValeurs
          this.fundTransactions = data.data.transactionFond
          this.cryptoTransactions = data.data.transactionCryptos
        } else {
          throw new Error(
            data.message || 'Erreur lors de la récupération des informations utilisateur.',
          )
        }
      } catch (error) {
        console.error(error)
      }
    },

    formatAmount(amount) {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    },

    openTransactionModal(type) {
      this.transactionType = type === 'depot' ? 'Dépôt' : 'Retrait'
      this.solde = ''
      this.errorMessage = ''
      this.showTransactionModal = true
    },
    closeTransactionModal() {
      this.showTransactionModal = false
    },
    proceedToConfirmation() {
      if (!this.solde || this.solde <= 0) {
        this.errorMessage = 'Veuillez entrer un montant valide.'
        return
      }
      this.showTransactionModal = false
      this.showConfirmationModal = true
    },
    async confirmAccount() {
      if (!this.confirmationKey) {
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
      this.showConfirmationModal = false
    },
  },
}
</script>
<style scoped>
.bg-dark {
  background-color: transparent !important;
  background: transparent !important;
}

.avatar {
  height: 71px;
  width: 71px;
  border-radius: 10%;
}

.lg {
  background-color: rgba(46, 37, 37, 0.5);
  backdrop-filter: blur(3px);
  color: #fff;
}
.CB {
  color: #fff;
}

.username {
  font-size: 1.5rem;
  color: #fff;
}

.unit {
  font-size: large;
  color: #cbcbcb !important;
}

.bt {
  width: 7rem;
  border: none;
  font-size: medium;
  font-weight: 700;
  transition: 0.3s ease-in-out;
}

.bt i {
  font-weight: 700;
}

.bt-depot {
  background-color: #ffc107 !important;
  color: black;
}

.bt-depot:hover {
  background-color: #e6b625 !important;
}

.bt-retrait {
  background-color: transparent !important;
  border: solid 1px !important;
}

.bt-retrait:hover {
  border-color: #e6b625;
  color: #e6b625;
}

.center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
