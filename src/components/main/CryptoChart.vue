<template>
  <div>
    <h2>Real-time Crypto Price Changes</h2>
    <apexchart type="line" :options="chartOptions" :series="chartSeries" height="350" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import ApexCharts from 'vue3-apexcharts'

export default {
  components: {
    apexchart: ApexCharts,
  },
  setup() {
    const chartSeries = ref([])

    const chartOptions = ref({
      chart: {
        id: 'crypto-chart',
        type: 'line',
        zoom: {
          enabled: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
        background: '#1e1e2f', // Couleur de fond pour le mode sombre
        foreColor: '#e0e0e0', // Couleur des textes et des axes
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'HH:mm:ss',
        },
        tickAmount: 10,
        axisBorder: {
          color: '#444', // Couleur des bordures de l'axe X
        },
        axisTicks: {
          color: '#444', // Couleur des ticks de l'axe X
        },
      },
      yaxis: {
        title: {
          text: 'Price',
          style: {
            color: '#e0e0e0', // Couleur du titre de l'axe Y
          },
        },
        labels: {
          style: {
            colors: '#e0e0e0', // Couleur des valeurs sur l'axe Y
          },
          formatter: (value) => {
            return value.toFixed(2)
          },
        },
      },
      title: {
        text: 'Crypto Prices in Real-Time',
        align: 'center',
        style: {
          color: '#e0e0e0', // Couleur du titre
        },
      },
      stroke: {
        curve: 'smooth',
        colors: ['#00bcd4'], // Couleur des courbes
      },
      markers: {
        size: 0,
      },
      grid: {
        show: true,
        borderColor: '#444', // Couleur des lignes de la grille
        row: {
          colors: ['#2c2c3e', 'transparent'], // Couleurs alternées des lignes de la grille
          opacity: 0.5,
        },
      },
      tooltip: {
        theme: 'dark', // Thème sombre pour le tooltip
        x: {
          format: 'HH:mm:ss',
        },
        y: {
          formatter: (value) => {
            return value.toFixed(2)
          },
        },
      },
    })

    const cryptoData = ref({})

    const socket = new WebSocket('ws://localhost:8080/ws/crypto')

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      data.forEach((crypto) => {
        const { id_crypto, nom } = crypto.crypto
        const value = crypto.valeur
        const timestamp = crypto.date_changement

        if (!cryptoData.value[id_crypto]) {
          cryptoData.value[id_crypto] = {
            name: nom,
            data: [],
          }
        }

        const newDataPoint = { x: timestamp, y: value }
        cryptoData.value[id_crypto].data.push(newDataPoint)

        if (cryptoData.value[id_crypto].data.length > 10) {
          cryptoData.value[id_crypto].data.shift()
        }
      })

      chartSeries.value = Object.values(cryptoData.value)
    }

    onMounted(() => {
      socket.onopen = () => {
        console.log('WebSocket connected')
      }

      socket.onclose = () => {
        console.log('WebSocket disconnected')
      }
    })

    return {
      chartSeries,
      chartOptions,
    }
  },
}
</script>

<style scoped>
h2 {
  text-align: center;
  color: #e0e0e0; /* Couleur du titre en mode sombre */
}
</style>
