<template>
  <div class="main container-fluid">
    <div class="row">
      <div class="col-md-12">
        <div
          v-if="details.type === 'retrait'"
          class="card black-box animate lf"
          style="width: 100%; text-align: center; padding-top: 1rem; padding-bottom: 1.5rem"
        >
          <div class="row">
            <span class="type">Withdraw</span>
          </div>
          <div class="row justify-content-center align-items-center">
            <div class="col-sm-4 center" style="justify-content: right">
              <img src="@/assets/binance-logo.svg" alt="Binance" class="logo" />
            </div>
            <div class="col-sm-4 center">
              <span class="arrow">>>></span>
            </div>
            <div class="col-sm-4 center" style="justify-content: left">
              <span class="dollar">$</span>
            </div>
          </div>

          <div class="row">
            <span class="amount">{{ formatAmount(details.solde) }}</span>
          </div>
        </div>

        <div
          v-else
          class="card black-box animate lf"
          style="width: 100%; text-align: center; padding-top: 1rem; padding-bottom: 1.5rem"
        >
          <div class="row">
            <span class="type">Deposit</span>
          </div>
          <div class="row justify-content-center align-items-center">
            <div class="col-sm-4 center" style="justify-content: right">
              <span class="dollar">$</span>
            </div>
            <div class="col-sm-4 center">
              <span class="arrow">>>></span>
            </div>
            <div class="col-sm-4 center" style="justify-content: left">
              <img src="@/assets/binance-logo.svg" alt="Binance" class="logo" />
            </div>
          </div>

          <div class="row">
            <span class="amount">{{ formatAmount(details.solde) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="balance-section">
        <div class="balance-label">New balance:</div>
        <div class="balance-amount">
          <h1>{{ formatAmount(details.NouveauSolde) }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UtilClass from '@/util/UtilClass'

export default {
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatAmount(amount) {
      return UtilClass.formatCurrency(amount)
    },
  },
}
</script>

<style scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 33% !important;
}

.lf {
  border: solid 2px;
}

.black-box {
  background: rgba(0, 0, 0, 0.7);
}

.transaction-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
  font-size: 3rem;
}

.arrow {
  color: #e9e9e9;
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

@keyframes borderColorChange {
  0% {
    border-color: red;
  }
  25% {
    border-color: blue;
  }
  50% {
    border-color: green;
  }
  75% {
    border-color: yellow;
  }
  100% {
    border-color: purple;
  }
}

.animate {
  animation: borderColorChange 4s infinite ease-in-out;
}

@media (max-width: 480px) {
  .logo {
    width: 46px;
  }

  .arrow {
    font-size: 2rem;
  }

  .dollar {
    font-size: 3.5rem;
  }
}
</style>
