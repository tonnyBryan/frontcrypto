<script setup>
import { ref, onMounted } from "vue";
import * as bootstrap from 'bootstrap'
import UtilClass from '@/util/UtilClass.js'


// Variables réactives pour les commissions
const errorMessage = ref(null);
const commissionAchat = ref(null);
const commissionVente = ref(null);
const isEditingAchat = ref(false); // Détermine si l'on édite "achat" ou "vente"
const editedValue = ref(null); // Stocke la valeur modifiée

// Fonction pour récupérer les données depuis l'API
const fetchCommissions = async () => {
  try {
    const response = await fetch(UtilClass.BACKEND_BASE_URL + "/crypto/commission");
    const result = await response.json();

    if (result.success && result.data) {
      commissionAchat.value = result.data.commission_achat;
      commissionVente.value = result.data.commission_vente;
    } else {
      console.error("Erreur dans les données reçues :", result.message);
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
  }
};

// Fonction pour mettre à jour une commission
const updateCommission = async () => {
  try {
    if (!editedValue.value && editedValue.value !== 0) {
      errorMessage.value = "Wrong value"
      return
    }

    if (editedValue.value < 0 || editedValue.value > 5) {
      errorMessage.value = "The commission is only between 0 and 5 percent"
      return
    }

    const body = {
      commission_achat: isEditingAchat.value ? editedValue.value : commissionAchat.value,
      commission_vente: !isEditingAchat.value ? editedValue.value : commissionVente.value,
    };

    const response = await fetch(UtilClass.BACKEND_BASE_URL + "/crypto/commission", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
    if (modal) {
      errorMessage.value = null
      modal.hide();
    }

    if (result.success) {
      if (isEditingAchat.value) {
        commissionAchat.value = body.commission_achat;
      } else {
        commissionVente.value = body.commission_vente;
      }
    } else {
      console.error("Erreur lors de la mise à jour :", result.message);
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
};

onMounted(() => {
  fetchCommissions();
});

const openEditModal = (isAchat) => {
  isEditingAchat.value = isAchat;
  editedValue.value = isAchat ? commissionAchat.value : commissionVente.value;

  const modal = new bootstrap.Modal(document.getElementById("editModal"));
  modal.show();
};
</script>

<template>
  <div class="row">
    <div class="col-md-12" style="margin-bottom: 2rem">
      <div class="card" style="background-color: transparent; border-color: #997404;">
        <div class="card-header alert alert-warning" style="margin: 0">
          Buy Commission
        </div>
        <div class="card-body">
          <div class="hd">
            <h3 class="comm">
              {{ commissionAchat !== null ? commissionAchat + '%' : 'Loading...' }}
            </h3>
            <i class="bi bi-pencil-fill" @click="openEditModal(true)" style="cursor: pointer;"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-12">
      <div class="card" style="background-color: transparent; border-color: #0f5132;">
        <div class="card-header alert alert-success" style="margin: 0">
          Sell Commission
        </div>
        <div class="card-body">
          <div class="hd">
            <h3 class="comm">
              {{ commissionVente !== null ? commissionVente + '%' : 'Loading...' }}
            </h3>
            <i class="bi bi-pencil-fill" @click="openEditModal(false)" style="cursor: pointer;"></i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Bootstrap -->
  <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editModalLabel">
            Modifier la {{ isEditingAchat ? 'commission d\'achat' : 'commission de vente' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input
            style="margin-bottom: 1rem"
            type="number"
            class="form-control"
            v-model="editedValue"
            min="0"
            max="100"
            placeholder="Entrez une nouvelle valeur"
          />
          <div class="alert alert-danger" v-if="errorMessage">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ errorMessage }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
          <button
            type="button"
            class="btn btn-primary"
            @click="updateCommission()"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert-warning {
  --bs-alert-bg: #332701 !important;
  --bs-alert-color: var(--bs-warning-bg-subtle);
  --bs-alert-border-color: #997404 !important;
}

.alert-success {
  --bs-alert-color: #75b798 !important;
  --bs-alert-bg: #051b11 !important;
  --bs-alert-border-color: #0f5132 !important;
}

.hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comm, .hd {
  color: #d1d1d3;
  font-weight: 700;
}

.hd i {
  font-size: x-large;
}

.modal-content {
  background-color: #181a20;
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-bottom: 1px solid #444;
}

.modal-footer {
  border-top: 1px solid #444;
}

.alert-danger {
  --bs-alert-bg: #2c0b0e !important;
  --bs-alert-color: #ea868f !important;
  --bs-alert-border-color: #842029 !important;
}
</style>
