<script setup>
  import flatpickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/themes/dark.css'; 
  const config = {
    enableTime: true,       
    dateFormat: "d-m-Y H:i", 
    time_24hr: true,
    altFormat: "d-m-Y H:i", 
    altInput: true,
      
  };
</script>

<template>
  <div class="row" style="width: 90%; margin: auto; margin-top: 2rem; margin-bottom: 2rem">
    <h2 style="color: #fdf8f8; font-weight: 700;"><i class="bi bi-calendar2-check"></i> Transaction History</h2>
  </div>
  <div class="row mb-2" style="width: 90%; margin: auto;">
    <div class="col-md-10">
      <div class="row">
        <div class="col-md-6 mb-2" >
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
        <div class="col-md-6 mb-2">
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
    <div class="col-md-2 mb-2"  >
      <div class="row h-50 ">
        <div class="col-md-12 ">
          <button type="button" @click="filterData()" class="btn btn-outline-warning w-100 bt"><i class="bi bi-funnel"></i> Filter</button>
        </div>
      </div>
      <div class="row h-50 ">
        <div class="col-md-12 d-flex flex-column" style="height: 100%;">
          <button type="button" @click="sync()" class="btn btn-outline-warning w-100 mt-auto bt sync">
            <i class="bi bi-arrow-clockwise"></i> Sync
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="row ">
    <div class="input-group d-flex align-items-center justify-content-between mt-3 mb-4" style="width:88%; margin: auto;">
      <div class="filter-header ml-3" style="flex-grow: 1; color: #f0f0f0;"></div>
      <div class="date-inputs d-flex  gap-2 mb-2 ">
        <flatpickr
          v-model="startDate"
          :config="config"
          class="form-control small-datetime dark-picker"
          @change="handleDateChange"
          placeholder=" Date Min "
        />
        <flatpickr
          v-model="endDate"
          :config="config"
          class="form-control small-datetime dark-picker"
          @change="handleDateChange"
          placeholder="Date Max"
        />
        <label class="switch">
          <input type="checkbox" v-model="filterActive" @change="handleToggle">
          <span class="slider"></span>
        </label>

      </div>
    </div>

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
          <tr v-for="transaction in filteredTransactions" :key="transaction.id_transaction_crypto">
            <td>
              <img
                :src="getUserLogo(transaction.utilisateur.imageUrl)"
                alt="logo"
                width="40"
                height="40"
                class="me-2"
                style="border-radius: 5px; cursor: pointer"
                @click="filterByUser(transaction.utilisateur)"
              />
              <span class="unit cursor-pointer" @click="filterByUser(transaction.utilisateur)">
                {{ transaction.utilisateur.nom }}
              </span>
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
      filterActive: false,
      transactions: [],
      filteredTransactions: [],
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
    this.addHeader("History for all")
  },
  methods: {
      handleToggle() {
        if (!this.filterActive) {
          this.resetDates();
        }
      },
      handleDateChange() {
        if (this.filterActive) {
          this.filterTransactions();
        }
      },
      resetDates() {
        this.startDate = null;
        this.endDate = null;
        this.filteredTransactions = [...this.transactions];
      },
      filterTransactions() {
        let filtered = [...this.transactions];
        if (this.startDate) {
          let start = new Date(this.startDate);
          filtered = filtered.filter(transaction => new Date(transaction.date_action) >= start);
        }
        if (this.endDate) {
          let end = new Date(this.endDate);
          filtered = filtered.filter(transaction => new Date(transaction.date_action) <= end);
        }
        this.filteredTransactions = filtered;
      },
    showErrorModal() {
      this.modalInstance = new bootstrap.Modal(document.getElementById('errorModal'));
      this.modalInstance.show();
    },
    sync() {
      this.getTransactionsData(null);
      this.addHeader("History for all");
      this.resetDates();
    },
    filterData() {
      let url = UtilClass.BACKEND_BASE_URL + "/crypto/user/transactions";
      let filterHeader =  "History for ";

      if (this.selectedUser || this.selectedCrypto) {
        let params = [];
        if (this.selectedUser) {
          params.push("idu=" + this.selectedUser);
          const user = this.userOptions.find(user => user.value === this.selectedUser);
          filterHeader += "user "+ user.label + " ";
        }
        if (this.selectedCrypto) {
          params.push("idc=" + this.selectedCrypto);
          if (this.selectedUser) {
            filterHeader += "and ";
          }
          const crypto = this.cryptoOptions.find(crypto => crypto.value === this.selectedCrypto);
          filterHeader += "crypto "+ crypto.label;
        }

        if (params.length > 0) {
          url += "?" + params.join("&");
        }

        this.getTransactionsData(url);
        this.addHeader(filterHeader);
      } else {
        this.errorMessage = 'Select user or crypto to filter';
        this.showErrorModal();
      }
    },
    filterByUser(utilisateur) {
      let url = UtilClass.BACKEND_BASE_URL + "/crypto/user/transactions";
      url += "?idu=" + utilisateur.id_utilisateur;
      this.getTransactionsData(url);
      this.addHeader("History for user " + utilisateur.nom);
    },
    addHeader(text) {
      const headerContainer = document.querySelector('.filter-header');
      if (headerContainer) {
        headerContainer.innerHTML = `<h4>👁️${text}</h4>`;
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
          this.filteredTransactions = [...this.transactions];
          this.resetDates();
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

.table tbody td {
  vertical-align: middle;
}

.table tbody tr {
  transition: background 0.3s ease;
}

.table tbody tr:hover {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    background-color: transparent; 
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin: auto;
  }
}

.modal-content {
  background-color: #434343;
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

.cursor-pointer{
  cursor: pointer;
}



input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(1); 
    cursor: pointer;
}


.switch {
 font-size: 17px;
 position: relative;
 display: inline-block;
 width: 3.7em;
 height: 1.8em;
}

.switch input {
 display: none;
 opacity: 0;
 width: 0;
 height: 0;
}

.slider {
 position: absolute;
 cursor: pointer;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background-color: #434343;
 transition: .2s;
 border-radius: 30px;
}

.slider:before {
 position: absolute;
 content: "";
 height: 1.4em;
 width: 1.4em;
 border-radius: 20px;
 left: 0.2em;
 bottom: 0.2em;
 background-color: #aeaaae;
 transition: .4s;
}

input:checked + .slider::before {
 background-color: #ffc107;
}

input:checked + .slider {
 background-color: #434343;
}

input:focus + .slider {
 box-shadow: 0 0 1px #434343;
}

input:checked + .slider:before {
 transform: translateX(1.9em);
}

.dark-picker {
  background-color: black;
  color: white;
  border: 1px solid #444;
}
:deep(.flatpickr-day.selected){
  background: #ffc107 !important ;
  border-color: #ffc107 !important;
}

.small-datetime {
  width: 150px !important;
  font-size: 14px; 
  padding: 5px; 
  margin-right: 5px;
  background-color: transparent;
  color: #fff;
}

.flatpickr-input::placeholder {
  color: #fff!important;
}



</style>
