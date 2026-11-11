import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Category } from '@/data/types'
import IconBase from '@/components/ui/IconBase'

const categoryStyles: Record<string, string> = {
  phones: 'bg-sky-500/10 text-sky-600 ring-sky-500/20 group-hover:bg-sky-600',
  tablets: 'bg-violet-500/10 text-violet-600 ring-violet-500/20 group-hover:bg-violet-600',
  laptops: 'bg-indigo-500/10 text-indigo-600 ring-indigo-500/20 group-hover:bg-indigo-600',
  headphones: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 group-hover:bg-amber-500',
  smartwatches: 'bg-rose-500/10 text-rose-600 ring-rose-500/20 group-hover:bg-rose-500',
  others: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 group-hover:bg-emerald-600',
}

export default function CategoryCard({ category }: { category: Category }) {
  const { t } = useTranslation()

  return (
    <Link
      to={`/categoria/${category.slug}`}
      className="surface-card group flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-theme-md"
    >
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-2xl ring-1 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:text-white group-hover:shadow-lg dark:brightness-110 ${
          categoryStyles[category.slug] ?? 'bg-brand-50 text-brand-500 ring-brand-500/20 group-hover:bg-brand-500'
        }`}
      >
        <IconBase name={category.icon} size={31} strokeWidth={1.7} />
      </span>

      <div>
        <h3 className="font-semibold text-heading transition-colors">
          {t(`categories.${category.slug}.name`)}
        </h3>
        <p className="mt-1 text-xs text-muted">
          {t(`categories.${category.slug}.desc`)}
        </p>
      </div>
    </Link>
  )
}
