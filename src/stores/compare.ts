import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CompareState {
  slugs: string[]
  toggle: (slug: string) => void
  remove: (slug: string) => void
  clear: () => void
  has: (slug: string) => boolean
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle(slug) {
        const current = get().slugs
        if (current.includes(slug)) {
          set({ slugs: current.filter((item) => item !== slug) })
          return
        }
        if (current.length >= 4) return
        set({ slugs: [...current, slug] })
      },
      remove(slug) {
        set((state) => ({ slugs: state.slugs.filter((item) => item !== slug) }))
      },
      clear() {
        set({ slugs: [] })
      },
      has(slug) {
        return get().slugs.includes(slug)
      },
    }),
    { name: 'shop-compare' }
  )
)
