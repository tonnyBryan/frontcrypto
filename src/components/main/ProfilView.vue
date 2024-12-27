<template>
  <div class="container-fluid pb-1 m-3" >
    <div class="row">
      <div class="col-md-4" >
        <div class="row m-1">
          <div class="col-md-4 offset-md-1">
            <img src="@/assets/bruce-mars.jpg" alt="profile_image" class="avatar" />
          </div>
          <div class="col-md-6">
            <h5>{{ userName }}</h5>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <h2>Your wallet</h2>
        <h1 class="yellow">{{ formatAmount(balance) }}</h1>
      </div>

      <div class="col-md-4">
        <h2>Transaction</h2>
        <div class="row" style="margin-top: 16px">
          <div class="col-md-4">
            <button
              id="depot-btn"
              type="submit"
              class="btn btn-warning w-100 mb-3 fw-bold"
              @click="openTransactionModal('depot')"
            >
              Depot
            </button>
          </div>
          <div class="col-md-4">
            <button
              id="retrait-btn"
              type="submit"
              class="btn btn-warning w-100 mb-3 fw-bold"
              @click="openTransactionModal('retrait')"
            >
              Retrait
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr style="border-top: 4px solid gray" />
    <div class="row">
      <div class="col-md-6">
        <TransactionView :transactions="fundTransactions" :limit="5" />
      </div>
      <div class="col-md-6">
        <TransactionView :transactions="cryptoTransactions" :isCrypto="true" :limit="5" />
      </div>
    </div>
    <hr style="border-top: 4px solid gray" />
    <div class="row">
      <WalletCryptoView :Mycryphoss="mycrypto" :limit="10" />
    </div>
  </div>
      <!-- Modal pour entrer le solde -->
      <div
      class="modal d-flex justify-content-center align-items-center"
      v-if="showTransactionModal"
      style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 1050;"
    >
      <div
        class="card p-5 text-center shadow-lg"
        style="width: 35rem; background-color: #2c2c2c; border-radius: 15px; color: #fff"
      >
        <button
          class="btn-close position-absolute"
          style="top: 10px; right: 10px; color: white; background-color: transparent; font-size: 1.5rem;"
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
        <button
          id="confirmBtn"
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
import TransactionView from './TransactionView.vue'
import WalletCryptoView from './WalletCryptoView.vue'

export default {
  components: {
    TransactionView,
    WalletCryptoView,
  },
  data() {
    return {
      userName: 'Gusss',
      email: 'Mimis@gmail.com',
      balance: '14500',
      confirmationKey: '',
      errorMessageKey: '',
      errorMessage: '',
      solde: '',
      showConfirmationModal: false,
      showTransactionModal: false,
      transactionType: '',

      fundTransactions: [
        {
          ref: '02312',
          date: '2024-12-04',
          amount: 14500,
          status: 'Approved',
        },
        {
          ref: '02313',
          date: '2024-12-03',
          amount: 5000,
          status: 'Pending',
        },
        {
          ref: '02314',
          date: '2024-12-02',
          amount: 7500,
          status: 'Rejected',
        },
        {
          ref: '02315',
          date: '2024-12-01',
          amount: 3000,
          status: 'Approved',
        },
        {
          ref: '02316',
          date: '2024-11-30',
          amount: 2000,
          status: 'Approved',
        },
        {
          ref: '02314',
          date: '2024-12-02',
          amount: 7500,
          status: 'Rejected',
        },
        {
          ref: '02315',
          date: '2024-12-01',
          amount: 3000,
          status: 'Approved',
        },
        {
          ref: '02316',
          date: '2024-11-30',
          amount: 2000,
          status: 'Rejected',
        },
      ],
      cryptoTransactions: [
        {
          ref: 'C2312',
          date: '2024-12-04',
          amount: 10000,
          cryptoName: 'Bitcoin',
          status: 'Approved',
        },
        {
          ref: 'C2313',
          date: '2024-12-03',
          amount: 5000,
          cryptoName: 'Ethereum',
          status: 'Pending',
        },
        {
          ref: 'C2314',
          date: '2024-12-02',
          amount: 3000,
          cryptoName: 'Bitcoin',
          status: 'Rejected',
        },
        {
          ref: 'C2315',
          date: '2024-12-01',
          amount: 2000,
          cryptoName: 'Dogecoin',
          status: 'Approved',
        },
        {
          ref: 'C2316',
          date: '2024-11-30',
          amount: 1500,
          cryptoName: 'Ethereum',
          status: 'Approved',
        },
      ],
      mycrypto: [
        {
          id: 1,
          amount: 1000,
          cryptoName: 'Bitcoin',
          qtt: '12',
        },
        {
          id: 2,
          amount: 10300,
          cryptoName: 'Dogecoin',
          qtt: '13',
        },
        {
          id: 3,
          amount: 4500,
          cryptoName: 'Ethereum',
          qtt: '14',
        },
      ],
    }
  },
  methods: {
    formatAmount(amount) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
    },
    openTransactionModal(type) {
      this.transactionType = type === "depot" ? "Dépôt" : "Retrait";
      this.solde = "";
      this.errorMessage = "";
      this.showTransactionModal = true;
    },
    closeTransactionModal() {
      this.showTransactionModal = false;
    },
    proceedToConfirmation() {
      if (!this.solde || this.solde <= 0) {
        this.errorMessage = "Veuillez entrer un montant valide.";
        return;
      }
      this.showTransactionModal = false;
      this.showConfirmationModal = true;
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
</style>
