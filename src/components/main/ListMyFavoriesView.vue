<template>
  <div class="table-container">
    <h4> Favorites :</h4>
      <div v-if="favorites.length > 0" class="scroll-container">
        <div  class="scroll-content">
          <div
            v-for="crypto in favorites"
            :key="crypto.id_crypto"
            class="item"
            :style="{ background: getRandomGradient() }"
            @click="goToCryptoDetails(crypto.id_crypto)"
          >
          <img :src="getLogoUrl(crypto.unit_nom)" alt="logo" class="crypto-logo me-3" width="35" height="35" />
            <span class="bold">{{ crypto.nom }}</span>
            <button class="mmi"><i class="bi bi-star-fill "></i></button>
          </div>
        </div>
      </div>
      <div v-else class="d-flex flex-column align-items-center">
          <button ><i class="bi bi-star-fill"></i></button>
          <p class="mt-2 fw-bold "> Oops! You don't have any favorite crypto !</p>
      </div>
  </div>
  </template>
  
  <script>
  import UtilClass from '@/util/UtilClass'
  export default {
    data() {
      return {
        favorites: [],
      };
    },
    methods: {
      goToCryptoDetails(idCrypto) {
        this.$router.push('/app/v1/crypto?id=' + idCrypto)
      },
      getLogoUrl(logo) {
        if (!logo) {
            return '/assets/crypto/default-logo.png'
        }
        return `/assets/images/logo/${logo}.png`
      },
      getRandomGradient() {
          const colors = [
              "#f39d1254", 
              "#e74d3c5d", 
              "#8d44ad57", 
              "#3498db56", 
              "#cc2e9d62", 
              "#746d29a4", 
              "#188f6180"  
          ];
          let color1Index = Math.floor(Math.random() * colors.length);
          let color2Index;
          // Assure que color2 est différent de color1
          do {
              color2Index = Math.floor(Math.random() * colors.length);
          } while (color1Index === color2Index);
          const color1 = colors[color1Index];
          const color2 = colors[color2Index];
          return `linear-gradient(45deg, ${color1}, ${color2})`;
      },
      async getFavorie() {
        try {
          const response = await fetch(
            UtilClass.BACKEND_BASE_URL + '/crypto/user/favoris',
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
          if (data.success) {
            this.favorites = data.data.favoris
          } else {
            throw new Error(data.message || 'Error retrieving favoris user information')
          }
        } catch (error) {
          console.error(error)
        }
      },
    },
    async mounted() {
        await this.getFavorie()
    },
  };
  </script>
  
<style scoped>
.mmi{
  margin-left: auto;
}
  .table-container {
    position: relative;
    padding: 0 20px;
  }
  h4 {
    margin-top: 16px;
    color: white;
    text-align: left;
    margin-bottom: 10px;
    padding: 0 10px;
  }
  .body{
    background: #454545;
  }
  .bold {
    color: #fdf8f8;
    font-weight: 700;
  }
.scroll-container {
  position: relative;
  padding: 0 10px;
}
.scroll-content {
  display: flex; 
  overflow-x: scroll; 
  scroll-behavior: smooth; 
  padding-top: 0.6rem;
}

.item {
  min-width: 184px;
  min-height: 58px;
  margin-right: 20px; 
  padding: 10px;
  border-radius: 5px;
  flex-shrink: 0; 
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease-in-out;
  position: relative;
  
}
.item:hover {
  transform: translateY(-5px);
}
button {
  background: none;
  border: none;
  font-size: 20px;
 
}
.bi-star-fill {
  width: 20px;
  height: 20px;
  color: #ffc107;
  
}
 


  </style>
  