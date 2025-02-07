<template>
    <div>
      <div class="filter-section" style="width: 90%; margin: auto; margin-top: 2rem; margin-bottom: 2rem;">
        <h2 style="color: #fdf8f8; font-weight: 700;">
          <i class="bi bi-calendar2-check"></i> Portfolio Summary
        </h2>
        <div class="date-inputs" style="display: flex; gap: 10px; align-items: center; margin-top: 1rem;">
          <input
            v-model="startDate"
            type="datetime-local"
            class="form-control small-datetime"
            @change="handleDateChange"
            placeholder="Start Date"
          />
          <input
            v-model="endDate"
            type="datetime-local"
            class="form-control small-datetime"
            @change="handleDateChange"
            placeholder="End Date"
          />
          <button @click="applyFilter" class="btn btn-outline-warning">
            <i class="bi bi-funnel"></i> Filter
          </button>
        </div>
      </div>
  
   
      <div class="table-container" style="width: 90%; margin: auto;">
        <table v-if="userSummaries.length" class="table table-dark">
          <thead>
            <tr>
              <th>User</th>
              <th>Total Achat</th>
              <th>Total Vente</th>
              <th>Valeur Portefeuille</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="summary in userSummaries" :key="summary.user.id_utilisateur">
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
          <p class="mt-3">Aucune transaction n'est disponible pour les dates sélectionnées !</p>
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
  import * as bootstrap from 'bootstrap'
  
  export default {
    name: 'PortfolioSummary',
    data() {
      return {
        transactions: [],
        startDate: '', 
        endDate: '',
        errorMessage: '',
        modalInstance: null,
      }
    },
    computed: {
      filteredTransactions() {
        let filtered = this.transactions;
        if (this.startDate) {
          const start = new Date(this.startDate);
          filtered = filtered.filter((t) => new Date(t.date_action) >= start);
        }
        if (this.endDate) {
          const end = new Date(this.endDate);
          filtered = filtered.filter((t) => new Date(t.date_action) <= end);
        }
        return filtered;
      },
    
      userSummaries() {
        const summaryMap = {};
        this.filteredTransactions.forEach((t) => {
          const userId = t.utilisateur.id_utilisateur;
          if (!summaryMap[userId]) {
            summaryMap[userId] = {
              user: t.utilisateur,
              totalAchat: 0,
              totalVente: 0,
              portfolioValue: 0,
            };
          }
          if (t.type && t.type.etat === 'down') {
            summaryMap[userId].totalVente += t.total_with_commission;
          } else {
            summaryMap[userId].totalAchat += t.total_with_commission;
          }
        });
        return Object.values(summaryMap).map((s) => {
          s.portfolioValue = s.totalAchat - s.totalVente;
          return s;
        });
      },
    },
    created() {
      this.getTransactionsData();
    },
    methods: {
      handleDateChange() {
        // Optionnel : vous pouvez lancer l'actualisation automatiquement lors d'un changement
        // this.applyFilter();
      },
      applyFilter() {
        // Le filtrage s'effectue via la computed property filteredTransactions,
        // il suffit donc de mettre à jour startDate et endDate.
        // Vous pouvez ajouter ici des vérifications (ex. : startDate <= endDate)
      },
      getTransactionsData() {
        const uri = UtilClass.BACKEND_BASE_URL + '/crypto/user/transactions';
        fetch(uri, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + UtilClass.getLocalToken(),
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.success) {
              if (UtilClass.isInvalidTokenError(data)) {
                UtilClass.removeLocalToken();
                this.$router.push('/app/login');
              }
              throw new Error(data.message || 'Error retrieving transactions');
            }
            this.transactions = data.data;
          })
          .catch((error) => {
            console.error(error);
            this.errorMessage = error.message || 'Error fetching transactions';
            this.showErrorModal();
          });
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
  .filter-section h2 {
    margin-bottom: 1rem;
  }
  
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
  </style>
  