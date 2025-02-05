<script setup>
import { ref, onMounted } from "vue";
import UtilClass from "@/util/UtilClass.js";
import * as bootstrap from 'bootstrap'

const demandes = ref([]);
const selectedDemande = ref(null);
const actionType = ref("");
const modalInstance = ref(null);
const errorMessage = ref("");


const fetchDemandes = async () => {
  try {
    const response = await fetch(UtilClass.BACKEND_BASE_URL + "/crypto/demande/list");
    const result = await response.json();

    if (result.success && result.data) {
      demandes.value = result.data;
    } else {
      console.error("Erreur: Aucune donnée reçue.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
  }
};

const formatCurrency = (value) => {
  return UtilClass.formatCurrency(value);
};

const getUserLogo = (logo) => {
  if (!logo || parseInt(logo) === 0) {
    return '/assets/images/default-logo.jpg'
  }
  return logo
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  date.setHours(date.getHours()); // Ajout de 3 heures
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const openModal = (demande, type) => {
  selectedDemande.value = demande;
  actionType.value = type;
  modalInstance.value = new bootstrap.Modal(document.getElementById("confirmationModal"));
  modalInstance.value.show();
};

const showErrorModal = () => {
  modalInstance.value = new bootstrap.Modal(document.getElementById('errorModal'));
  modalInstance.value.show();
};

const confirmAction = async () => {
  if (!selectedDemande.value) return;

  const url =
    actionType.value === "allow"
      ? UtilClass.BACKEND_BASE_URL + `/crypto/demande/valider/${selectedDemande.value.id_demande}`
      : UtilClass.BACKEND_BASE_URL + `/crypto/demande/refuser/${selectedDemande.value.id_demande}`;

  try {
    const btn = document.getElementById('cf');
    UtilClass.loadButton(btn);

    const response = await fetch(url, { method: "PUT" });
    const responseBody = await response.json();

    if (response.ok) {
      setTimeout(() => {
        modalInstance.value.hide();
      }, 300);
      UtilClass.endLoadedButton(btn, 'Confirm');
      if (responseBody.success) {
        demandes.value = demandes.value.filter((d) => d.id_demande !== selectedDemande.value.id_demande);
      }
    } else {
      UtilClass.endLoadedButton(btn, 'Confirm');
      throw new Error(responseBody.message || "La demande n'a pas pu être mise à jour.");
    }
  } catch (error) {
    UtilClass.endLoadedButton(btn, 'Confirm');
    errorMessage.value = error.message;

    setTimeout(() => {
      showErrorModal();
    }, 300);
  }
};


// Récupérer les données au chargement du composant
onMounted(fetchDemandes);
</script>

<template>
  <div class="table-responsive">
    <table class="table table-dark tba">
      <thead>
      <tr>
        <th scope="col">User</th>
        <th scope="col">Type</th>
        <th scope="col">Value</th>
        <th scope="col">Request Date</th>
        <th scope="col" class="text-center">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="demande in demandes" :key="demande.id_demande">
        <td class="unit">
          <img :src="getUserLogo(demande.utilisateur.imageUrl)" alt="logo" width="20" class="me-2" />
          {{ demande.utilisateur.nom }}
        </td>
        <td class="unit">
            <span v-if="demande.type.etat === 'up'" class="text-warning">
              <i class="bi bi-arrow-up me-1"></i>
              Depot
            </span>
          <span v-else class="text-success">
              <i class="bi bi-arrow-down me-1"></i>
              Retrait
            </span>
        </td>
        <td class="unit">{{ formatCurrency(demande.valeur) }}</td>
        <td class="unit">{{ formatDateTime(demande.date_demande) }}</td>
        <td class="text-center">
          <div class="d-flex flex-column flex-md-row justify-content-center">
            <button
              class="btn btn-sm btn-outline-success fw-bold mb-2 mb-md-0 me-md-2"
              @click="openModal(demande, 'allow')"
            >
              Allow
            </button>
            <button class="btn btn-sm btn-outline-danger fw-bold" @click="openModal(demande, 'denie')">
              Denie
            </button>
          </div>
        </td>
      </tr>
      <tr v-if="demandes.length === 0">
        <td colspan="5" class="text-center">Empty 🎯</td>
      </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal de confirmation -->
  <div
    id="confirmationModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="confirmationModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmationModalLabel">Confirmation</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Êtes-vous sûr de vouloir
          <strong>{{ actionType === "allow" ? "approuver" : "refuser" }}</strong>
          cette demande ?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button id="cf" type="button" class="btn" :class="actionType === 'allow' ? 'btn-success' : 'btn-danger'" @click="confirmAction">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>


  <!-- Modal d'erreur -->
  <div id="errorModal" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-danger">Error</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ errorMessage }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

h4 {
  margin-top: 16px;
  font-weight: 700;
  color: white;
  text-align: left;
  margin-bottom: 10px; /* Pour l'espacement avec la table */
}

.table {
  margin: 0 auto;
  width: 100%;
}

.table-dark {
  --bs-table-bg: transparent !important;
  --bs-table-color: inherit !important;
}

.table td {
  padding: 10px;
  /* color: #c1c1c1; */
}

.unit {
  font-weight: 700;
  color: #fff;
}

.table tbody tr {
  height: initial;
}
.btn {
  border-radius: 5px;
  font-size: 1rem;
}

.btn-sm {
  font-size: 1.1rem;
}

th {
  font-weight: bold;
}

/* Réduire la taille des polices et masquer certaines colonnes sur les petits écrans */
@media (max-width: 576px) {
  .table th:nth-child(2),
  .table td:nth-child(2) {
    display: none;
  }
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
