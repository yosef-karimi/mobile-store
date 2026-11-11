import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { findProduct, productImages } from '@/data/products'
import { useCompareStore } from '@/stores/compare'
import { formatPrice } from '@/lib/format'

export default function ComparePage() {
  const { t, i18n } = useTranslation()
  const slugs = useCompareStore((s) => s.slugs)
  const remove = useCompareStore((s) => s.remove)
  const clear = useCompareStore((s) => s.clear)
  const products = slugs.map(findProduct).filter((p): p is NonNullable<typeof p> => Boolean(p))
  const rtl = i18n.language.startsWith('fa') || i18n.language.startsWith('ar')

  const rows = [
    { label: t('compare.brand'), value: (p: (typeof products)[number]) => p.brand },
    { label: t('compare.price'), value: (p: (typeof products)[number]) => formatPrice(p.price) },
    { label: t('compare.oldPrice'), value: (p: (typeof products)[number]) => p.priceOld ? formatPrice(p.priceOld) : '—' },
    { label: t('compare.rating'), value: (p: (typeof products)[number]) => `${p.rating} / 5` },
    { label: t('compare.reviews'), value: (p: (typeof products)[number]) => p.reviewsCount },
    { label: t('compare.stock'), value: (p: (typeof products)[number]) => p.stock > 0 ? p.stock : t('compare.unavailable') },
    { label: t('compare.category'), value: (p: (typeof products)[number]) => t(`categories.${p.category}.name`) },
  ]

  return (
    <main dir={rtl ? 'rtl' : 'ltr'} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading sm:text-3xl">{t('compare.title')}</h1>
          <p className="mt-2 text-sm text-muted">{t('compare.subtitle')}</p>
        </div>
        {products.length > 0 && (
          <button onClick={clear} className="rounded-lg border border-themed px-4 py-2 text-sm text-body hover:border-red-400 hover:text-red-500">
            {t('compare.clear')}
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <section className="surface-card rounded-2xl border border-themed px-6 py-16 text-center">
          <div className="text-4xl">⚖️</div>
          <h2 className="mt-4 text-lg font-semibold text-heading">{t('compare.empty')}</h2>
          <p className="mt-2 text-sm text-muted">{t('compare.emptyDesc')}</p>
          <Link to="/produtos" className="mt-6 inline-flex rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600">
            {t('compare.browse')}
          </Link>
        </section>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-themed">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="w-36 p-4 text-start font-semibold text-heading">{t('compare.features')}</th>
                {products.map((p) => (
                  <th key={p.slug} className="min-w-48 p-4 align-top">
                    <div className="mx-auto max-w-52">
                      <img src={productImages(p.slug, 1)[0]} alt={p.name} className="mx-auto aspect-square w-32 rounded-xl object-cover" />
                      <Link to={`/produto/${p.slug}`} className="mt-3 block font-semibold text-heading hover:text-brand-600">
                        {p.name}
                      </Link>
                      <button onClick={() => remove(p.slug)} className="mt-2 text-xs text-red-500 hover:underline">
                        {t('compare.remove')}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.label} className={index % 2 === 0 ? 'bg-white dark:bg-gray-dark' : 'bg-gray-50 dark:bg-gray-900/40'}>
                  <th className="border-t border-themed p-4 text-start font-medium text-heading">{row.label}</th>
                  {products.map((p) => (
                    <td key={p.slug} className="border-t border-themed p-4 text-center text-body">{row.value(p)}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <th className="border-t border-themed p-4 text-start font-medium text-heading">{t('compare.specs')}</th>
                {products.map((p) => (
                  <td key={p.slug} className="border-t border-themed p-4 align-top">
                    <dl className="space-y-3">
                      {p.specs.map((spec) => (
                        <div key={spec.label}>
                          <dt className="font-semibold text-heading">{spec.label}</dt>
                          <dd className="mt-1 text-xs leading-5 text-muted">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-muted">{t('compare.limit')}</p>
    </main>
  )
}
