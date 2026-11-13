import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { categories } from '@/data/categories'
import { products, productImages } from '@/data/products'
import { useUiStore } from '@/stores/ui'
import ProductCard from '@/components/product/ProductCard'
import CategoryCard from '@/components/catalog/CategoryCard'
import SectionHeader from '@/components/ui/SectionHeader'
import IconBase from '@/components/ui/IconBase'

const BENEFITS = [
  { icon: 'truck', titleKey: 'home.benefits.shippingTitle', descKey: 'home.benefits.shippingDesc' },
  { icon: 'shield-check', titleKey: 'home.benefits.secureTitle', descKey: 'home.benefits.secureDesc' },
  { icon: 'refresh', titleKey: 'home.benefits.returnTitle', descKey: 'home.benefits.returnDesc' },
  { icon: 'clock', titleKey: 'home.benefits.supportTitle', descKey: 'home.benefits.supportDesc' },
]

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const notify = useUiStore((s) => s.notifySuccess)
  const [email, setEmail] = useState('')

  const featured = products.filter((p) => p.featured).slice(0, 8)
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4)
  const [dealTime, setDealTime] = useState(4 * 3600 + 34 * 60 + 56)
  const dealSliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDealTime((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const language = i18n.language.startsWith('fa')
    ? 'fa'
    : i18n.language.startsWith('ar')
      ? 'ar'
      : 'en'

  const promoText = {
    fa: {
      phone: 'چه گوشی بخریم با بودجه ۲۰ میلیون تومان؟',
      read: 'همین الان بخوانید',
      raffle: 'با شرکت در قرعه‌کشی',
      win: 'برنده PS5 شوید!',
      special: 'ویژه 🎮',
      deal: 'پیشنهاد شگفت‌انگیز',
      all: 'مشاهده همه',
      hour: 'ساعت',
      minute: 'دقیقه',
      second: 'ثانیه',
      toman: 'تومان',
    },
    en: {
      phone: 'Which phone should you buy with a 20 million Toman budget?',
      read: 'Read now',
      raffle: 'Join our giveaway',
      win: 'Win a PS5!',
      special: 'Special 🎮',
      deal: 'Amazing Deals',
      all: 'View all',
      hour: 'Hours',
      minute: 'Minutes',
      second: 'Seconds',
      toman: 'Toman',
    },
    ar: {
      phone: 'ما الهاتف الذي يمكنك شراؤه بميزانية 20 مليون تومان؟',
      read: 'اقرأ الآن',
      raffle: 'شارك في السحب',
      win: 'واربح PS5!',
      special: 'عرض خاص 🎮',
      deal: 'عروض مذهلة',
      all: 'مشاهدة الكل',
      hour: 'ساعة',
      minute: 'دقيقة',
      second: 'ثانية',
      toman: 'تومان',
    },
  }[language]

  const dealProducts = products
    .filter((p) => p.priceOld && p.priceOld > p.price && p.stock > 0)
    .slice(0, 8)

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(
      language === 'fa' ? 'fa-IR' : language === 'ar' ? 'ar' : 'en-US'
    ).format(value)

  const hours = String(Math.floor(dealTime / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((dealTime % 3600) / 60)).padStart(2, '0')
  const seconds = String(dealTime % 60).padStart(2, '0')

  function subscribe(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    notify(t('home.newsletterSuccess'))
    setEmail('')
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-gray-900 dark:via-gray-dark dark:to-gray-900">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-500/10" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <IconBase name="zap" size={14} />
              {t('home.heroBadge')}
            </span>
            <h1 className="mt-5 text-title-sm font-bold leading-tight text-heading sm:text-title-md lg:text-title-lg">
              {t('home.heroTitle')}
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted">{t('home.heroSubtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/produtos"
                className="flex h-12 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white shadow-theme-md transition hover:bg-brand-600"
              >
                <IconBase name="cart" size={18} />
                {t('home.heroCta')}
              </Link>
              <Link
                to="/produtos?sort=price-asc"
                className="flex h-12 items-center rounded-lg border border-themed bg-white px-6 text-sm font-medium text-body transition hover:bg-gray-50 dark:bg-gray-dark dark:hover:bg-gray-800"
              >
                {t('home.heroSecondary')}
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {products.slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  to={`/produto/${p.slug}`}
                  className={`overflow-hidden rounded-2xl border border-themed shadow-theme-md ${i % 2 ? 'mt-8' : ''}`}
                >
                  <img
                    src={productImages(p.slug)[0]}
                    alt={p.name}
                    className="aspect-square w-full object-cover transition hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-themed bg-white dark:bg-gray-dark">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {BENEFITS.map((b) => (
            <div key={b.icon} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">
                <IconBase name={b.icon} size={22} />
              </span>
              <div>
                <p className="text-sm font-semibold text-heading">{t(b.titleKey)}</p>
                <p className="text-xs text-muted">{t(b.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader title={t('home.featuredCategories')} linkTo="/produtos" linkLabel={t('common.viewAll')} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-white dark:bg-gray-dark">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeader title={t('home.featuredProducts')} linkTo="/produtos" linkLabel={t('common.viewAll')} />
          <div className="portfolio-featured-slider -mx-4 overflow-x-auto px-4 pb-5 sm:mx-0 sm:px-0">
            <div className="flex snap-x snap-mandatory gap-4">
              {featured.map((p) => (
                <div
                  key={p.id}
                  className="w-[min(76vw,280px)] shrink-0 snap-start sm:w-[min(42vw,280px)] lg:w-[calc(25%-12px)]"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Promotional banners and amazing deals */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div dir={language === 'en' ? 'ltr' : 'rtl'}>
          {/* Top promotional banners */}
          <div className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Link
              to="/produtos"
              className="group relative flex min-h-[190px] items-center justify-between overflow-hidden rounded-[22px] bg-gradient-to-r from-[#1d315b] to-[#1d2044] p-7 text-white shadow-sm transition hover:-translate-y-1"
            >
              <div className="relative z-10 max-w-[82%]">
                <h3 className="text-lg font-bold leading-8 sm:text-xl">
                  {promoText.phone}
                </h3>
                <span className="mt-3 inline-flex rounded-full bg-[#818cf8] px-5 py-2 text-xs font-bold text-white transition group-hover:bg-[#6366f1]">
                  {promoText.read}
                </span>
              </div>
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-6xl opacity-15">
                📱
              </span>
            </Link>

            <Link
              to="/produtos"
              className="group relative flex min-h-[190px] items-center justify-between overflow-hidden rounded-[22px] bg-gradient-to-r from-[#24171c] to-[#302066] p-7 text-white shadow-sm transition hover:-translate-y-1"
            >
              <div className="relative z-10">
                <span className="mb-2 inline-flex rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1 text-[10px] font-bold text-red-300">
                  {promoText.special}
                </span>
                <h3 className="text-lg font-bold leading-8 sm:text-xl">
                  {promoText.raffle}
                  <br />
                  <span className="text-red-400">{promoText.win}</span>
                </h3>
                <span className="mt-3 inline-flex rounded-full bg-[#ef4444] px-5 py-2 text-xs font-bold text-white transition group-hover:bg-red-600">
                  {promoText.read}
                </span>
              </div>
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-6xl opacity-10">
                🎮
              </span>
            </Link>
          </div>

          {/* Flash sale */}
          <div className="overflow-hidden rounded-2xl border-2 border-red-500 shadow-[0_12px_40px_rgba(239,68,68,0.12)]">
            <div className="flex flex-row">
              {/* Countdown panel */}
              <div className="order-first flex w-[124px] shrink-0 flex-col items-center justify-center bg-gradient-to-b from-[#f04449] to-[#bd171d] px-2 py-4 text-center text-white sm:w-[140px] sm:px-3 md:w-[200px] md:px-5 md:py-7">
                <h2 className="mb-3 text-sm font-black leading-6 sm:text-base md:mb-5 md:text-xl md:leading-8">
                  {promoText.deal}
                </h2>

                <div className="flex w-full max-w-[190px] items-start justify-between gap-1" dir="ltr">
                  {[hours, minutes, seconds].map((value, index) => (
                    <div key={index} className="flex min-w-0 flex-1 flex-col items-center text-center">
                      <div className="flex h-11 w-full max-w-[48px] items-center justify-center rounded-xl bg-[#171717] text-2xl font-black shadow-lg">
                        {value}
                      </div>
                      <p className="mt-2 w-full whitespace-nowrap text-[10px] font-semibold text-center">
                        {[promoText.hour, promoText.minute, promoText.second][index]}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  to="/produtos?sort=discount"
                  className="mt-4 rounded-full bg-white/20 px-3 py-2 text-[10px] font-bold transition hover:bg-white/30 md:mt-6 md:px-5 md:py-2.5 md:text-xs"
                >
                  {promoText.all} ‹
                </Link>
              </div>

              {/* Product slider */}
              <div className="relative min-w-0 flex-1 bg-white dark:bg-gray-dark">
                <div
                  ref={dealSliderRef}
                  className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
                >
                  {dealProducts.map((p) => {
                    const discount = Math.round(
                      ((p.priceOld! - p.price) / p.priceOld!) * 100
                    )

                    return (
                      <Link
                        key={p.id}
                        to={`/produto/${p.slug}`}
                        className="group flex w-[190px] shrink-0 snap-start flex-col border-e border-gray-100 p-4 transition hover:bg-red-50/40 dark:border-gray-700 dark:hover:bg-gray-800/60"
                      >
                        <div className="relative mb-3 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
                          <img
                            src={productImages(p.slug)[0]}
                            alt={p.name}
                            className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                          />
                          <span className="absolute bottom-2 right-2 rounded-lg bg-red-500 px-2.5 py-1 text-[11px] font-black text-white shadow">
                            {formatPrice(discount)}٪
                          </span>
                        </div>

                        <h3 className="min-h-[42px] text-center text-xs font-bold leading-6 text-heading">
                          {p.name}
                        </h3>

                        <div className="mt-auto pt-3 text-center">
                          <p className="text-[10px] text-muted line-through">
                            {formatPrice(p.priceOld!)}
                          </p>
                          <p className="mt-1 text-xs font-black text-red-500">
                            {formatPrice(p.price)} {promoText.toman}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                <button
                  type="button"
                  aria-label="Scroll products"
                  onClick={() =>
                    dealSliderRef.current?.scrollBy({
                      left: -380,
                      behavior: 'smooth',
                    })
                  }
                  className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 text-3xl text-white shadow-lg transition hover:bg-red-600"
                >
                  ›
                </button>

                <button
                  type="button"
                  aria-label="Scroll products right"
                  onClick={() =>
                    dealSliderRef.current?.scrollBy({
                      left: 380,
                      behavior: 'smooth',
                    })
                  }
                  className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 text-3xl text-white shadow-lg transition hover:bg-red-600"
                >
                  ‹
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-white dark:bg-gray-dark">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeader title={t('home.bestsellers')} linkTo="/produtos?sort=rating" linkLabel={t('common.viewAll')} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-themed bg-gray-50 p-8 text-center dark:bg-gray-900/40 sm:p-12">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-white">
            <IconBase name="mail" size={26} />
          </span>
          <h2 className="mt-5 text-2xl font-bold text-heading">{t('home.newsletterTitle')}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">{t('home.newsletterSubtitle')}</p>
          <form onSubmit={subscribe} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('home.newsletterPlaceholder')}
              className="h-12 flex-1 rounded-lg border border-themed bg-white px-4 text-sm text-body outline-none focus:border-brand-300 focus-ring dark:bg-gray-900"
            />
            <button
              type="submit"
              className="h-12 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              {t('home.newsletterCta')}
            </button>
          </form>
        </div>
      </section>

      {/* Final promotional banners */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 pb-14 pt-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div
          dir={language === 'en' ? 'ltr' : 'rtl'}
          className="group relative flex min-h-[228px] items-center justify-between overflow-hidden rounded-[24px] bg-gradient-to-l from-[#625cf0] to-[#6665f5] p-8 text-white shadow-sm transition hover:-translate-y-1"
        >
          <div className={`relative z-10 max-w-[78%] ${language === 'en' ? 'text-left' : 'text-right'}`}>
            <h2 className="text-xl font-black leading-8">
              {language === 'en' ? 'Authenticity Guarantee' : language === 'ar' ? 'ضمان الأصالة' : 'گارانتی اصالت'}
              <br />
              {language === 'en' ? 'for All Products' : language === 'ar' ? 'لجميع المنتجات' : 'برای همه محصولات'}
            </h2>
            <p className="mt-3 text-xs text-white/75">
              {language === 'en' ? '18-month after-sales support' : language === 'ar' ? 'دعم ما بعد البيع لمدة 18 شهراً' : '۱۸ ماه پشتیبانی پس از فروش'}
            </p>
            <Link
              to="/produtos"
              className="mt-5 inline-flex rounded-xl border border-white/25 bg-white/15 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/25"
            >
              {language === 'en' ? 'Learn more' : language === 'ar' ? 'اعرف المزيد' : 'بیشتر بدانید'} ←
            </Link>
          </div>
          <span className="absolute left-8 top-1/2 -translate-y-1/2 text-7xl opacity-20 transition group-hover:scale-110">
            🛡️
          </span>
        </div>

        <div
          dir={language === 'en' ? 'ltr' : 'rtl'}
          className="group relative flex min-h-[228px] items-center justify-between overflow-hidden rounded-[24px] bg-[#101010] p-8 text-white shadow-sm transition hover:-translate-y-1"
        >
          <div className={`relative z-10 max-w-[78%] ${language === 'en' ? 'text-left' : 'text-right'}`}>
            <h2 className="text-xl font-black leading-8">
              {language === 'en' ? 'Up to 40% Off' : language === 'ar' ? 'خصم يصل إلى 40٪' : 'تا ۴۰٪ تخفیف'}
              <br />
              {language === 'en' ? 'Apple iPhones' : language === 'ar' ? 'على آيفون أبل' : 'آیفون‌های اپل'}
            </h2>
            <p className="mt-3 text-xs text-white/65">
              {language === 'en' ? 'Limited offer — this week only' : language === 'ar' ? 'عرض محدود — هذا الأسبوع فقط' : 'فرصت محدود — فقط این هفته'}
            </p>
            <Link
              to="/produtos?search=iphone&sort=discount"
              className="mt-5 inline-flex rounded-xl border border-white/20 bg-white/15 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/25"
            >
              {language === 'en' ? 'Shop now' : language === 'ar' ? 'تسوق الآن' : 'همین الان خرید کن'} ←
            </Link>
          </div>
          <span className="absolute left-8 top-1/2 -translate-y-1/2 text-7xl opacity-25 transition group-hover:scale-110">
            🍎
          </span>
        </div>
      </section>
    </div>
  )
}
