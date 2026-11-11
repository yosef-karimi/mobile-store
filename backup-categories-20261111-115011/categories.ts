import type { Category } from './types'

export const categories: Category[] = [
  {
    id: 1,
    slug: 'eletronicos',
    name: 'گوشی موبایل',
    icon: 'smartphone',
    description: 'انواع گوشی‌های هوشمند',
  },
  {
    id: 2,
    slug: 'acessorios',
    name: 'لوازم جانبی موبایل',
    icon: 'headphones',
    description: 'لوازم و تجهیزات جانبی گوشی موبایل',
  },
]

export function findCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
