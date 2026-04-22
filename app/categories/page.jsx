const CATS = [
  { icon: "💻", name: "Electronics", count: "1,240", href: "/explore?cat=Electronics" },
  { icon: "🚗", name: "Vehicles", count: "856", href: "/explore?cat=Vehicles" },
  { icon: "🏠", name: "Real Estate", count: "432", href: "/explore?cat=Real+Estate" },
  { icon: "🔧", name: "Services", count: "210", href: "/explore?cat=Services" },
  { icon: "💼", name: "Jobs", count: "185", href: "/explore?cat=Jobs" },
  { icon: "👗", name: "Fashion", count: "950", href: "/explore?cat=Fashion" },
  { icon: "🛋️", name: "Home & Garden", count: "320", href: "/explore?cat=Home+%26+Garden" },
  { icon: "🐕", name: "Pets", count: "150", href: "/explore?cat=Pets" },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Browse by{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Category
            </span>
          </h1>
          <p className="text-gray-400 text-base">Find everything you need organized in perfectly curated categories.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATS.map((cat) => (
            <a key={cat.name} href={cat.href}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-violet-500/40 hover:bg-white/8 transition group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition">{cat.icon}</div>
              <h3 className="font-bold text-sm mb-1">{cat.name}</h3>
              <p className="text-gray-500 text-xs">{cat.count} Active Ads</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}