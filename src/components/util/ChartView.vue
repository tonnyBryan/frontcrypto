<template>
  <div>
    <apexchart type="line" :options="chartOptions" :series="chartSeries" height="400" />
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import ApexCharts from 'vue3-apexcharts'

export default {
  name: 'ChartView',
  components: {
    apexchart: ApexCharts,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    // Fonction de formatage des valeurs Y pour les afficher en K (ex: 50000 => 50K)
    const yAxisFormatter = (value) => {
      if (value >= 1000) {
        return (value / 1000).toFixed(2) + 'K' // Formate les valeurs supérieures à 1000
      }
      return value.toFixed(2)
    }

    const chartOptions = ref({
      chart: {
        id: 'crypto-chart',
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        curve: 'smooth',
        colors: ['yellow'],
        width: 2,
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'HH:mm:ss',
          style: {
            colors: '#E0E0E0',
          },
        },
        axisBorder: {
          color: '#E0E0E0',
        },
      },
      yaxis: {
        min: 0,
        max: 70000,
        labels: {
          style: {
            colors: '#E0E0E0',
          },
          formatter: yAxisFormatter,
        },
        axisBorder: {
          color: '#E0E0E0',
        },
      },
      fill: {
        opacity: 0.3,
      },
      tooltip: {
        theme: 'dark',
      },
    })

    const chartSeries = ref([
      {
        name: 'Real-time Data',
        data: props.data,
      },
    ])

    watch(
      () => props.data,
      (newData) => {
        chartSeries.value[0].data = newData
      },
      { immediate: true },
    )

    return {
      chartOptions,
      chartSeries,
    }
  },
}
</script>

<style scoped></style>
