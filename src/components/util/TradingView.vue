<template>
  <div id="chart" ref="chart" style="width: 100%; height: 400px"></div>
</template>

<script>
import UtilClass from '@/util/UtilClass'
import { createChart } from 'lightweight-charts'

export default {
  name: 'TradingView',
  props: {
    idCrypto: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.initChart()
  },
  methods: {
    handleResize() {
      if (this.chart) {
        this.chart.resize(this.$refs.chart.offsetWidth, this.$refs.chart.offsetHeight)
      }
    },
    async fetchInitialData() {
      try {
        const response = await fetch(
          UtilClass.BACKEND_BASE_URL + `/crypto/cour/${this.idCrypto}?limit=2000`,
        )
        const data = await response.json()
        const initialData = data.data.map((item) => ({
          time: new Date(item.date_changement).getTime() / 1000,
          value: item.valeur,
        }))
        this.lineSeries.setData(initialData)
      } catch (error) {
        console.error('Erreur lors de la récupération des données initiales :', error)
      }
    },
    async initChart() {
      this.chart = createChart(this.$refs.chart, {
        width: this.$refs.chart.offsetWidth,
        height: this.$refs.chart.offsetHeight,
        layout: {
          background: { color: 'transparent' },
          textColor: '#DDD',
        },
        grid: {
          vertLines: { color: 'transparent' },
          horzLines: { color: 'transparent' },
        },
        crosshair: {
          vertLine: {
            color: '#575757',
            width: 1,
            style: 0,
          },
          horzLine: {
            color: '#575757',
            width: 1,
            style: 0,
          },
        },
      })

      this.lineSeries = this.chart.addLineSeries({
        color: '#ffc107',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        lastValueVisible: true,
        priceLineVisible: true,
      })

      this.fetchInitialData()
      this.connectWebSocket()

      window.addEventListener('resize', this.handleResize)
    },

    connectWebSocket() {
      this.socket = new WebSocket(UtilClass.BACKEND_SOCKET_BASE_UR + '/ws/crypto')
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        const selectedCrypto = data.find(
          (crypto) => crypto.crypto.id_crypto === parseInt(this.idCrypto),
        )
        this.updateChartData(selectedCrypto)
      }
      this.socket.onopen = () => {
        console.log('WebSocket connecté')
      }
      this.socket.onclose = () => {
        console.log('WebSocket déconnecté')
      }
    },

    updateChartData(data) {
      const updatedData = {
        time: new Date(data.date_changement).getTime() / 1000,
        value: data.valeur,
      }
      this.lineSeries.update(updatedData)
    },
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close()
    }
    if (this.chart) {
      this.chart.remove()
    }
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style scoped>
#chart {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}
</style>
