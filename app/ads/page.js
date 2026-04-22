"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const CATEGORIES = ["All","Electronics","Vehicles","Real Estate","Services","Jobs","Fashion","Home & Garden","Pets","Accessories"];

const timeAgo = (date) => {
  if (!date) return "";
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const BADGE = {
  premium: "bg-violet-600 text-white",
  standard: "bg-amber-500 text-white",
  basic: "bg-gray-600 text-white",
};

export default function AdsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      let query = supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });

      if (category !== "All") query = query.eq("category", category);

      const { data, error } = await query;
      if (error) console.error(error);
      setAds(data || []);
      setLoading(false);
    };
    fetchAds();
  }, [category]);

  const filtered = ads.filter((ad) =>
    ad.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0b14] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">

        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <div className="bg-[#111120] border border-white/[0.07] rounded-2xl p-4 md:sticky md:top-20">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">⚡ Filters</p>

            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ads..."
              className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 mb-4 transition" />

            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Category</p>
            <ul className="space-y-0.5">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                      category === cat
                        ? "bg-violet-600/20 text-violet-300 font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                    }`}>
                    {cat}
                    {category === cat && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight">Browse Ads</h1>
              <p className="text-gray-500 text-xs mt-0.5">
                {loading ? "Loading..." : `${filtered.length} listing${filtered.length !== 1 ? "s" : ""} found`}
              </p>
            </div>
            <button onClick={() => router.push("/ads/new")}
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-lg shadow-violet-900/30">
              + Post Ad
            </button>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#111120] border border-white/[0.06] rounded-2xl h-60 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-gray-600">
              <span className="text-5xl mb-4">📭</span>
              <p className="font-semibold text-sm mb-1">No ads found</p>
              <p className="text-xs mb-4 text-gray-700">Be the first to post in this category</p>
              <button onClick={() => router.push("/ads/new")}
                className="text-violet-400 text-xs hover:underline">
                Post an Ad →
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((ad) => (
                <div key={ad.id}
                  className="bg-[#111120] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-900/10 transition-all duration-200 cursor-pointer group"
                  onClick={() => router.push(`/ads/${ad.id}`)}>

                  {/* Image area */}
                  <div className="relative h-40 bg-white/[0.03] overflow-hidden">
                    {ad.image_url ? (
                      <img src={ad.image_url} alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl opacity-20">📷</span>
                      </div>
                    )}
                    {/* Package badge */}
                    {ad.package_type && (
                      <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${BADGE[ad.package_type] || BADGE.basic}`}>
                        {ad.package_type}
                      </span>
                    )}
                    {/* Category tag */}
                    <span className="absolute bottom-2 left-2.5 bg-black/60 backdrop-blur-sm text-[10px] text-gray-300 px-2 py-0.5 rounded-md border border-white/10">
                      {ad.category}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <h2 className="font-bold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-violet-300 transition-colors">
                      {ad.title}
                    </h2>
                    <p className="text-emerald-400 font-black text-lg">
                      Rs. {Number(ad.price || 0).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-white/[0.05]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-violet-600/70 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {(ad.seller_name || "A")[0].toUpperCase()}
                        </div>
                        <span className="text-gray-500 text-[11px] truncate">
                          {ad.seller_name || "Seller"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {ad.location && (
                          <span className="text-gray-600 text-[10px]">📍 {ad.location}</span>
                        )}
                        <span className="text-gray-700 text-[10px]">{timeAgo(ad.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <p className="text-center text-gray-700 text-xs mt-8">
              Showing {filtered.length} of {filtered.length} listings
            </p>
          )}
        </div>
      </div>
    </div>
  );
}