<template>
  <div class="vente-container">
    <h1>Vente de Cryptomonnaies</h1>
    <form @submit.prevent="vendreCryptos">
      <!-- Générer les inputs uniquement pour les cryptos détenues -->
      <div v-for="crypto in userCryptos" :key="crypto.symbol" class="crypto-row">
        <label :for="'crypto-' + crypto.symbol">
          {{ crypto.name }} ({{ crypto.price.toLocaleString() }} USD/unité) - 
          Quantité disponible : {{ crypto.quantiteDisponible }}
        </label>
        <input
          :id="'crypto-' + crypto.symbol"
          type="number"
          v-model.number="crypto.quantiteAVendre"
          :max="crypto.quantiteDisponible"
          min="0"
          placeholder="Quantité à vendre"
        />
      </div>
      <button type="submit">Vendre</button>
    </form>

    <!-- Message de confirmation -->
    <div v-if="message" class="message">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Liste des cryptos détenues par l'utilisateur
      userCryptos: [
        { name: "Bitcoin", symbol: "btc", price: 30000, quantiteDisponible: 2, quantiteAVendre: 0 },
        { name: "Ethereum", symbol: "eth", price: 2000, quantiteDisponible: 5, quantiteAVendre: 0 },
        { name: "Litecoin", symbol: "ltc", price: 100, quantiteDisponible: 10, quantiteAVendre: 0 },
        { name: "Ripple", symbol: "xrp", price: 0.5, quantiteDisponible: 1000, quantiteAVendre: 0 },
        { name: "Cardano", symbol: "ada", price: 0.4, quantiteDisponible: 500, quantiteAVendre: 0 },
      ],
      message: null, // Message de confirmation
    };
  },
  methods: {
    vendreCryptos() {
      // Filtrer les cryptos avec une quantité à vendre > 0
      const ventes = this.userCryptos
        .filter((crypto) => crypto.quantiteAVendre > 0)
        .map((crypto) => {
          if (crypto.quantiteAVendre > crypto.quantiteDisponible) {
            this.message = `Erreur : Vous essayez de vendre plus que ce que vous possédez pour ${crypto.name}.`;
            return null;
          }

          const total = crypto.quantiteAVendre * crypto.price;
          crypto.quantiteDisponible -= crypto.quantiteAVendre; // Met à jour la quantité disponible
          crypto.quantiteAVendre = 0; // Réinitialise l'input
          return `${crypto.quantiteAVendre} unités de ${crypto.name} vendues pour un total de ${total.toLocaleString()} USD`;
        });

      // S'assurer qu'il y a des ventes valides
      if (ventes.length === 0 || ventes.every((vente) => vente === null)) {
        this.message = "Veuillez entrer une quantité valide à vendre pour au moins une cryptomonnaie.";
        return;
      }

      // Afficher le récapitulatif des ventes
      this.message = `Vente réussie! Vous avez vendu :\n${ventes.join("\n")}`;
    },
  },
};
</script>

<style>
.vente-container {
  margin: 0 auto;
  max-width: 600px;
  font-family: Arial, sans-serif;
}

.crypto-row {
  margin-top: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
}

button {
  width: 100%;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.message {
  margin-top: 20px;
  padding: 10px;
  background-color: #e9ffe9;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  color: #155724;
  white-space: pre-wrap;
}
</style>
