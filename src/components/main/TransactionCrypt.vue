<template>
  <div class="table-container">
    <h4>{{ title }}</h4>
    <div class="table-responsive">
      <table v-if="paginatedTransactions.length" class="table table-dark tba">
        <thead>
          <tr>
            <th scope="col" class="d-none d-sm-table-cell">Ref</th>
            <th scope="col">Crypto</th>
            <th scope="col">Rate</th>
            <th scope="col">Quantity</th>
            <th scope="col">Type</th>
            <th scope="col" class="d-none d-sm-table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in paginatedTransactions" :key="transaction.id_transaction_crypto">
            <td class="d-none d-sm-table-cell">{{ transaction.id_transaction_crypto }}</td>
            <td>
              <img
                :src="'/assets/crypto/' + transaction.crypto.logo"
                alt="Bitcoin"
                width="20"
                class="me-2"
              />
              {{ transaction.crypto.nom }}
            </td>
            <td class="unit">{{ formatCurrency(transaction.cour) }}</td>
            <td class="unit">{{ transaction.qtty }}</td>
            <td>
              <div :class="getStatusBadgeClass(transaction.type.etat)">
                {{ getStatusText(transaction.type.etat) }}
              </div>
            </td>
            <td class="d-none d-sm-table-cell">{{ formatDate(transaction.date_action) }}</td>
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
</template>

<script>
import UtilClass from '@/util/UtilClass'

export default {
  name: 'TransactionFond',
  props: {
    transactions: {
      type: Array,
      required: true,
    },
    limit: {
      type: Number,
      default: null,
    },
  },
  computed: {
    title() {
      return 'Transaction history: Crypto'
    },
    paginatedTransactions() {
      return this.limit ? this.transactions.slice(0, this.limit) : this.transactions
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    },
    formatAmount(amount) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
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
  },
}
</script>

<style scoped>
h4 {
  margin-top: 16px;
  font-weight: 700;
  color: white;
  text-align: left;
  margin-bottom: 10px;
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

.table {
  margin: 0 auto;
  width: 100%;
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
  color: rgb(161, 160, 160);
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
  color: antiquewhite;
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
</style>
