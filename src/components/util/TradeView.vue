<template>
  <div>
    <div ref="chartContainer" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script>
import UtilClass from '@/util/UtilClass'
import { createChart } from 'lightweight-charts'

export default {
  props: {
    idCrypto: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
      lineSeries: null,
      socket: null,
    }
  },
  methods: {
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

    handleResize() {
      if (this.chart) {
        this.chart.resize(
          this.$refs.chartContainer.offsetWidth,
          this.$refs.chartContainer.offsetHeight,
        )
      }
    },
  },

  mounted() {
    this.chart = createChart(this.$refs.chartContainer, {
      width: this.$refs.chartContainer.offsetWidth,
      height: this.$refs.chartContainer.offsetHeight,
      layout: {
        background: { color: 'transparent' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: 'transparent' },
        horzLines: { color: 'transparent' },
      },
      priceScale: {
        borderColor: '#555',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: '#555',
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
      priceLineVisible: true,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
    })

    this.fetchInitialData()
    this.connectWebSocket()

    window.addEventListener('resize', this.handleResize)
  },

  beforeUnmount() {
    if (this.socket) {
      this.socket.close()
    }
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style scoped></style>
