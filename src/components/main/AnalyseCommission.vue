<script setup>
import flatpickr from 'vue-flatpickr-component'
import 'flatpickr/dist/themes/dark.css'
import * as bootstrap from 'bootstrap'

const config = {
  enableTime: true,
  dateFormat: 'd-m-Y H:i',
  time_24hr: true,
}
</script>

<template>
  <div class="container mt-4">
    <h2 class="text-center text-light">Commission Analysis</h2>
    <form action="#" class="bg-dark text-light p-4 rounded shadow">
      <div class="row g-3 align-items-center">
        <div class="col-md-2">
          <select
            name="type_analyse"
            id="type_analyse"
            class="form-select bg-secondary text-light border-dark"
          >
            <option value="#">Somme</option>
            <option value="#">Moyenne</option>
            <option value="#">Quartile</option>
            <option value="#">Variance</option>
            <option value="#">Écart type</option>
          </select>
        </div>
        <div class="col-md-2">
          <select name="crypto" id="crypto" class="form-select bg-secondary text-light border-dark">
            <option value="#">all</option>
            <option value="#">Bitcoin (BTC)</option>
            <option value="#">Ethereum (ETH)</option>
            <option value="#">Binance Coin (BNB)</option>
            <option value="#">Tether (USDT)</option>
            <option value="#">Litecoin (LTC)</option>
          </select>
        </div>
        <div class="col-md-3">
          <flatpickr v-model="startDate" :config="config" class="form-control dark-picker" placeholder="Date debut"/>
        </div>
        <div class="col-md-3">
          <flatpickr v-model="endDate" :config="config" class="form-control dark-picker" placeholder="Date fin"/>
        </div>
        <div class="col-md-2 text-center">
          <button type="submit" class="btn btn-warning w-100">Filter</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.bg-dark {
  background-color: #181a20 !important;
}

.dark-picker,
.form-select {
  background-color: #1f2228 !important;
  color: #ffffffa1 !important;
  border: 1px solid #444 !important;
}

:deep(.flatpickr-day.selected) {
  background: #ffc107 !important;
  border-color: #ffc107 !important;
}
 
.flatpickr-input::placeholder {
    background-color: transparent;
    color: #ffffffa1!important;
}


</style>
