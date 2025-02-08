<script setup>
import FavoriteBouton from './FavoriteBouton.vue';

</script>
<template>
  <div id="chart" ref="chart" style="width: 100%; height: 400px"></div>
  <div class="d-flex gap-2 mt-3">
    <button class="btn btn-outline-secondary gap-5" @click="goToRealtime">
      Go to realtime
      <i class="bi bi-clock custom"></i>
    </button>
    <FavoriteBouton  :isFavorite="isfavories" :id_cryptho="idCrypto"  />
  </div>
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
    updatedCryptoData: {
      type: Object,
      required: false,
      default: null,
    },
    isfavories:{
      type: Object,
      default:false,
      required:true,
    },
  },
  mounted() {
    this.initChart()

  },
  watch: {
    updatedCryptoData: {
      immediate: false,
      handler(newData) {
        if (newData) {
          this.updateChartData(newData)
        }
      },
    },
  },
  methods: {
    goToRealtime() {
      this.chart.timeScale().scrollToRealTime()
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize(this.$refs.chart.offsetWidth, this.$refs.chart.offsetHeight)
      }
    },
    async fetchInitialData() {
      try {
        const response = await fetch(
          UtilClass.BACKEND_BASE_URL + `/crypto/cour/${this.idCrypto}?limit=2000`,
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + UtilClass.getLocalToken(),
              'Content-Type': 'application/json',
            },
          },
        )
        const data = await response.json()

        if (!response.ok) {
          if (UtilClass.isInvalidTokenError(data)) {
            UtilClass.removeLocalToken()
            this.$router.push('/app/login')
          }
        }

        const initialData = data.data.map((item) => {
          const originalDate = new Date(item.date_changement)
          const updatedDate = new Date(originalDate)
          updatedDate.setHours(originalDate.getHours() + 3)
          return {
            time: updatedDate.getTime() / 1000,
            value: item.valeur,
          }
        })

        this.lineSeries.setData(initialData)
      } catch (error) {
        console.error('Error retrieving initial data :', error)
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
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
        },
      })

      this.lineSeries = this.chart.addLineSeries({
        color: '#ffc107',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        lastValueVisible: true,
        priceLineVisible: true,
      })

      setTimeout(() => {
        const logo = document.getElementById('tv-attr-logo')
        if (logo) {
          logo.style.display = 'none'
        }
      }, 100)

      this.fetchInitialData()

      window.addEventListener('resize', this.handleResize)
    },
    updateChartData(data) {
      const originalDate = new Date(data.date_changement)

      const updatedDate = new Date(originalDate)
      updatedDate.setHours(originalDate.getHours() + 3)

      const updatedData = {
        time: updatedDate.getTime() / 1000,
        value: data.valeur,
      }
      this.lineSeries.update(updatedData)
    },
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.remove()
    }
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style scoped>
.custom {
  font-size: 17px; 
}
#chart {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}

.btn-outline-secondary {
  --bs-btn-color: #e7e7e8;
  --bs-btn-border-color: #e7e7e8;
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: transparent;
  --bs-btn-hover-border-color: #ffffff;
}

#tv-attr-logo {
  display: none;
}

a#tv-attr-logo {
  display: none !important;
}
</style>
