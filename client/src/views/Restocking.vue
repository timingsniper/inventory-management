<script>
import { ref, computed, onMounted } from "vue";
import { api } from "../api";
import { useFilters } from "../composables/useFilters";
import { useI18n } from "../composables/useI18n";

const TREND_PRIORITY = { increasing: 0, stable: 1, decreasing: 2 };

export default {
  name: "Restocking",
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const forecasts = ref([]);
    const budget = ref(100000);
    const ordering = ref(false);
    const orderSuccess = ref(false);
    const orderError = ref(null);

    const { t, currentCurrency } = useI18n();
    const { selectedLocation } = useFilters();

    const currencySymbol = computed(() =>
      currentCurrency.value === "JPY" ? "¥" : "$",
    );

    const loadForecasts = async () => {
      try {
        loading.value = true;
        error.value = null;
        forecasts.value = await api.getDemandForecasts();
      } catch (err) {
        error.value = "Failed to load demand forecasts: " + err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadForecasts);

    const candidates = computed(() => {
      return forecasts.value
        .map((item) => {
          const qtyToOrder = Math.max(
            0,
            item.forecasted_demand - item.current_demand,
          );
          const subtotal = qtyToOrder * item.unit_cost;
          return { ...item, qtyToOrder, subtotal };
        })
        .filter((item) => item.qtyToOrder > 0)
        .sort(
          (a, b) =>
            (TREND_PRIORITY[a.trend] ?? 1) - (TREND_PRIORITY[b.trend] ?? 1),
        );
    });

    const recommendedItems = computed(() => {
      let remaining = budget.value;
      const result = [];
      for (const item of candidates.value) {
        if (item.subtotal <= remaining) {
          result.push(item);
          remaining -= item.subtotal;
        }
      }
      return result;
    });

    const totalCost = computed(() =>
      recommendedItems.value.reduce((sum, item) => sum + item.subtotal, 0),
    );

    const formatCurrency = (value) => {
      if (currentCurrency.value === "JPY") {
        return "¥" + Math.round(value).toLocaleString();
      }
      return (
        "$" +
        value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    };

    const formatBudget = computed(() => formatCurrency(budget.value));

    const placeOrder = async () => {
      if (recommendedItems.value.length === 0) return;
      try {
        ordering.value = true;
        orderError.value = null;
        orderSuccess.value = false;

        const now = new Date();
        const delivery = new Date(now);
        delivery.setDate(delivery.getDate() + 14);
        const warehouse =
          selectedLocation.value === "all"
            ? "All Warehouses"
            : selectedLocation.value;

        await api.createOrder({
          customer: "Internal Restock",
          items: recommendedItems.value.map((i) => ({
            sku: i.item_sku,
            name: i.item_name,
            quantity: i.qtyToOrder,
            unit_price: i.unit_cost,
          })),
          warehouse,
          category: "Mixed",
          order_date: now.toISOString(),
          expected_delivery: delivery.toISOString(),
        });

        orderSuccess.value = true;
      } catch (err) {
        orderError.value = t("restocking.orderError");
      } finally {
        ordering.value = false;
      }
    };

    return {
      t,
      loading,
      error,
      budget,
      formatBudget,
      formatCurrency,
      recommendedItems,
      totalCost,
      currencySymbol,
      ordering,
      orderSuccess,
      orderError,
      placeOrder,
    };
  },
};
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="page-header">
      <h2>{{ t("restocking.title") }}</h2>
      <p>{{ t("restocking.description") }}</p>
    </div>

    <!-- Budget + Place Order card -->
    <div class="card" style="margin-bottom: 1.5rem">
      <div class="card-header">
        <h3 class="card-title">{{ t("restocking.budgetLabel") }}</h3>
      </div>
      <div style="padding: 1.25rem">
        <!-- Slider row: label on left, formatted value on right -->
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
          "
        >
          <label style="font-size: 0.875rem; color: #64748b">{{
            t("restocking.budgetLabel")
          }}</label>
          <strong style="font-size: 1.1rem; color: #0f172a">{{
            formatBudget
          }}</strong>
        </div>
        <input
          type="range"
          v-model.number="budget"
          min="0"
          max="500000"
          step="1000"
          style="width: 100%; margin-bottom: 1.25rem"
        />

        <!-- Total cost summary -->
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            background: #f8fafc;
            border-radius: 6px;
            margin-bottom: 1.25rem;
          "
        >
          <span style="font-size: 0.875rem; color: #64748b">{{
            t("restocking.totalCost")
          }}</span>
          <span style="font-weight: 700; color: #0f172a">
            {{ formatCurrency(totalCost) }} {{ t("restocking.of") }}
            {{ formatBudget }}
          </span>
        </div>

        <!-- Success / error feedback -->
        <div
          v-if="orderSuccess"
          style="
            padding: 0.75rem;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 6px;
            color: #166534;
            margin-bottom: 1rem;
            font-size: 0.875rem;
          "
        >
          {{ t("restocking.orderSuccess") }}
        </div>
        <div
          v-if="orderError"
          style="
            padding: 0.75rem;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            color: #991b1b;
            margin-bottom: 1rem;
            font-size: 0.875rem;
          "
        >
          {{ orderError }}
        </div>

        <!-- Place Order button -->
        <button
          @click="placeOrder"
          :disabled="recommendedItems.length === 0 || ordering"
          style="
            padding: 0.625rem 1.5rem;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            opacity: 1;
          "
          :style="{
            opacity: recommendedItems.length === 0 || ordering ? '0.5' : '1',
            cursor:
              recommendedItems.length === 0 || ordering
                ? 'not-allowed'
                : 'pointer',
          }"
        >
          {{ ordering ? "..." : t("restocking.placeOrder") }}
        </button>
      </div>
    </div>

    <!-- Recommendations table card -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ t("restocking.recommendations") }}</h3>
      </div>
      <div v-if="loading" class="loading">{{ t("common.loading") }}</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div
        v-else-if="recommendedItems.length === 0"
        style="
          padding: 2rem;
          text-align: center;
          color: #64748b;
          font-size: 0.875rem;
        "
      >
        {{ t("restocking.noRecommendations") }}
      </div>
      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>{{ t("restocking.table.name") }}</th>
              <th>{{ t("restocking.table.sku") }}</th>
              <th>{{ t("restocking.table.trend") }}</th>
              <th>{{ t("restocking.table.currentStock") }}</th>
              <th>{{ t("restocking.table.qtyToOrder") }}</th>
              <th>{{ t("restocking.table.unitCost") }}</th>
              <th>{{ t("restocking.table.subtotal") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in recommendedItems" :key="item.item_sku">
              <td>{{ item.item_name }}</td>
              <td>
                <code>{{ item.item_sku }}</code>
              </td>
              <td>
                <span :class="['badge', item.trend]">{{
                  t("trends." + item.trend)
                }}</span>
              </td>
              <td>{{ item.current_demand.toLocaleString() }}</td>
              <td>
                <strong>{{ item.qtyToOrder.toLocaleString() }}</strong>
              </td>
              <td>{{ formatCurrency(item.unit_cost) }}</td>
              <td>
                <strong>{{ formatCurrency(item.subtotal) }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="range"] {
  accent-color: #3b82f6;
}
</style>
