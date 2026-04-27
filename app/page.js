"use client"

const featuredAds = [
  {
    title: "iPhone 15 Pro Max — Titanium Black",
    desc: "Flagship phone in pristine condition. 256GB, full box, AppleCare+ until 2026.",
    price: "Rs. 1,149",
    badge: "Featured",
    category: "Mobiles",
    location: "Karachi",
    href: "/ads/1",
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    desc: "Latest flagship with S Pen, 512GB storage, all accessories included.",
    price: "Rs. 1,019",
    badge: "Featured",
    category: "Mobiles",
    location: "Lahore",
    href: "/ads/2",
  },
  {
    title: "Google Pixel 8 Pro",
    desc: "Excellent camera performance, 128GB, minor wear but fully functional.",
    price: "Rs. 839",
    badge: "Featured",
    category: "Electronics",
    location: "Islamabad",
    href: "/ads/3",
  },
]

const categories = [
  { icon: "💻", name: "Electronics" },
  { icon: "🚗", name: "Vehicles" },
  { icon: "🏠", name: "Real Estate" },
  { icon: "🔧", name: "Services" },
  { icon: "💼", name: "Jobs" },
  { icon: "👗", name: "Fashion" },
  { icon: "🛋️", name: "Home" },
  { icon: "🐕", name: "Pets" },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.14),_transparent_22%),linear-gradient(180deg,_#04050a_0%,_#080911_45%,_#0b1124_100%)] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(139,92,246,0.22),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_22%)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-200 shadow-lg shadow-violet-500/10 mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified ads, secure buying
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-white">
              Buy, sell, and discover <span className="bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent">anything, anywhere.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              From flagship phones to premium cars, list your item in under a minute and connect with buyers instantly.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <a href="/ads" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5">
                Browse ads
              </a>
              <a href="/ads/new" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/20">
                Post an ad
              </a>
            </div>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Active ads", value: "12K+" },
              { label: "Verified sellers", value: "7K+" },
              { label: "Cities", value: "65+" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <p className="text-3xl font-black text-white">{item.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-purple-300">Browse by category</p>
            <h2 className="mt-2 text-3xl font-black text-white">Find exactly what you're looking for.</h2>
          </div>
          <a href="/categories" className="text-sm font-medium text-violet-300 hover:text-white transition">
            View all →
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((item) => (
            <a key={item.name} href={`/ads?cat=${encodeURIComponent(item.name)}`} className="group rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-center transition hover:border-violet-400/30 hover:bg-violet-500/5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl transition group-hover:bg-violet-500/10">
                {item.icon}
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-100">{item.name}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Featured ads★</p>
            <h2 className="mt-2 text-3xl font-black text-white">Hand-picked listings from top sellers.</h2>
          </div>
          <a href="/ads" className="text-sm font-medium text-violet-300 hover:text-white transition">
            See all ads →
          </a>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {featuredAds.map((ad) => (
            <a key={ad.title} href={ad.href} className="group block overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 transition hover:-translate-y-0.5 hover:border-violet-400/20">
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-violet-200">{ad.badge}</span>
                <span className="text-xs uppercase tracking-[0.22em] text-slate-400">{ad.category}</span>
              </div>
              <h3 className="text-xl font-black text-white mb-3">{ad.title}</h3>
              <p className="text-sm leading-6 text-slate-300 mb-5">{ad.desc}</p>
              <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
                <span>{ad.location}</span>
                <span className="text-white font-semibold">{ad.price}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-28">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 to-[#0b0f1c]/80 p-10 shadow-2xl shadow-violet-500/10">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">List your item free</p>
              <h2 className="mt-4 text-3xl font-black text-white">Got something to sell? List it free.</h2>
              <p className="mt-4 max-w-2xl text-slate-300 leading-relaxed">
                Reach thousands of buyers in your city with just a few clicks. Post your first ad in under a minute and manage conversations from a single dashboard.
              </p>
            </div>
            <a href="/ads/new" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5">
              Post an ad now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
