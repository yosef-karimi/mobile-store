import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isAdminAuthenticated, logoutAdmin } from '@/stores/admin'
import { useOrdersStore, type OrderStatus } from '@/stores/orders'
import { useUiStore } from '@/stores/ui'
import { formatPrice } from '@/lib/format'
import IconBase from '@/components/ui/IconBase'

type FilterStatus = 'all' | OrderStatus

export default function AdminPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const orders = useOrdersStore((s) => s.orders)
  const updateOrderStatus = useOrdersStore((s) => s.updateOrderStatus)
  const notify = useUiStore((s) => s.notifySuccess)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (!isAdminAuthenticated()) {
    return <Navigate to="/login?mode=admin" replace />
  }

  const counts = {
    all: orders.length,
    placed: orders.filter((o) => o.status === 'placed').length,
    paid: orders.filter((o) => o.status === 'paid').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  }

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesStatus = filter === 'all' || order.status === filter
      const matchesSearch = !term || [
        order.id,
        order.customerName,
        order.customerEmail,
        order.customerPhone,
        order.shippingAddress,
      ].some((value) => String(value || '').toLowerCase().includes(term))
      return matchesStatus && matchesSearch
    })
  }, [orders, search, filter])

  function handleLogout() {
    logoutAdmin()
    navigate('/login?mode=admin', { replace: true })
  }

  function changeStatus(id: string, status: OrderStatus) {
    updateOrderStatus(id, status)
    notify(t('admin.statusUpdated'))
  }

  const statusOptions: OrderStatus[] = ['placed', 'paid', 'shipped', 'delivered']

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 text-body dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white">
                <IconBase name="shield-check" size={23} />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-heading">{t('admin.title')}</h1>
                <p className="mt-1 text-sm text-muted">{t('admin.subtitle')}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 items-center gap-2 rounded-lg border border-themed bg-white px-4 text-sm font-medium text-body transition hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <IconBase name="logout" size={17} />
            {t('admin.logout')}
          </button>
        </header>

        <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {([
            ['all', 'admin.totalOrders'],
            ['placed', 'admin.placed'],
            ['paid', 'admin.paid'],
            ['shipped', 'admin.shipped'],
            ['delivered', 'admin.delivered'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-xl border p-4 text-start transition ${filter === key ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10' : 'border-themed bg-white dark:bg-gray-900'}`}
            >
              <p className="text-sm text-muted">{t(label)}</p>
              <p className="mt-2 text-2xl font-bold text-heading tabular-nums">{counts[key]}</p>
            </button>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-themed bg-white shadow-sm dark:bg-gray-900">
          <div className="flex flex-col gap-3 border-b border-themed p-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-heading">{t('admin.orders')}</h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <IconBase name="search" size={17} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('admin.searchPlaceholder')}
                  className="h-10 w-full rounded-lg border border-themed bg-gray-50 px-3 text-sm text-body outline-none focus:border-brand-400 sm:w-64 dark:bg-gray-950"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterStatus)}
                className="h-10 rounded-lg border border-themed bg-gray-50 px-3 text-sm text-body outline-none focus:border-brand-400 dark:bg-gray-950"
              >
                <option value="all">{t('admin.allStatuses')}</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{t(`admin.statuses.${status}`)}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <IconBase name="package" size={36} />
              <p className="mt-3 font-medium text-heading">{t('admin.noOrders')}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredOrders.map((order) => {
                const expanded = selectedId === order.id
                return (
                  <article key={order.id} className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedId(expanded ? null : order.id)}
                        className="min-w-0 text-start"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-heading">{order.id}</span>
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-body dark:bg-gray-800">
                            {t(`admin.statuses.${order.status}`)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-body">{order.customerName || t('admin.noCustomerData')}</p>
                        <p className="mt-1 text-xs text-muted">
                          {new Date(order.createdAt).toLocaleString(i18n.language)}
                        </p>
                      </button>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="min-w-28">
                          <p className="text-xs text-muted">{t('admin.total')}</p>
                          <p className="font-semibold text-heading">{formatPrice(order.total, i18n.language)}</p>
                        </div>
                        <label className="flex flex-col gap-1 text-xs text-muted">
                          {t('admin.changeStatus')}
                          <select
                            aria-label={t('admin.changeStatus')}
                            value={order.status}
                            onChange={(e) => changeStatus(order.id, e.target.value as OrderStatus)}
                            className="h-10 min-w-36 rounded-lg border border-themed bg-gray-50 px-2 text-sm text-body dark:bg-gray-950"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>{t(`admin.statuses.${status}`)}</option>
                            ))}
                          </select>
                        </label>
                        <button
                          type="button"
                          onClick={() => setSelectedId(expanded ? null : order.id)}
                          className="flex h-10 items-center gap-2 rounded-lg border border-themed px-3 text-sm text-body hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <IconBase name={expanded ? 'chevron-down' : 'chevron-right'} size={16} />
                          {t('admin.details')}
                        </button>
                      </div>
                    </div>

                    {expanded && (
                      <div className="mt-5 grid gap-5 rounded-xl bg-gray-50 p-4 dark:bg-gray-950 md:grid-cols-2">
                        <div>
                          <h3 className="mb-3 font-semibold text-heading">{t('admin.customer')}</h3>
                          <div className="space-y-2 text-sm">
                            <p>{t('admin.name')}: {order.customerName || t('admin.noCustomerData')}</p>
                            <p>{t('admin.email')}: {order.customerEmail || t('admin.noCustomerData')}</p>
                            <p>{t('admin.phone')}: {order.customerPhone || t('admin.noCustomerData')}</p>
                            <p className="break-words">{t('admin.address')}: {order.shippingAddress}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="mb-3 font-semibold text-heading">{t('admin.orderInfo')}</h3>
                          <div className="space-y-2 text-sm">
                            <p>{t('admin.payment')}: {t(`admin.payments.${order.payment}`)}</p>
                            <p>{t('admin.subtotal')}: {formatPrice(order.subtotal, i18n.language)}</p>
                            <p>{t('admin.shipping')}: {formatPrice(order.shipping, i18n.language)}</p>
                            <p>{t('admin.discount')}: {formatPrice(order.discount, i18n.language)}</p>
                            <p className="font-semibold text-heading">{t('admin.total')}: {formatPrice(order.total, i18n.language)}</p>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <h3 className="mb-3 font-semibold text-heading">{t('admin.items')}</h3>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-themed bg-white p-3 text-sm dark:bg-gray-900">
                                <span>{item.qty} × {item.name}</span>
                                <span className="font-medium text-heading">{formatPrice(item.price * item.qty, i18n.language)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </section>
        <p className="mt-5 text-center text-xs text-muted">{t('admin.demoWarning')}</p>
      </div>
    </div>
  )
}
