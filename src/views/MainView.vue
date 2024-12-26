<template>
  <Head></Head>

  <div class="main col-lg-12 container-fluid">
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Head from '@/components/main/HeaderView.vue'
import UtilClass from '@/util/UtilClass'

const router = useRouter()

onMounted(async () => {
  //await UtilClass.verifyToken(router)
})
</script>

<style scoped></style>
