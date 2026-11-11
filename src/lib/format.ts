export function formatPrice(value: number, lang = 'fa'): string {
  const code = lang.split('-')[0]
  const locales: Record<string, string> = {
    fa: 'fa-IR',
    en: 'en-US',
    ar: 'ar',
  }
  const currency = code === 'en' ? 'Toman' : 'تومان'
  const amount = new Intl.NumberFormat(locales[code] ?? 'fa-IR', {
    maximumFractionDigits: 0,
  }).format(Math.round(value))

  return `${amount} ${currency}`
}

export function discountPercent(price: number, priceOld?: number): number {
  if (!priceOld || priceOld <= price) return 0
  return Math.round(((priceOld - price) / priceOld) * 100)
}
