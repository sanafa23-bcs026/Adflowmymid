"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const timeAgo = (date) => {
  if (!date) return "";
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const BADGE = {
  premium: "bg-violet-500 text-white",
  standard: "bg-amber-500 text-white",
  basic: "bg-gray-500 text-white",
};

export default function AdDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchAd = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setAd(data);
      }

      setLoading(false);
    };

    fetchAd();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b1020] to-[#0a0f1c] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !ad) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-white flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🔍</span>
        <h1 className="text-2xl font-black">Ad Not Found</h1>
        <p className="text-gray-500 text-sm text-center max-w-sm">
          This listing may have been removed or doesn't exist.
        </p>

        <button
          onClick={() => router.push("/ads")}
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-violet-900/30"
        >
          ← Back to Ads
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1020] via-[#0d1326] to-[#0a0f1c] text-white">

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Back */}
        <button
          onClick={() => router.push("/ads")}
          className="text-gray-400 hover:text-white text-sm mb-6 transition"
        >
          ← Back to listings
        </button>

        <div className="grid md:grid-cols-2 gap-10">

          {/* IMAGE */}
          <div className="relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08] aspect-square shadow-xl shadow-black/30">

            {ad.image_url ? (
              <img
                src={ad.image_url}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
                📷
              </div>
            )}

            {ad.package_type && (
              <span className={`absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-lg uppercase ${BADGE[ad.package_type] || BADGE.basic}`}>
                {ad.package_type}
              </span>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex flex-col gap-5">

            {ad.category && (
              <span className="bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs px-3 py-1 rounded-full w-fit">
                {ad.category}
              </span>
            )}

            <h1 className="text-3xl font-black leading-snug">
              {ad.title}
            </h1>

            <p className="text-emerald-400 font-extrabold text-3xl">
              Rs. {Number(ad.price || 0).toLocaleString()}
            </p>

            {ad.description && (
              <p className="text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-4">
                {ad.description}
              </p>
            )}

            {/* SELLER BOX */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 backdrop-blur">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center font-bold">
                  {(ad.seller_name || "S")[0].toUpperCase()}
                </div>

                <div>
                  <p className="font-semibold">{ad.seller_name || "Seller"}</p>
                  <p className="text-gray-500 text-xs">Verified Seller</p>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-sm text-gray-400">

                {ad.location && (
                  <p>📍 {ad.location}</p>
                )}

                {ad.phone && (
                  <p>📞 {ad.phone}</p>
                )}

                <p className="text-xs text-gray-500 pt-2 border-t border-white/5">
                  🕐 Posted {timeAgo(ad.created_at)}
                </p>

              </div>
            </div>

            {/* ACTIONS */}
            {ad.phone && (
              <a
                href={`tel:${ad.phone}`}
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl text-center transition shadow-lg shadow-violet-900/30"
              >
                📞 Contact Seller
              </a>
            )}

            {ad.whatsapp && (
              <a
                href={`https://wa.me/${ad.whatsapp}`}
                target="_blank"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-center transition"
              >
                💬 WhatsApp
              </a>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}