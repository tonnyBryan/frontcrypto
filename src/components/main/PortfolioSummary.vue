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
    
    <div class="col-md-12 d-flex flex-column flex-sm-row  justify-content-between align-items-center" >
      <h3 style="color: #fdf8f8; font-weight: 700;">
        <i class="bi bi-ui-checks-grid"></i> Portfolio Summary
      </h3>
      <div class="date-inputs" style="display: flex; gap: 10px; align-items: center; ">
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
    
    <div class="table-responsive mt-3 ">
      <div class="table table-dark tba" >
        <table v-if="transactions" class="table table-dark tba">
          <thead>
            <tr>
              <th>User</th>
              <th>Total Purchase</th>
              <th>Total Sale</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="summary in transactions" :key="summary.utilisateur.id_utilisateur">
              <td>
                <img
                  :src="getUserLogo(summary.utilisateur.imageUrl)"
                  alt="User Photo"
                  width="40"
                  height="40"
                  class="me-2 "
                  style="border-radius: 5px; cursor: pointer;"
                />
                <span class="unit">{{ summary.utilisateur.nom }}</span>
              </td>
              <td class="unit">{{ formatCurrency(summary.total_achat) }}</td>
              <td class="unit">{{ formatCurrency(summary.total_vente) }}</td>
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
    export default {
      name: 'PortfolioSummary',
      data() {
        return {
          transactions:null,
          endDate: '',
          errorMessage: '',
          modalInstance: null,
        }
      },
      async created() {
        this.getTransactionsData(null);
      },
      methods: {
        handleDateChange() {
          this.applyFilter();
        },
        async applyFilter() {
          if (this.endDate) {
            const url = `${UtilClass.BACKEND_BASE_URL}/crypto/user/transactions/group?date=${encodeURIComponent(this.endDate)}`;
            this.getTransactionsData(url);
          } else {
            this.getTransactionsData(null);
          }
        },
        async getTransactionsData(url) {
          try {
            const uri = (url) ? url : UtilClass.BACKEND_BASE_URL + '/crypto/user/transactions/group';
            const response = await fetch(uri, {
              method: 'GET',
              headers: {
                Authorization: 'Bearer ' + UtilClass.getLocalToken(),
                'Content-Type': 'application/json',
              },
            })
            const data = await response.json()

            if (!response.ok) {
              // if (UtilClass.isInvalidTokenError(data)) {
              //   UtilClass.removeLocalToken()
              //   this.$router.push('/app/login')
              // }
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
    margin: 20px auto;
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
  }

  th {
    font-weight: bold;
  }

  td {
    min-width: 100px;
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
