<script setup lang="ts">
const transactions = [
  { username: "Alice", cryptoName: "Bitcoin", type: "Achat", currency: 500 },
  { username: "Bob", cryptoName: "Ethereum", type: "Vente", currency: 400 },
  { username: "Charlie", cryptoName: "Cardano", type: "Achat", currency: 300 },
];
</script>

<template>
  <div class="crypto-table-container">
    <h2>Transactions Crypto</h2>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Nom d'utilisateur</th>
          <th>Nom Crypto</th>
          <th>Type</th>
          <th>Monnaie</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction, index) in transactions" :key="index">
          <td>{{ transaction.username }}</td>
          <td>{{ transaction.cryptoName }}</td>
          <td>{{ transaction.type }}</td>
          <td>{{ transaction.currency }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
