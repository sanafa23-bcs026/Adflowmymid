'use client'

import { formatAdPrice } from "@/lib/adHelpers";

export default function AdCard({
  ad,
  inCart = false,
  loading = false,
  onView,
  onToggleCart,
}) {
  const priceLabel = formatAdPrice(ad?.price);

  const handleCardClick = () => {
    if (onView) onView(ad);
  };

  const handleToggleCart = (event) => {
    event.stopPropagation();
    if (onToggleCart) onToggleCart(ad);
  };

  const handleViewClick = (event) => {
    event.stopPropagation();
    if (onView) onView(ad);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.05] bg-[#111120] transition-all duration-200 hover:scale-[1.02] hover:border-purple-500/30"
    >
      <div className="relative h-44 overflow-hidden bg-white/[0.03]">
        {ad?.image_url ? (
          <img
            src={ad.image_url}
            alt={ad.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-white/10">
            📷
          </div>
        )}

        {ad?.condition && (
          <span className="absolute right-2 top-2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {ad.condition}
          </span>
        )}

        {ad?.featured && (
          <span className="absolute left-2 top-2 rounded-full bg-purple-600/90 px-2 py-0.5 text-[10px] font-semibold text-white">
            ★ Featured
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="mb-1 text-[11px] uppercase tracking-wider text-purple-400">
          {ad?.category || "General"}
        </p>
        <p className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-white">
          {ad?.title || "Untitled Ad"}
        </p>
        {ad?.description && (
          <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-gray-400">
            {ad.description}
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-black text-green-400">{priceLabel}</p>
          {ad?.location && (
            <p className="max-w-[45%] truncate text-[11px] text-gray-500">
              📍 {ad.location}
            </p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleViewClick}
            className="flex-1 rounded-xl border border-white/10 px-3 py-2 text-[11px] font-semibold text-gray-300 transition hover:border-pink-400/40 hover:bg-white/[0.05] hover:text-white"
          >
            View Ad →
          </button>

          <button
            type="button"
            onClick={handleToggleCart}
            disabled={loading}
            className={`flex-1 rounded-xl px-3 py-2 text-[11px] font-semibold transition ${
              inCart
                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
                : "border border-white/10 bg-white/[0.04] text-gray-200 hover:border-fuchsia-400/30 hover:bg-white/[0.07]"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {loading ? "Updating..." : inCart ? "In Cart ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
