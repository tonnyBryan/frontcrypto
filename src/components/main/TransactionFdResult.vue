<template>
 
    <div class="main container-fluid">
      <div class="row">
        <div class=" col-md-6 offset-md-3 black-box">

          <div v-if="details.type === 'retrait'" class="transaction-content">
            <div class="col-md-4 d-flex justify-content-center align-items-center">
              <img 
                src="@/assets/binance-logo.svg" 
                alt="Binance" 
                class="logo"
              />
            </div>
            <div class="col-md-4 text-group">
              <div class="row"><span class="type">Retrait</span></div>
              <div class="row"><span class="arrow">>>></span></div>
              <div class="row"><span class="amount">{{ formatAmount(solde) }}</span></div>
            </div>
            <div class="col-md-4 d-flex justify-content-center align-items-center ">
              <span class="dollar">$</span>
            </div>
          </div>

          <div v-else class="transaction-content">
            <div class="col-md-4 d-flex justify-content-center align-items-center ">
              <span class="dollar">$</span>
            </div>
            <div class="col-md-4 text-group">
              <div class="row"><span class="type">Depot</span></div>
              <div class="row"><span class="arrow">>>></span></div>
              <div class="row"><span class="amount">{{ formatAmount(details.solde) }}</span> </div>
            </div>
            <div class="col-md-4 d-flex justify-content-center align-items-center">
              <img 
                src="@/assets/binance-logo.svg" 
                alt="Binance" 
                class="logo"
              />
            </div>

          </div>
        </div>
      </div>
     
      <div class="row">
        <div class="balance-section">
          <div class="balance-label">Nouveau solde :</div>
          <div class="balance-amount"><h1>{{ formatAmount(details.NouveauSolde) }} <span class="unit">MGA</span> </h1></div>
        </div>
      </div>
    </div>

</template>

<script>
export default {
  props: {
      details:{
        type:Object, 
        required:true
      },
  },
  methods: {
    formatAmount(amount) {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    },
  },
};
</script>

<style scoped>


.black-box {
  background: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 4%;
  justify-content: center;
  display: flex;
}

.transaction-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
}
.unit {
  font-size: large;
  color: #cbcbcb !important;
}

.logo {
  width: 80px;
  height: 80px;
}

.text-group {
  display: flex;
  gap: 20px;
  flex-direction: column;
  text-align: center;
}

.type {
  color: #b760e3;
  font-weight: bold;
  font-size: 3.0rem;
}

.arrow {
  color: #f515e2; 
  font-weight: 900;
  font-size: 3.5rem;
}

.dollar {
  color: #1cd116;
  font-size: 5.5rem;
  font-weight: bold;
}

.amount {
  color: #b760e3;
  font-weight: bold;
  font-size: 2.5rem;
}

.balance-section {
  text-align: center;
  margin-top: 30px;
}

.balance-label {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.balance-amount {
  font-size: 32px;
  font-weight: bold;
  color: azure;
}

</style>