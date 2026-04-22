export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/80 to-slate-900 text-white">

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 pt-24 pb-16 text-center">
        {/* Pakistan’s Premium Classifieds */}
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase
          text-purple-400
          border border-purple-500/25
          bg-purple-500/[0.07]
          px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Pakistan’s Premium Classifieds
        </span>

        {/* Main titles (unchanged text, improved gradient) */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-5">
          Buy & Sell{" "}
          <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
            Anything
          </span>
          <br />
          with Confidence
        </h1>

        {/* Description (text same, color better) */}
        <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed mb-10">
          Verified ads, secure payments, and real buyers — all in one place. Join thousands of sellers across Pakistan.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 justify-center flex-wrap">
          <a
            href="/ads"
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold px-7 py-3.5 rounded-xl transition shadow-lg shadow-purple-900/40 text-sm"
          >
            Browse Ads →
          </a>
          <a
            href="/ads/new"
            className="border border-white/[0.12] hover:border-white/25 hover:bg-white/[0.04] text-white font-semibold px-7 py-3.5 rounded-xl transition text-sm"
          >
            Post an Ad
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-12 text-center">
          <div className="space-y-0.5">
            <p className="text-xl md:text-2xl font-black text-white">10K+</p>
            <p className="text-gray-400 text-xs">Active Ads</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xl md:text-2xl font-black text-white">5K+</p>
            <p className="text-gray-400 text-xs">Verified Sellers</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xl md:text-2xl font-black text-white">50+</p>
            <p className="text-gray-400 text-xs">Cities</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-5 pb-20">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "💰",
              title: "Verified Payments",
              desc: "JazzCash, EasyPaisa and bank transfer — payments confirmed before delivery.",
              color: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/15 bg-[#0d1c15]",
            },
            {
              icon: "✅",
              title: "Moderated Ads",
              desc: "Every listing is reviewed by our team before going live.",
              color: "from-violet-500/10 to-violet-500/5 border-violet-500/15 bg-[#111124]",
            },
            {
              icon: "⭐",
              title: "Featured Campaigns",
              desc: "Boost your ad to the top so more buyers see it instantly.",
              color: "from-amber-500/10 to-amber-500/5 border-amber-500/15 bg-[#1e160e]",
            },
          ].map((f) => (
            <div key={f.title} className={`bg-gradient-to-br ${f.color} border rounded-2xl p-6 hover:scale-[1.02] transition-all duration-200`}>
              <span className="text-3xl block mb-4">{f.icon}</span>
              <h3 className="font-bold text-[15px] mb-2">{f.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-5 pb-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black">Browse Categories</h2>
          <a href="/categories" className="text-purple-400 text-xs hover:underline transition">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2.5">
          {[
            { icon: "💻", name: "Electronics" },
            { icon: "🚗", name: "Vehicles" },
            { icon: "🏠", name: "Real Estate" },
            { icon: "🔧", name: "Services" },
            { icon: "💼", name: "Jobs" },
            { icon: "👗", name: "Fashion" },
            { icon: "🛋️", name: "Home" },
            { icon: "🐕", name: "Pets" },
          ].map((c) => (
            <a
              key={c.name}
              href={`/ads?cat=${c.name}`}
              className="bg-[#121422] border border-white/[0.08] rounded-xl p-3 text-center hover:border-purple-500/30 hover:bg-purple-500/[0.06] transition group"
            >
              <span className="text-2xl block mb-1.5 group-hover:scale-110 transition-transform">{c.icon}</span>
              <span className="text-[10px] text-gray-400 group-hover:text-white transition">{c.name}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}