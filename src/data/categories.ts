import type { Category } from './types'

export const categories: Category[] = [
  {
    id: 1,
    slug: 'phones',
    name: 'گوشی',
    icon: 'smartphone',
    description: 'انواع گوشی‌های هوشمند',
  },
  {
    id: 2,
    slug: 'tablets',
    name: 'تبلت',
    icon: 'tablet',
    description: 'انواع تبلت‌ها',
  },
  {
    id: 3,
    slug: 'laptops',
    name: 'لپ‌تاپ',
    icon: 'laptop',
    description: 'انواع لپ‌تاپ‌ها',
  },
  {
    id: 4,
    slug: 'headphones',
    name: 'هدفون و هندزفری',
    icon: 'headphones',
    description: 'انواع هدفون و هندزفری',
  },
  {
    id: 5,
    slug: 'smartwatches',
    name: 'ساعت هوشمند',
    icon: 'watch',
    description: 'انواع ساعت و مچ‌بند هوشمند',
  },
  {
    id: 6,
    slug: 'others',
    name: 'سایر',
    icon: 'others',
    description: 'سایر لوازم و تجهیزات دیجیتال',
  },
]

export function findCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
