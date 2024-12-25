<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="greetings">
    <h1 class="yellow">{{ msg }}</h1>
    <!-- <h3>
      Powerful Crypto project, created by ETU<br />
      <a href="#" rel="noopener" class="yellow">2768</a> +
      <a href="#" rel="noopener" class="yellow">2442</a> +
      <a href="#" rel="noopener" class="yellow">2561</a> +
      <a href="#" rel="noopener" class="yellow">2756</a> .
    </h3> -->
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: center;
  }
}
</style>
