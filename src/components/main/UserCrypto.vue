<template>
    <div class="user-crypto-container">
      <h2>Portefeuille de {{ username }}</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Nom de la Crypto</th>
            <th>Quantité</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="crypto in cryptos" :key="crypto.name">
            <td>{{ crypto.name }}</td>
            <td>{{ crypto.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Exemple de données (vous pouvez les remplacer par des données dynamiques plus tard)
  const username = ref("John Doe");
  const cryptos = ref([
    { name: "Bitcoin", amount: 1.5 },
    { name: "Ethereum", amount: 10 },
    { name: "Cardano", amount: 1000 },
  ]);
  </script>
  
  <style scoped>
  .user-crypto-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
    text-align: center;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  
  .table th, .table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  .table th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  </style>
  