import { ref, computed } from "vue";
import en from "../locales/en";
import ja from "../locales/ja";
import zh from "../locales/zh";
import ko from "../locales/ko";

const translations = {
  en,
  ja,
  zh,
  ko,
};

// Load saved locale from localStorage, default to 'en'
const savedLocale = localStorage.getItem("app-locale") || "en";
const currentLocale = ref(savedLocale);

const currencyMap = {
  en: "USD",
  ja: "JPY",
  zh: "CNY",
  ko: "KRW",
};

const currentCurrency = computed(() => {
  return currencyMap[currentLocale.value] || "USD";
});

export function useI18n() {
  const t = (key, params = {}) => {
    const keys = key.split(".");
    let value = translations[currentLocale.value];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        // If translation not found, try English as fallback
        if (currentLocale.value !== "en") {
          let fallback = translations.en;
          for (const fk of keys) {
            if (fallback && typeof fallback === "object") {
              fallback = fallback[fk];
            } else {
              break;
            }
          }
          if (fallback && typeof fallback === "string") {
            return replacePlaceholders(fallback, params);
          }
        }
        // If still not found, return the key itself
        return key;
      }
    }

    if (typeof value === "string") {
      return replacePlaceholders(value, params);
    }

    return key;
  };

  const replacePlaceholders = (text, params) => {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  };

  const setLocale = (locale) => {
    if (translations[locale]) {
      currentLocale.value = locale;
      localStorage.setItem("app-locale", locale);
    }
  };

  const availableLocales = computed(() => Object.keys(translations));

  const localeNameMap = {
    en: "English",
    ja: "日本語",
    zh: "简体中文",
    ko: "한국어",
  };

  const localeName = computed(() => {
    return localeNameMap[currentLocale.value] || currentLocale.value;
  });

  // Translate product names
  const translateProductName = (productName) => {
    const locale = currentLocale.value;
    if (locale !== "en" && translations[locale]?.productNames?.[productName]) {
      return translations[locale].productNames[productName];
    }
    return productName;
  };

  // Translate customer names
  const translateCustomerName = (customerName) => {
    const locale = currentLocale.value;
    if (locale !== "en" && translations[locale]?.customerNames?.[customerName]) {
      return translations[locale].customerNames[customerName];
    }
    return customerName;
  };

  const warehouseCityMap = {
    ja: { "San Francisco": "サンフランシスコ", London: "ロンドン", Tokyo: "東京" },
    zh: { "San Francisco": "旧金山", London: "伦敦", Tokyo: "东京" },
    ko: { "San Francisco": "샌프란시스코", London: "런던", Tokyo: "도쿄" },
  };

  const warehousePrefixMap = {
    ja: "倉庫",
    zh: "仓库",
    ko: "창고 ",
  };

  // Translate warehouse names
  const translateWarehouse = (warehouseName) => {
    const locale = currentLocale.value;
    if (locale === "en") return warehouseName;

    const cityMap = warehouseCityMap[locale];
    if (cityMap?.[warehouseName]) {
      return cityMap[warehouseName];
    }

    // Handle "Warehouse X-##" pattern
    const prefix = warehousePrefixMap[locale];
    if (prefix && warehouseName.startsWith("Warehouse ")) {
      return warehouseName.replace("Warehouse ", prefix);
    }

    return warehouseName;
  };

  return {
    t,
    setLocale,
    currentLocale: computed(() => currentLocale.value),
    currentCurrency,
    availableLocales,
    localeName,
    translateProductName,
    translateCustomerName,
    translateWarehouse,
  };
}
