<template>
  <div class="achat-container">
    <h1>Achat de Cryptomonnaies</h1>
    <form @submit.prevent="acheterCryptos">
      <!-- Générer les inputs pour chaque crypto -->
      <div v-for="crypto in cryptos" :key="crypto.symbol" class="crypto-row">
        <label :for="'crypto-' + crypto.symbol">
          {{ crypto.name }} ({{ crypto.price.toLocaleString() }} USD/unité) :
        </label>
        <input
          :id="'crypto-' + crypto.symbol"
          type="number"
          v-model.number="crypto.quantite"
          min="0"
          placeholder="Quantité à acheter"
        />
      </div>
      <button type="submit">Acheter</button>
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
      // Liste des cryptomonnaies disponibles
      cryptos: [
        { name: "Bitcoin", symbol: "btc", price: 30000, quantite: 0 },
        { name: "Ethereum", symbol: "eth", price: 2000, quantite: 0 },
        { name: "Litecoin", symbol: "ltc", price: 100, quantite: 0 },
        { name: "Ripple", symbol: "xrp", price: 0.5, quantite: 0 },
        { name: "Cardano", symbol: "ada", price: 0.4, quantite: 0 },
        { name: "Polkadot", symbol: "dot", price: 5, quantite: 0 },
        { name: "Solana", symbol: "sol", price: 20, quantite: 0 },
        { name: "Binance Coin", symbol: "bnb", price: 300, quantite: 0 },
        { name: "Dogecoin", symbol: "doge", price: 0.07, quantite: 0 },
        { name: "Shiba Inu", symbol: "shib", price: 0.00001, quantite: 0 },
      ],
      message: null, // Message de confirmation
    };
  },
  methods: {
    acheterCryptos() {
      // Filtrer les cryptos avec une quantité > 0 et calculer les totaux
      const achats = this.cryptos
        .filter((crypto) => crypto.quantite > 0)
        .map((crypto) => {
          const total = crypto.quantite * crypto.price;
          return `${crypto.quantite} unités de ${crypto.name} pour un total de ${total.toLocaleString()} USD`;
        });

      // Afficher un message si aucune crypto n'est sélectionnée
      if (achats.length === 0) {
        this.message = "Veuillez entrer une quantité à acheter pour au moins une cryptomonnaie.";
        return;
      }

      // Afficher le récapitulatif des achats
      this.message = `Achat réussi! Vous avez acheté :\n${achats.join("\n")}`;

      // Réinitialiser les quantités après achat
      this.cryptos.forEach((crypto) => (crypto.quantite = 0));
    },
  },
};
</script>

<style>
.achat-container {
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
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
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
