<template>
  <div class="row" style="width: 90%; margin: auto; margin-top: 2rem; margin-bottom: 2rem">
    <h2 style="color: #fdf8f8; font-weight: 700;"><i class="bi bi-calendar2-check"></i> Transaction History</h2>
  </div>
  <div class="row" style="width: 90%; margin: auto; margin-top: 2rem; margin-bottom: 2rem">
    <div class="col-md-10">
      <div class="row">
        <div class="col-md-6">
          <div>
            <VueSelect
              v-if="userOptions"
              v-model="selectedUser"
              :options="userOptions"
              label="label"
              item-value="value"
              item-text="label"
              :clearable="false"
              placeholder="Choose Users"
            >
              <template #value="{ option }">
                <div class="custom-value d-flex align-items-center">
                  <img
                    :src="option.logo"
                    alt="crypto logo"
                    class="me-2 img-responsive"
                    width="24"
                    height="24"
                  />
                  <h5 style="margin: 0" class="crypto-text">
                    <span style="color: #fff">{{ option.label }}</span>
                  </h5>
                </div>
              </template>

              <template #option="{ option }">
                <div class="d-flex align-items-center">
                  <img
                    :src="option.logo"
                    alt="crypto logo"
                    width="24"
                    height="24"
                    class="me-2"
                  />
                  <span>{{ option.label }}</span>
                </div>
              </template>
            </VueSelect>
            <div class="wait" v-else>
              <LoaderV style="height: 30px"></LoaderV>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div>
            <VueSelect
              v-if="cryptoOptions"
              v-model="selectedCrypto"
              :options="cryptoOptions"
              label="label"
              item-value="value"
              item-text="label"
              :clearable="false"
              placeholder="Choose crypto"
            >
              <template #value="{ option }">
                <div class="custom-value d-flex align-items-center">
                  <img
                    :src="'/assets/images/logo/' + option.unit + '.png'"
                    alt="crypto logo"
                    class="me-2 img-responsive"
                    width="24"
                    height="24"
                  />
                  <h5 style="margin: 0" class="crypto-text">
                    {{ option.unit }} <span style="color: #b2b2b2">{{ option.label }}</span>
                  </h5>
                </div>
              </template>

              <template #option="{ option }">
                <div class="d-flex align-items-center">
                  <img
                    :src="'/assets/images/logo/' + option.unit + '.png'"
                    alt="crypto logo"
                    width="24"
                    height="24"
                    class="me-2"
                  />
                  <span>{{ option.label }}</span>
                </div>
              </template>
            </VueSelect>
            <div class="wait" v-else>
              <LoaderV style="height: 30px"></LoaderV>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-2">
      <div class="row h-50">
        <div class="col-md-12">
          <button type="button" @click="filterData()" class="btn btn-outline-warning w-100 bt"><i class="bi bi-funnel"></i> Filter</button>
        </div>
      </div>
      <div class="row h-50">
        <div class="col-md-12 d-flex flex-column" style="height: 100%;">
          <button type="button" @click="sync()" class="btn btn-outline-warning w-100 mt-auto bt sync">
            <i class="bi bi-arrow-clockwise"></i> Sync
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="table-container">
      <div class="table-responsive">
        <table v-if="transactions.length" class="table table-dark tba" style="width: 90%">
          <thead>
          <tr>
            <th scope="col">User</th>
            <th scope="col">Crypto</th>
            <th scope="col">Total</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Type</th>
            <th scope="col">Commission</th>
            <th scope="col">Date</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id_transaction_crypto">
            <td>
              <img
                :src="getUserLogo(transaction.utilisateur.imageUrl)"
                alt="logo"
                width="20"
                class="me-2"
              />
              <span class="unit">{{ transaction.utilisateur.nom }}</span>
            </td>
            <td>
              <img
                :src="'/assets/images/logo/' + transaction.crypto.unit_nom + '.png'"
                alt="Bitcoin"
                width="20"
                class="me-2"
              />
              <span class="unit">{{ transaction.crypto.nom }}</span>
            </td>
            <td class="unit">{{ formatCurrency(transaction.total_with_commission) }}</td>
            <td class="unit">{{ formatCurrency(transaction.cour) }}</td>
            <td class="unit">{{ transaction.qtty }}</td>
            <td>
              <div :class="getStatusBadgeClass(transaction.type.etat)">
                {{ getStatusText(transaction.type.etat) }}
              </div>
            </td>
            <td class="unit">{{ transaction.commission }}%</td>
            <td class="unit">{{ formatDateTime(transaction.date_action) }}</td>
          </tr>
          </tbody>
        </table>
        <div v-else class="text-center my-5">
          <div class="icon-container">
            <i class="bi bi-file-earmark fs-1 text-secondary"></i>
          </div>
          <p class="mt-3">Transaction history is empty !</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal d'erreur -->
  <div id="errorModal" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-warning">Warning</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-warning">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ errorMessage }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UtilClass from '@/util/UtilClass'
import { ref } from 'vue'
import VueSelect from 'vue3-select-component'
import axios from 'axios'
import * as bootstrap from 'bootstrap'
import LoaderV from '@/components/util/LoaderV.vue'

export default {
  name: 'HistoryView',
  components: { LoaderV, VueSelect },
  data() {
    return {
      transactions: [],
      selectedCrypto: ref(null),
      selectedUser: ref(null),
      cryptoOptions: null,
      userOptions: null,
      modalInstance: ref(null),
      errorMessage: ref(""),
    }
  },
  async created() {
    this.getTransactionsData(null)
    await this.fetchCryptoOptions()
    await this.fetchUserOptions()
  },
  methods: {
    showErrorModal() {
      this.modalInstance = new bootstrap.Modal(document.getElementById('errorModal'));
      this.modalInstance.show();
    },
    sync() {
      this.getTransactionsData(null)
    },
    filterData() {
      let url = UtilClass.BACKEND_BASE_URL + "/crypto/user/transactions";

      if (this.selectedUser || this.selectedCrypto) {
        let params = [];
        if (this.selectedUser) {
          params.push("idu=" + this.selectedUser);
        }
        if (this.selectedCrypto) {
          params.push("idc=" + this.selectedCrypto);
        }

        if (params.length > 0) {
          url += "?" + params.join("&");
        }

        console.log(url)
        this.getTransactionsData(url);
      } else {
        this.errorMessage = 'Select user or crypto to filter';
        this.showErrorModal();
      }
    },
    formatDateTime(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      date.setHours(date.getHours());
      return date.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
    async fetchCryptoOptions() {
      try {
        const token = UtilClass.getLocalToken()
        const response = await axios.get(UtilClass.BACKEND_BASE_URL + '/crypto', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.cryptoOptions = response.data.data.map((crypto) => ({
          value: crypto.id_crypto,
          label: crypto.nom,
          unit: crypto.unit_nom,
        }))
      } catch (error) {
        console.error('Error recovering crypto:', error)
      }
    },
    async fetchUserOptions() {
      try {
        const token = UtilClass.getLocalToken()
        const response = await axios.get(UtilClass.BACKEND_BASE_URL + '/crypto/user/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.userOptions = response.data.data.map((user) => ({
          value: user.id_utilisateur,
          label: user.nom,
          logo: this.getUserLogo(user.imageUrl)
        }))
      } catch (error) {
        console.error('Error recovering crypto:', error)
      }
    },
    getUserLogo(logo) {
      console.log(logo)
      if (!logo || parseInt(logo) === 0) {
        return '/assets/images/default-logo.jpg'
      }
      return logo
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    },
    formatCurrency(value) {
      return UtilClass.formatCurrency(value)
    },
    getStatusBadgeClass(status) {
      if (status === 'down') {
        return 'badge badge-success'
      }

      return 'badge badge-warning'
    },

    getStatusText(status) {
      if (status === 'down') {
        return 'sell'
      }

      return 'buy'
    },
    async getTransactionsData(url) {
      try {
        const uri = (url) ? url : UtilClass.BACKEND_BASE_URL + '/crypto/user/transactions';
        const response = await fetch(uri, {
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
          this.transactions = data.data
        } else {
          throw new Error(data.message || 'Error retrieving user information')
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>


<style scoped>
.v-select .vs__dropdown-toggle {
  display: flex;
  align-items: center;
}

.v-select .vs__dropdown-option img {
  margin-right: 8px;
}

:deep(.vue-select .custom-value) {
  display: flex;
  align-items: center;
  gap: 6px;
}

:deep(.vue-select .custom-option) {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #171717;
  font-weight: 500;
  font-size: 16px;
}

:deep(.vue-select .custom-option small) {
  color: #525252;
  font-weight: 500;
  font-size: 14px;
}

:deep(.single-value) {
  color: #fff !important;
  flex-direction: column;
}

:deep(.control) {
  border-radius: 10px !important;
  border: solid 1px #686868 !important;
  height: 6rem;
}

:deep(.search-input) {
  color: #fff !important;
  position: absolute !important;
  width: 100% !important;
}

:deep(.no-results) {
  color: #fff !important;
}

h4 {
  margin-top: 16px;
  font-weight: 700;
  color: white;
  text-align: left;
  margin-bottom: 10px;
}


.table {
  margin: 0 auto;
  width: 100%;
}

.badge {
  padding: 0.5em 1em;
  border-radius: 0.25rem;
}
.badge-success {
  color: #28a745;
  border: 1px solid #28a745;
}
.badge-warning {
  color: #ffc107;
  border: 1px solid #ffc107;
}
.badge-danger {
  color: #dc3545;
  border: 1px solid #dc3545;
}


.table-dark {
  --bs-table-bg: transparent !important;
  --bs-table-color: inherit !important;
}

.unit {
  font-weight: 600;
  color: #fdf8f8;
}

.table th,
.table td {
  padding: 10px;
}

.table tbody tr {
  height: initial;
}

.table-container {
  position: relative;
  padding: 0 20px;
}

th {
  font-weight: bold;
}

td {
  min-width: 100px;
}


/* Responsive styles */
@media (max-width: 768px) {
  .table-container {
    padding: 0 10px;
  }

  .table th,
  .table td {
    font-size: 12px;
    padding: 5px;
  }

  h4 {
    font-size: 16px;
  }

  .icon-container {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: transparent; /* Couleur de fond claire */
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin: auto;
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

.alert-warning {
  --bs-alert-color: #ffda6a !important;
  --bs-alert-bg: #332701 !important;
  --bs-alert-border-color: #997404 !important;
}

.bt {
  font-weight: 600;
}

.sync {
  border-color: #8c8c8c !important;
  color: #f7f8f9;
}

.sync:hover {
  background-color: #f7f8f9;
  color: #1a1c1c;
}

.wait {
  border: 1px solid rgb(105 104 104);
  border-radius: 10px;
  height: 6rem;
  display: flex;
  align-items: center;
}
</style>
