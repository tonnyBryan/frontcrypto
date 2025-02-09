<script setup>
import LoaderV from '../util/LoaderV.vue'
</script>

<template>
  <div
    style="padding-top: 2rem; padding-bottom: 3rem; overflow-x: hidden; width: 90%; margin: auto"
    v-if="user"
  >
    <div class="row">
      <div class="col-md-12">
        <div class="row m-1 d-flex align-items-center">
          <div class="col-auto">
            <img :src="getUserLogo(user.imageUrl)" alt="profile_image" class="avatar" />
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
              <h4 class="card-title mb-2">Balance : </h4>
              <h1 class="mb-0">{{ formatCurrency(user.monnaie) }} <span class="unit">USD</span></h1>
            </div>
            <div class="d-flex gap-2 flex-sm-row flex-column">
              <button
                @click="openTransactionModal('depot')"
                class="btn btn-secondary btn-sm bt bt-depot"
              >
                <i class="bi bi-arrow-bar-up"></i> Deposit
              </button>
              <button
                @click="openTransactionModal('retrait')"
                class="btn btn-secondary btn-sm bt bt-retrait"
              >
                <i class="bi bi-arrow-bar-down"></i> Withdraw
              </button>
            </div>
          </div>
          <div class="row justify-content-between align-items-center mt-4">
            <Requestfrom :request="requetpending" @request-changed="getpendingRequest" />
          </div>
        </div>
      </div>
    </div>
    <hr style="border-top: 4px solid gray" />
    <div class="row" style="padding-bottom: 2rem">
      <ListMyFavoriesView />
    </div>
    <hr style="border-top: 4px solid gray" />
    <div class="row" style="padding-bottom: 2rem">
      <WalletCryptoView  :Mycryphoss="mycrypto" :limit="20" />
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
      class="card fade-in p-5 shadow-lg cd"
      style="width: 35rem; background-color: #1e2329; border-radius: 15px; color: #fff"
    >
      <h5 class="mb-4" style="font-size: x-large">
        {{ transactionType }}
        <span style="font-size: x-large; color: #aaacab">@{{ user.email }}</span>
      </h5>
      <div class="position-relative mb-4">
        <input
          type="text"
          v-model="formattedSolde"
          class="form-control inp"
          placeholder="Please enter the amount "
          @input="formatNumber"
        />
        <span class="usd-icon">USD</span>
      </div>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle-fill"></i>  {{ errorMessage }}
      </div>
      <button
        style="margin-top: 3rem"
        id="trscBtn"
        class="btn btn-warning w-100 fw-bold"
        @click="proceedToConfirmation"
      >
        Request
      </button>
      <button @click="closeTransactionModal" style="font-size: 1.2rem" class="btn w-100 annuler">
        Cancel
      </button>
    </div>
  </div>

  <div
    class="modal fade"
    id="thankYouModal"
    tabindex="-1"
    aria-labelledby="thankYouModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="thankYouModalLabel">Thank You!</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">Please wait while admin accept it ❤️🦄</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import UtilClass from '@/util/UtilClass'
import TransactionView from './TransactionFond.vue'
import WalletCryptoView from './WalletCryptoView.vue'
import TransactionCrypt from './TransactionCrypt.vue'
import Requestfrom from '../util/MyHistoryRequest.vue'
import ListMyFavoriesView from './ListMyFavoriesView.vue'
import * as bootstrap from 'bootstrap'

export default {
  components: {
    TransactionView,
    WalletCryptoView,
    Requestfrom,
    TransactionCrypt,
  },
  data() {
    return {
      user: null,
      errorMessage: '',
      solde: '',
      formattedSolde: '',
      showTransactionModal: false,
      transactionType: '',

      fundTransactions: [],
      cryptoTransactions: [],
      mycrypto: [],

      fundLimit: 3,
      cryptoLimit: 2,
      fundExpanded: false,
      cryptoExpanded: false,

      showResultModal: false,
      dtll: null,

      requetpending:null,
    }
  },
  created() {
    this.getUserInfo()
    this.getpendingRequest()

  },
  computed: {
    fundButtonText() {
      return this.fundExpanded ? 'Show less' : 'Show more'
    },
    cryptoButtonText() {
      return this.cryptoExpanded ? 'Show less' : 'Show more'
    },
  },
  methods: {
    formatCurrency(value) {
      const roundedValue = value.toFixed(2);
      return new Intl.NumberFormat('fr-FR').format(roundedValue);
    },
    getUserLogo(logo) {
      if (!logo || parseInt(logo) === 0) {
        return '/assets/images/default-logo.jpg'
      }
      return logo
    },
    formatNumber() {
      const rawValue = this.formattedSolde.replace(/\s/g, '')
      if (!isNaN(rawValue)) {
        this.solde = rawValue 
        this.formattedSolde = Number(rawValue).toLocaleString('fr-FR') 
      } else {
        this.formattedSolde = this.solde 
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

        if (!response.ok) {
          if (UtilClass.isInvalidTokenError(data)) {
            UtilClass.removeLocalToken()
            this.$router.push('/app/login')
          }
        }
        if (data.success) {
          this.user = data.data
          this.mycrypto = data.data.portefeuille.cryptoValeurs
          this.fundTransactions = data.data.transactionFond
          this.cryptoTransactions = data.data.transactionCryptos
        } else {
          throw new Error(data.message || 'Error retrieving user information')
        }

      } catch (error) {
        console.error(error)
      }
    },
    async getpendingRequest(){
      try {
        const response = await fetch(UtilClass.BACKEND_BASE_URL + '/crypto/user/demande/attente', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + UtilClass.getLocalToken(),
            'Content-Type': 'application/json',
          },
        })
        const datas= await response.json()

        if (!response.ok) {
          if (UtilClass.isInvalidTokenError(datas)) {
            UtilClass.removeLocalToken()
            this.$router.push('/app/login')
          }
        }
        if (datas.success) {
          this.requetpending = datas.data
        } else {
          throw new Error(datas.message || 'Error retrieving pending request')
        }
      } catch (error) {
        console.error(error)
      }
    },
    openTransactionModal(type) {
      if (!UtilClass.hasInternetAccess()) {
        UtilClass.showErrorToast("Oups! Check your network and try again")
        return;
      }

      this.transactionType = type === 'depot' ? 'Depot' : 'Retrait'
      this.solde = ''
      this.formattedSolde = ''
      this.errorMessage = ''
      this.showTransactionModal = true
    },
    getType(tpdata) {
      return tpdata === 'Depot' ? 'depot' : 'retrait'
    },
    closeTransactionModal() {
      this.showTransactionModal = false
      this.solde = ''
      this.formattedSolde = ''
      this.errorMessage = ''
    },
    async proceedToConfirmation() {
      if (!this.solde || this.solde <= 0) {
        this.errorMessage = 'Please enter a valid amount'
        return
      }

      if (this.getType(this.transactionType) === 'retrait') {
        if (this.user.monnaie < this.solde) {
          this.errorMessage = 'Not enough money'
          return
        }
      }

      const trButton = document.getElementById('trscBtn')
      UtilClass.loadButton(trButton)

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
            }),
          },
        )

        const data = await response.json()

        if (!response.ok) {
          if (UtilClass.isInvalidTokenError(data)) {
            UtilClass.removeLocalToken()
            this.$router.push('/app/login')
          }
        }

        if (data.success) {
          this.closeTransactionModal()
          UtilClass.endLoadedButton(trButton, 'Request')

          this.showTransactionModal = false
          const thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'))
          thankYouModal.show()
          this.getpendingRequest()

        } else {
          UtilClass.endLoadedButton(trButton, 'Request')
          throw new Error(data.message || 'An error occured, Please try again later')
        }
      } catch (error) {
        UtilClass.endLoadedButton(trButton, 'Request')
        this.errorMessage = error.message
      }
    }
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


.username {
  font-size: 1.5rem;
  color: #fff;
}

.unit {
  font-size: large;
  color: #cbcbcb !important;
}

.bt {
  width: 8rem;
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
  position: absolute;
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
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #ffffff;
  pointer-events: none;
  font-weight: 700;
}

@media (max-width: 768px) {
  .cd {
    height: 100%;
    border-radius: unset !important;
    padding: 1rem !important;
    padding-top: 4rem !important;
  }

}

.modal-content {
  background-color: #181a20;
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-bottom: 1px solid #444;
}

.modal-footer {
  border-top: 1px solid #444;
}

.alert-danger {
  --bs-alert-bg: #2c0b0e !important;
  --bs-alert-color: #ea868f !important;
  --bs-alert-border-color: #842029 !important;
}
</style>
