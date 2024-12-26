<template>
  <header class="modern-header">
    <div class="logo">
      <img src="@/assets/binance-logo.svg" alt="Logo" class="logo-icon" />
      Crypto-G
    </div>
    <nav :class="{ open: isMenuOpen }">
      <ul>
        <li><RouterLink to="/app/accueil/v1">Home</RouterLink></li>
        <li><RouterLink to="/app/accueil/chart">Chart</RouterLink></li>
        <li><RouterLink to="/app/accueil/profil">My Profile</RouterLink></li>
        <li><RouterLink to="/achat">Achat</RouterLink></li>
        <li><RouterLink to="/setting">Setting</RouterLink></li>
      </ul>
    </nav>
    <button class="hamburger" @click="toggleMenu">
      <span :class="{ open: isMenuOpen }"></span>
      <span :class="{ open: isMenuOpen }"></span>
      <span :class="{ open: isMenuOpen }"></span>
    </button>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
  },
}
</script>

<style scoped>
.modern-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1e1e1e;
  color: #fff;
  position: relative;
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffc107;
  gap: 0.5rem; /* Espace entre le logo et le texte */
}

.logo-icon {
  width: 24px;
  height: 24px;
}

nav {
  display: flex;
  gap: 1rem;
}

nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem;
}

nav ul li a,
nav ul li RouterLink {
  color: rgba(235, 235, 235, 0.64);
  text-decoration: none;
  font-size: 1rem;
}

nav ul li a:hover,
nav ul li RouterLink:hover {
  color: #ff9800;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 2000;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 0.25rem;
  background: #fff;
  border-radius: 0.25rem;
  transition: all 0.3s;
}

.hamburger span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger span.open:nth-child(2) {
  opacity: 0;
}

.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media screen and (max-width: 768px) {
  nav {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 0;
    background: #333;
    width: 100%;
    text-align: center;
  }

  nav.open {
    display: flex;
  }

  nav ul {
    flex-direction: column;
  }

  .hamburger {
    display: flex;
  }
}
</style>
