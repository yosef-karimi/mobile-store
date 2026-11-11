import React from "react";

type StockWarningProps = {
  stock: number;
};

export default function StockWarning({ stock }: StockWarningProps) {
  if (stock <= 0 || stock > 5) return null;

  const messages: Record<string, string> = {
    fa: `فقط ${stock} عدد باقی مانده!`,
    en: `Only ${stock} left in stock!`,
    ar: `لم يتبق سوى ${stock} قطع!`,
  };

  const language =
    typeof document !== "undefined"
      ? document.documentElement.lang.slice(0, 2)
      : "fa";

  return (
    <div
      role="status"
      className="my-3 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
    >
      <span aria-hidden="true">⚠️</span>
      <span>{messages[language] ?? messages.fa}</span>
    </div>
  );
}
