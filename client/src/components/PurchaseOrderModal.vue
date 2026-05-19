<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && backlogItem" class="modal-overlay" @click="close">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{
                mode === "create"
                  ? "Create Purchase Order"
                  : "Purchase Order Details"
              }}
            </h3>
            <button class="close-button" @click="close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- CREATE MODE -->
            <template v-if="mode === 'create'">
              <!-- Item info header -->
              <div class="item-info-header">
                <div class="item-info-main">
                  <h4 class="item-name">{{ backlogItem.item_name }}</h4>
                  <div class="item-sku">SKU: {{ backlogItem.item_sku }}</div>
                </div>
                <div class="shortage-pill">
                  <span class="shortage-label">Shortage</span>
                  <span class="shortage-count"
                    >{{ backlogItem.shortage }} units</span
                  >
                </div>
              </div>

              <form @submit.prevent="submitPO" class="po-form">
                <div class="form-group">
                  <label class="form-label" for="supplier_name"
                    >Supplier Name</label
                  >
                  <input
                    id="supplier_name"
                    v-model="form.supplier_name"
                    type="text"
                    class="form-input"
                    placeholder="Enter supplier name"
                    required
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="quantity"
                      >Quantity to Order</label
                    >
                    <input
                      id="quantity"
                      v-model.number="form.quantity"
                      type="number"
                      class="form-input"
                      min="1"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="unit_cost"
                      >Unit Cost ($)</label
                    >
                    <input
                      id="unit_cost"
                      v-model.number="form.unit_cost"
                      type="number"
                      class="form-input"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="expected_delivery_date"
                    >Expected Delivery Date</label
                  >
                  <input
                    id="expected_delivery_date"
                    v-model="form.expected_delivery_date"
                    type="date"
                    class="form-input"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" for="notes"
                    >Notes <span class="optional">(optional)</span></label
                  >
                  <textarea
                    id="notes"
                    v-model="form.notes"
                    class="form-input form-textarea"
                    placeholder="Additional notes or instructions..."
                    rows="3"
                  ></textarea>
                </div>

                <div v-if="submitError" class="error">{{ submitError }}</div>
              </form>
            </template>

            <!-- VIEW MODE -->
            <template v-else>
              <div v-if="poLoading" class="loading">
                Loading purchase order...
              </div>
              <div v-else-if="poError" class="error">{{ poError }}</div>
              <div v-else-if="purchaseOrder">
                <!-- Item info header -->
                <div class="item-info-header">
                  <div class="item-info-main">
                    <h4 class="item-name">{{ backlogItem.item_name }}</h4>
                    <div class="item-sku">SKU: {{ backlogItem.item_sku }}</div>
                  </div>
                  <!-- Status badge positioned here in view mode -->
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(purchaseOrder.status)"
                  >
                    {{ purchaseOrder.status }}
                  </span>
                </div>

                <div class="po-details-grid">
                  <div class="po-detail-item">
                    <div class="po-detail-label">Supplier</div>
                    <div class="po-detail-value">
                      {{ purchaseOrder.supplier_name }}
                    </div>
                  </div>

                  <div class="po-detail-item">
                    <div class="po-detail-label">Quantity</div>
                    <div class="po-detail-value">
                      {{ purchaseOrder.quantity }} units
                    </div>
                  </div>

                  <div class="po-detail-item">
                    <div class="po-detail-label">Unit Cost</div>
                    <div class="po-detail-value">
                      {{ formatCost(purchaseOrder.unit_cost) }}
                    </div>
                  </div>

                  <div class="po-detail-item">
                    <div class="po-detail-label">Total Cost</div>
                    <div class="po-detail-value total-cost">
                      {{
                        formatCost(
                          purchaseOrder.quantity * purchaseOrder.unit_cost,
                        )
                      }}
                    </div>
                  </div>

                  <div class="po-detail-item">
                    <div class="po-detail-label">Expected Delivery</div>
                    <div class="po-detail-value">
                      {{ formatDate(purchaseOrder.expected_delivery_date) }}
                    </div>
                  </div>

                  <div class="po-detail-item">
                    <div class="po-detail-label">Created</div>
                    <div class="po-detail-value">
                      {{ formatDate(purchaseOrder.created_date) }}
                    </div>
                  </div>

                  <div
                    v-if="purchaseOrder.notes"
                    class="po-detail-item po-detail-full"
                  >
                    <div class="po-detail-label">Notes</div>
                    <div class="po-detail-value po-notes">
                      {{ purchaseOrder.notes }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" @click="close">
              {{ mode === "create" ? "Cancel" : "Close" }}
            </button>
            <button
              v-if="mode === 'create'"
              class="btn-primary"
              :disabled="submitting"
              @click="submitPO"
            >
              {{ submitting ? "Placing Order..." : "Place Purchase Order" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref, watch } from "vue";
import { api } from "../api";

export default {
  name: "PurchaseOrderModal",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    backlogItem: {
      type: Object,
      default: null,
    },
    mode: {
      type: String,
      default: "create",
      validator: (val) => ["create", "view"].includes(val),
    },
  },
  emits: ["close", "po-created"],
  setup(props, { emit }) {
    // Form state (create mode)
    const form = ref({
      supplier_name: "",
      quantity: 0,
      unit_cost: null,
      expected_delivery_date: "",
      notes: "",
    });
    const submitting = ref(false);
    const submitError = ref(null);

    // View mode state
    const purchaseOrder = ref(null);
    const poLoading = ref(false);
    const poError = ref(null);

    const resetForm = () => {
      if (props.backlogItem) {
        // Pre-fill quantity with the shortage amount
        form.value.quantity = props.backlogItem.shortage || 0;
      }
      form.value.supplier_name = "";
      form.value.unit_cost = null;
      form.value.expected_delivery_date = "";
      form.value.notes = "";
      submitError.value = null;
    };

    const loadPurchaseOrder = async () => {
      if (!props.backlogItem) return;
      poLoading.value = true;
      poError.value = null;
      purchaseOrder.value = null;
      try {
        purchaseOrder.value = await api.getPurchaseOrderByBacklogItem(
          props.backlogItem.id,
        );
      } catch (err) {
        poError.value = "Failed to load purchase order details.";
        console.error("Failed to load PO:", err);
      } finally {
        poLoading.value = false;
      }
    };

    // When modal opens, initialize for the active mode
    watch(
      () => props.isOpen,
      (opened) => {
        if (opened) {
          if (props.mode === "create") {
            resetForm();
          } else {
            loadPurchaseOrder();
          }
        }
      },
    );

    const close = () => {
      emit("close");
    };

    const submitPO = async () => {
      if (submitting.value) return;
      submitting.value = true;
      submitError.value = null;
      try {
        const payload = {
          backlog_item_id: props.backlogItem.id,
          supplier_name: form.value.supplier_name,
          quantity: form.value.quantity,
          unit_cost: form.value.unit_cost,
          expected_delivery_date: form.value.expected_delivery_date,
          notes: form.value.notes || undefined,
        };
        const poData = await api.createPurchaseOrder(payload);
        emit("po-created", poData);
      } catch (err) {
        submitError.value =
          "Failed to create purchase order. Please try again.";
        console.error("Failed to create PO:", err);
      } finally {
        submitting.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const formatCost = (value) => {
      if (value == null) return "N/A";
      return `$${Number(value).toFixed(2)}`;
    };

    const getStatusBadgeClass = (status) => {
      if (!status) return "info";
      const s = status.toLowerCase();
      if (s === "pending") return "warning";
      if (s === "approved" || s === "delivered") return "success";
      if (s === "cancelled") return "danger";
      return "info";
    };

    return {
      form,
      submitting,
      submitError,
      purchaseOrder,
      poLoading,
      poError,
      close,
      submitPO,
      formatDate,
      formatCost,
      getStatusBadgeClass,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
}

.close-button {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.close-button:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Item info header (shared between modes) */
.item-info-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.item-info-main {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.375rem 0;
}

.item-sku {
  font-size: 0.813rem;
  color: #64748b;
  font-family: "Monaco", "Courier New", monospace;
}

.shortage-pill {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
  flex-shrink: 0;
}

.shortage-label {
  font-size: 0.688rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.shortage-count {
  font-size: 1rem;
  font-weight: 700;
  color: #dc2626;
}

/* Form styles */
.po-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.813rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.optional {
  font-weight: 400;
  color: #94a3b8;
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.75rem;
}

.form-input {
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0f172a;
  background: white;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  font-family: inherit;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* View mode detail grid */
.po-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.po-detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.po-detail-full {
  grid-column: 1 / -1;
}

.po-detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.po-detail-value {
  font-size: 0.938rem;
  font-weight: 500;
  color: #0f172a;
}

.total-cost {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.po-notes {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.875rem;
  color: #475569;
  font-style: italic;
  line-height: 1.5;
}

/* Buttons */
.btn-secondary {
  padding: 0.625rem 1.25rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.btn-secondary:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.btn-primary {
  padding: 0.625rem 1.25rem;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading / error shared with global but scoped here too */
.loading {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 0.938rem;
}

.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
