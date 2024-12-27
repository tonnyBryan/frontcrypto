<template>
  <div class="card lg">
    <h4 class="card-title  yellow" style="margin-top:16px;margin-left: 10px;">{{ title }}</h4>
    <br>
    <div class="table-responsive " style="border-radius: 1%;">
      <table class="table">
        <thead>
          <tr>
            <th>Ref</th>
            <th>Date</th>
            <th>Value</th>
            <th v-if="isCrypto">Crypto</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in paginatedTransactions" :key="transaction.ref">
            <td>{{ transaction.ref }}</td>
            <td>{{ formatDate(transaction.date) }}</td>
            <td>{{ formatAmount(transaction.amount) }}</td>
            <td v-if="isCrypto">{{ transaction.cryptoName }}</td>
            <td>
              <div :class="getStatusBadgeClass(transaction.status)">
                {{ transaction.status }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
    
  name: 'TransactionTable',
  props: {
    transactions: {
      type: Array,
      required: true
    },
    isCrypto: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: null
    }
  },
  computed: {
    title() {
      return this.isCrypto ? 'Historique Transactions Crypto' : 'Historique Transactions Fonds'
    },
    paginatedTransactions() {
      return this.limit ? this.transactions.slice(0, this.limit) : this.transactions
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    },
    formatAmount(amount) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
    },
    getStatusBadgeClass(status) {
      const classes = {
        'Approved': 'badge badge-success',
        'Pending': 'badge badge-warning',
        'Rejected': 'badge badge-danger'
      }
      return classes[status] || 'badge badge-secondary'
    }
  }
}
</script>

<style scoped>
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
.table{
  background-color: #2b362e9a;
}

th {
  background-color: #f0ebebc0;
  font-weight: bold;
}
td {
  background-color: rgba(46, 43, 175, 0.466);
  color: antiquewhite;
}
</style>