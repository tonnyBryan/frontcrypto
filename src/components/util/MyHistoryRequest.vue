<template>
  <div class="table-container m-">
    <div v-if="request" class="d-flex p-3 alert alert-warning justify-content-between align-items-center">
      <h6 class="mb-0 text-white d-flex ">🟡 You have a pending request : <span class="ms-2">  {{ type }} of <strong> ${{ formatCurrency(request.valeur) }}</strong></span></h6>
      <button
        type="button"
        class="btn btn-outline-danger btn-sm"
        @click="openModal"
      >
        Cancel
      </button>
    </div>
    <div v-else class="d-flex p-3 alert alert-info justify-content-between align-items-center" >
      <h6 class="mb-0 text-white d-flex">🔵 No request pending for you !</h6>
    </div>
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
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          Are you sure you want to <strong>cancel</strong> this request?
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            No
          </button>
          <button
            id="cf"
            type="button"
            class="btn btn-danger"
            @click="confirmAction"
          >
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

<script>
import { ref, onMounted } from "vue";
import UtilClass from "@/util/UtilClass.js";
import * as bootstrap from 'bootstrap'

export default {
  name: 'MyHistoryRequest',
  data() {
    return {
      errorMessage: "", // Initialize with an empty string or a default error message
    };
  },
  props: {
    request: {
      type: Object,
      required: true,
    },
  },
  computed: {
    type() {
      if (this.request.type.etat === 'down') {
        return 'Withdraw'
      } else {
        return 'Deposit'
      }
    }
  },
  methods: {
    formatCurrency(value) {
      const roundedValue = value.toFixed(2);
      return new Intl.NumberFormat('fr-FR').format(roundedValue);
    },
    // Ouvre la modal de confirmation
    openModal() {
      this.modalInstance = new bootstrap.Modal(document.getElementById("confirmationModal"));
      this.modalInstance.show();
    },
    showErrorModal (){
      this.modalInstance = new bootstrap.Modal(document.getElementById('errorModal'));
      this.modalInsance.show();
    },
    async confirmAction() {
      const requestUrl = `${UtilClass.BACKEND_BASE_URL}/crypto/demande/annuler/${this.request.id_demande}`;
      const btn = document.getElementById('cf'); // Vérifie que le bouton existe
      if (!btn) {
        console.error('Button not found');
        return;
      }

      try {
        UtilClass.loadButton(btn); // Ajoute un état de chargement au bouton

        const response = await fetch(requestUrl, { method: "PUT" });
        const responseBody = await response.json();

        if (response.ok) {
          setTimeout(() => {
            this.modalInstance.hide(); // Cache la modal après l'action
          }, 300);
          if (responseBody.success) {
            this.$emit('request-changed');
            UtilClass.endLoadedButton(btn, 'Confirm');

          }
          else{
            UtilClass.endLoadedButton(btn, 'Confirm');
            throw new Error(responseBody.message || "The request could not be updated.");
          }
        } else {
          UtilClass.endLoadedButton(btn, 'Confirm');
          throw new Error(responseBody.message || "The request could not be updated.");
        }
      } catch (error) {
        UtilClass.endLoadedButton(btn, 'Confirm');
        this.errorMessage = error.message;
        setTimeout(() => {
          this.showErrorModal();
        }, 300);
      }
    }
  },
  
}
</script>

<style scoped>
/* Ajout de styles personnalisés pour la modal et les alertes */
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

.table-container {
  padding: 0 10px;
  color: white;
  margin: auto;
}

.alert {
  margin-bottom: unset;
}

.alert-warning {
  --bs-alert-color: #ffda6a;
  --bs-alert-bg: #332701;
  --bs-alert-border-color: #997404;
  width: 100%;
}

.alert-info {
  --bs-alert-color: #6edff6;
  --bs-alert-bg: #032830;
  --bs-alert-border-color: #087990;
}
</style>
