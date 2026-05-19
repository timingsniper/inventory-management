// Currency conversion utility
// Exchange rates relative to USD (approximate)
const USD_TO_JPY = 150;
const USD_TO_CNY = 7.2;
const USD_TO_KRW = 1350;

export function formatCurrency(amount, currency = "USD") {
  if (currency === "JPY") {
    const converted = Math.round(amount * USD_TO_JPY);
    return `¥${converted.toLocaleString("ja-JP")}`;
  }
  if (currency === "CNY") {
    const converted = Math.round(amount * USD_TO_CNY);
    return `¥${converted.toLocaleString("zh-CN")}`;
  }
  if (currency === "KRW") {
    const converted = Math.round(amount * USD_TO_KRW);
    return `₩${converted.toLocaleString("ko-KR")}`;
  }
  // Default USD
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatCurrencyWithDecimals(
  amount,
  currency = "USD",
  decimals = 0,
) {
  if (currency === "JPY") {
    const converted = Math.round(amount * USD_TO_JPY);
    return `¥${converted.toLocaleString("ja-JP")}`;
  }
  if (currency === "CNY") {
    const converted = Math.round(amount * USD_TO_CNY);
    return `¥${converted.toLocaleString("zh-CN")}`;
  }
  if (currency === "KRW") {
    const converted = Math.round(amount * USD_TO_KRW);
    return `₩${converted.toLocaleString("ko-KR")}`;
  }
  // Default USD
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export function convertAmount(amount, currency = "USD") {
  if (currency === "JPY") {
    return Math.round(amount * USD_TO_JPY);
  }
  if (currency === "CNY") {
    return Math.round(amount * USD_TO_CNY);
  }
  if (currency === "KRW") {
    return Math.round(amount * USD_TO_KRW);
  }
  return amount;
}
