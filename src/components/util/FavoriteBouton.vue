<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import UtilClass from '@/util/UtilClass'

const props = defineProps({
  isFavorite: Boolean,
  id_cryptho: String, 
});

const emit = defineEmits(['update:isFavorite']);

const isFavorite = ref(props.isFavorite);

const toggleFavorite = async () => {
  try {
    isFavorite.value = !isFavorite.value;
    emit('update:isFavorite', isFavorite.value);
    let url= isFavorite.value ? '/crypto/user/favoris/add/' :'/crypto/user/favoris/rem/'

    const response = await fetch(
      UtilClass.BACKEND_BASE_URL + url + props.id_cryptho,
      {
        method: 'PUT',
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
    if (data.success) {
      UtilClass.showPrimaryToast("Update favoris ending !");
    } else {
      throw new Error(data.message || 'Error retrieving user information')
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du favori :", error);
  }
};
</script>

<template>
  <button 
    class="btn favorite-btn" 
    :class="{ 'is-favorite': isFavorite }"
    @click="toggleFavorite"
    aria-label="Ajouter aux favoris"
  >
  <span style="color: #e7e7e8;">Favorite</span>
    <svg 
      class="bi bi-star iconefav" 
      viewBox="0 0 16 16"
      :fill="isFavorite ? '#ffc107' : 'transparent'"
      :stroke="isFavorite ? '#ffc107' : '#e7e7e8'"
      stroke-width="1.5"
    >
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  </button>
</template>



<style scoped>

  .favorite-btn {
    background: none;
    border: 1px solid #e7e7e8;  
    cursor: pointer;
    padding: 8px;
    width: 120px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
    gap: 5px;
  }

  .iconefav {
    width: 18px;
    height: 18px;
    transition: all 0.3s ease;
  }

  .is-favorite {
    border-color: #ffc107;
    background: rgba(214, 195, 26, 0.219);
  }

  .is-favorite .iconefav {
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
