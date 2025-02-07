<script setup>
  import flatpickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/themes/dark.css'; 
  const config = {
    enableTime: true,       
    dateFormat: "d-m-Y H:i", 
    time_24hr: true,        
  };
</script>
<template>
    <div>
      <div class="col-md-12 d-flex flex-column flex-sm-row p-3 justify-content-between align-items-center" >
        <h3 style="color: #fdf8f8; font-weight: 700;">
          <i class="bi bi-calendar2-check"></i> Portfolio Summary
        </h3>
        <div class="date-inputs" style="display: flex; gap: 10px; align-items: center; margin-top: 1rem;">
          <flatpickr
            v-model="endDate"
            :config="config"
            class="form-control small-datetime dark-picker"
            placeholder="Date max"
          />
          <button @click="handleDateChange" class="btn  btn-sm btn-outline-warning">
            <i class="bi bi-funnel"></i> Filter
          </button>
        </div>
      </div>
      
      <div class="table-container table-responsive" style="width: 90%; margin: auto;">
        <table v-if="transactions.length" class="table table-dark tba">
          <thead>
            <tr>
              <th>User</th>
              <th>Total Purchase</th>
              <th>Total Sale</th>
              <th>Wallet Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="summary in transactions" :key="summary.user.id_utilisateur">
              <td>
                <img
                  :src="getUserLogo(summary.user.imageUrl)"
                  alt="User Photo"
                  width="40"
                  height="40"
                  class="me-2"
                  style="border-radius: 5px; cursor: pointer;"
                />
                <span>{{ summary.user.nom }}</span>
              </td>
              <td>{{ formatCurrency(summary.totalAchat) }}</td>
              <td>{{ formatCurrency(summary.totalVente) }}</td>
              <td>{{ formatCurrency(summary.portfolioValue) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center my-5">
          <div class="icon-container">
            <i class="bi bi-file-earmark fs-1 text-secondary"></i>
          </div>
          <p class="mt-3">No transactions are available for the selected dates ! </p>
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
  
    </div>
  </template>
  
  <script>
    import UtilClass from '@/util/UtilClass'
    import axios from 'axios'
    export default {
      name: 'PortfolioSummary',
      data() {
        return {
          transactions: [],
          endDate: '',
          errorMessage: '',
          modalInstance: null,
        }
      },
      async created() {
        this.getTransactionsData(null);
      },
      methods: {
        handleDateChange(selectedDates) {
          // mettez à jour endDate avec la date sélectionnée
          this.endDate = selectedDates[0] ? selectedDates[0].toISOString() : null;
          // Appliquer le filtre
          this.applyFilter();
        },
        async applyFilter() {
          if (this.endDate) {
            const formattedDate = this.endDate ? this.endDate : new Date().toISOString();
            const url = `${UtilClass.BACKEND_BASE_URL}/crypto/user/transactions?date=${encodeURIComponent(formattedDate)}`;
          
            this.getTransactionsData(url);
          } else {
            this.getTransactionsData(null);
          }
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
              this.endDate=null
            } else {
              throw new Error(data.message || 'Error retrieving user information')
            }
          } catch (error) {
            console.error(error)
          }
        },
        getUserLogo(logo) {
          if (!logo || parseInt(logo) === 0) {
            return '/assets/images/default-logo.jpg';
          }
          return logo;
        },
        formatCurrency(value) {
          return UtilClass.formatCurrency(value);
        },
        showErrorModal() {
          this.modalInstance = new bootstrap.Modal(document.getElementById('errorModal'));
          this.modalInstance.show();
        },
      },
    };
  </script>
  
  <style scoped>
  
  
  .date-inputs input.small-datetime {
    width: 150px !important;
    font-size: 14px;
    padding: 5px;
    background-color: transparent;
    color: #fff;
    border: 1px solid #686868;
    border-radius: 5px;
  }
  
  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
  
  .table {
    margin: 0 auto;
    width: 100%;
  }
  
  .table th,
  .table td {
    padding: 10px;
    vertical-align: middle;
  }
  
  .table tbody tr:hover {
    background: rgba(0, 0, 0, 0.5);
    transition: background 0.3s ease;
  }
 
  
  .btn-outline-warning {
    font-weight: 600;
  }
  
  .modal-content {
    background-color: #181a20;
    color: #ffffff;
    border: none;
  }
  
  .modal-header {
    border-bottom: 1px solid #444;
  }
  
  .modal-footer {
    border-top: 1px solid #444;
  }
  
  .alert-warning {
    color: #ffda6a !important;
    background-color: #332701 !important;
    border-color: #997404 !important;
  }
    
  .dark-picker {
    background-color: black;
    color: white;
    border: 1px solid #444;
  }
  .flatpickr-day.selected{
    background: #ffc107;
    border-color: #ffc107;
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
    color: #ffffffa1!important;
  }
 
  </style>
  