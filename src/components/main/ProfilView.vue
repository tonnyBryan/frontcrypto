<script setup>
import LoaderV from '../util/LoaderV.vue'
</script>

<template>
  <div style="padding-top: 2rem; padding-bottom: 3rem; overflow-x: hidden" v-if="user">
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
      <WalletCryptoView :Mycryphoss="mycrypto" :limit="10" />
    </div>
    <div class="row">
      <div class="scrollable-container col-md-6">
        <TransactionView :transactions="fundTransactions" :limit="fundLimit" />
        <button
          v-if="fundTransactions.length"
          @click="toggleFundView"
          class="btn btn-secondary btn-sm bt bt-retrait m-3"
        >
          {{ fundButtonText }}
        </button>
      </div>
      <div class="scrollable-container col-md-6">
        <TransactionCrypt :transactions="cryptoTransactions" :limit="cryptoLimit" />
        <button
          v-if="cryptoTransactions.length"
          @click="toggleCryptoView"
          class="btn btn-secondary btn-sm bt bt-retrait m-3"
        >
          {{ cryptoButtonText }}
        </button>
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
      class="card p-5 shadow-lg cd"
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

      <h5 class="mb-4" style="font-size: x-large">
        {{ transactionType }}
        <span style="font-size: x-large; color: #aaacab">@{{ user.email }}</span>
      </h5>
      <div class="position-relative">
        <input
          type="text"
          v-model="formattedSolde"
          class="form-control inp"
          placeholder="Entrez le montant"
          @input="formatNumber"
        />
        <span class="usd-icon">$</span>
      </div>

      <p class="text-danger mb-3" v-if="errorMessage">{{ errorMessage }}</p>
      <button
        style="margin-top: 5rem"
        id="trscBtn"
        class="btn btn-warning w-100 fw-bold"
        @click="proceedToConfirmation"
      >
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
      class="card p-5 text-center shadow-lg cd"
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
      <h5 class="mb-4 email" style="text-align: left; font-size: x-large">Confirmation Requise</h5>
      <div class="card bg-dark p-4" style="border: solid 1px #676767">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h5 class="text-white" style="text-align: left">{{ formatAmount(solde) }} $</h5>
          </div>
          <div class="col-md-4 og">
            <div
              style="border: solid 2px"
              :class="[
                'badge',
                transactionType === 'Dépôt'
                  ? 'border-warning text-warning'
                  : 'border-success text-success',
              ]"
            >
              {{ transactionType }}
            </div>
          </div>
        </div>
      </div>

      <p style="margin-top: 5rem; text-align: left">
        Veuillez entrer la clé de confirmation envoyée à votre e-mail pour confirmer transaction.
      </p>
      <input
        type="text"
        v-model="confirmationKey"
        class="form-control mb-3 text-center inp2"
        style="background-color: #444; color: #fff; border: none; border-radius: 5px"
        placeholder="Entrez la clé de confirmation"
      />
      <div v-if="errorMessageKey" class="alert alert-danger" role="alert">
        {{ errorMessageKey }}
      </div>
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

  <!-- Modal pour la resultat du compte -->
  <div
    class="modal d-flex justify-content-center align-items-center"
    v-if="showResultModal"
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
      class="card p-5 shadow-lg cd"
      style="width: 40rem; background-color: #2c2c2c; border-radius: 15px; color: #fff"
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
        @click="closeResultModal"
      ></button>

      <TransactionFdResult :details="dtll"></TransactionFdResult>
    </div>
  </div>
</template>

<script>
import UtilClass from '@/util/UtilClass'
import TransactionView from './TransactionFond.vue'
import WalletCryptoView from './WalletCryptoView.vue'
import TransactionCrypt from './TransactionCrypt.vue'
import TransactionFdResult from './TransactionFdResult.vue'

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
      formattedSolde: '',
      showConfirmationModal: false,
      showTransactionModal: false,
      transactionType: '',

      fundTransactions: [],
      cryptoTransactions: [],
      mycrypto: [],

      fundLimit: 3,
      cryptoLimit: 3,
      fundExpanded: false,
      cryptoExpanded: false,

      showResultModal: false,
      dtll: null,
    }
  },
  created() {
    this.getUserInfo()
  },
  computed: {
    fundButtonText() {
      return this.fundExpanded ? 'Voir Moins' : 'Voir Plus'
    },
    cryptoButtonText() {
      return this.cryptoExpanded ? 'Voir Moins' : 'Voir Plus'
    },
  },
  methods: {
    formatNumber() {
      const rawValue = this.formattedSolde.replace(/\s/g, '') // Retirer les espaces existants
      if (!isNaN(rawValue)) {
        this.solde = rawValue // Stocker la valeur brute
        this.formattedSolde = Number(rawValue).toLocaleString('fr-FR') // Ajouter les espaces
      } else {
        this.formattedSolde = this.solde // En cas de saisie invalide
      }
    },
    toggleFundView() {
      if (this.fundExpanded) {
        this.fundLimit = 3
      } else {
        this.fundLimit = null
      }
      this.fundExpanded = !this.fundExpanded
    },
    toggleCryptoView() {
      if (this.cryptoExpanded) {
        this.cryptoLimit = 3
      } else {
        this.cryptoLimit = null
      }
      this.cryptoExpanded = !this.cryptoExpanded
    },
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
      this.formattedSolde = ''
      this.errorMessage = ''
      this.showTransactionModal = true
    },
    getType(tpdata) {
      return tpdata === 'Dépôt' ? 'depot' : 'retrait'
    },
    closeTransactionModal() {
      this.showTransactionModal = false
    },
    closeResultModal() {
      this.showResultModal = false
    },
    async proceedToConfirmation() {
      if (!this.solde || this.solde <= 0) {
        this.errorMessage = 'Veuillez entrer un montant valide.'
        return
      }

      if (this.getType(this.transactionType) === 'retrait') {
        if (this.user.monnaie < this.solde) {
          this.errorMessage = 'Veuillez entrer un montant valide.'
          return
        }
      }

      const trButton = document.getElementById('trscBtn')
      UtilClass.loadButton(trButton)

      try {
        const response = await fetch(UtilClass.BACKEND_BASE_URL + '/crypto/user/vdrequest', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + UtilClass.getLocalToken(),
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error("Une erreur est survenue lors de l'appel à l'API.")
        }

        const data = await response.json()

        UtilClass.endLoadedButton(trButton, 'Confirmer')

        if (!data.success) {
          UtilClass.showErrorToast(data.message || 'Erreur inconnue')
          return
        }
        this.showTransactionModal = false
        this.showConfirmationModal = true
      } catch (error) {
        UtilClass.endLoadedButton(trButton, 'Confirmer')
        UtilClass.showErrorToast("Une erreur s'est produite. Veuillez réessayer plus tard.")
        console.error(error)
      }
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
          UtilClass.BACKEND_BASE_URL + '/crypto/user/' + this.getType(this.transactionType),
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + UtilClass.getLocalToken(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: this.user.email,
              solde: this.solde,
              key: this.confirmationKey,
            }),
          },
        )

        const data = await response.json()

        if (data.success) {
          this.closeModalAcc()

          this.dtll = {
            type: this.getType(this.transactionType),
            solde: this.solde,
            NouveauSolde:
              this.getType(this.transactionType) === 'depot'
                ? parseFloat(this.user.monnaie) + parseFloat(this.solde)
                : parseFloat(this.user.monnaie) - parseFloat(this.solde),
          }

          await this.getUserInfo()
          UtilClass.endLoadedButton(confirmAccButton, 'Confirmer')
          this.showResultModal = true
        } else {
          UtilClass.endLoadedButton(confirmAccButton, 'Confirmer')
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
.scrollable-container {
  max-height: 50vh;
  overflow-y: auto;
  border: 1px solid #444;
  padding: 1rem;
}

.inp {
  background-color: transparent;
  color: rgb(255, 255, 255);
  border: solid 1px white;
  border-radius: 8px;
}

.inp {
  padding: 1rem;
  background: transparent !important;
  border: solid 1px #454545 !important;
  color: #fdf8f8 !important;
  font-weight: 700;
  font-size: larger;
}

.inp:focus,
.inp2:focus {
  border-color: #ffc107;
  outline: none;
  box-shadow: none;
}

.inp::placeholder,
.inp2::placeholder {
  color: #888;
  opacity: 1;
}

.usd-icon {
  position: absolute;
  top: 41%;
  right: 20px;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #999;
  pointer-events: none;
}

@media (max-width: 768px) {
  .cd {
    height: 100%;
    border-radius: unset !important;
    padding: 1rem !important;
    padding-top: 4rem !important;
  }

  .og {
    text-align: left;
  }
}
.alert-danger {
  --bs-alert-bg: #2c0b0e !important;
  --bs-alert-color: #ea868f !important;
  --bs-alert-border-color: #842029 !important;
}
</style>
