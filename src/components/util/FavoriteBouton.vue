<script setup>
import { ref } from 'vue';

const isFavorite = ref(false);

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};
</script>

<template>
  <button 
    class="btn btn-outline-secondary favorite-btn" 
    :class="{ 'is-favorite': isFavorite }"
    @click="toggleFavorite"
    aria-label="Ajouter aux favoris"
  >
   Favoris
    <svg 
      class="heart-icon" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
    
  </button>
</template>

<style scoped>
.favorite-btn {
  background: none;
  border: 1px solid #e7e7e8;
  cursor: pointer;
  padding: 8px;
  width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  gap: 5px;
}

.heart-icon {
  width: 20px;
  height: 20px;
  color: #e7e7e8;
  fill: transparent;
  transition: all 0.3s ease;
}

.is-favorite {
  border-color: #741836 !important;
  background: rgba(255, 1, 1, 0.219);
  color: #e7e7e8;
}

.is-favorite .heart-icon {
  color: #b81048;
  fill: #e21010;
  animation: heart-pulse 0.4s ease;
}

@keyframes heart-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>
