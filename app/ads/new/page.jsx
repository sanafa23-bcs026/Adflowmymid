"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";

const CATEGORIES = [
  "Electronics", "Vehicles", "Real Estate", "Services",
  "Jobs", "Fashion", "Home & Garden", "Pets", "Accessories", "Other"
];

export default function PostAdPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const title = e.target.title.value.trim();
    const category = e.target.category.value;
    const price = e.target.price.value.trim();
    const description = e.target.description.value.trim();
    const location = e.target.location.value.trim();

    if (!title || !category || !price || !description) {
      return setError("Please fill all required fields.");
    }

    if (category === "") {
      return setError("Please select a category.");
    }

    setLoading(true);

    try {
      // Get session (optional — don't block if not logged in)
      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUser = sessionData?.session?.user;

      const insertData = {
        title,
        category,
        price: parseFloat(price),
        description,
        location: location || null,
        status: "pending",
        seller_name: sessionUser?.user_metadata?.full_name
          || sessionUser?.email?.split("@")[0]
          || "Anonymous",
      };

      if (sessionUser?.id) {
        insertData.user_id = sessionUser.id;
      }

      const { data, error: dbError } = await supabase
        .from("ads")
        .insert([insertData])
        .select();

      if (dbError) {
        console.log("DB Error details:", JSON.stringify(dbError));
        setError(dbError.message || "Failed to post ad. Check Supabase RLS policies.");
        setLoading(false);
        return;
      }

      console.log("Ad posted:", data);
      setSuccess(true);
    } catch (err) {
      setError("Unexpected error. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0b0b14] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-5">🎉</div>
          <h2 className="text-2xl font-black mb-2">Ad Submitted!</h2>
          <p className="text-gray-400 text-sm mb-7">Your ad is under review and will go live soon.</p>
          <div className="flex gap-3 justify-center">
            <a href="/explore"
              className="bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-xl text-sm font-semibold transition">
              Browse Ads →
            </a>
            <a href="/ads/new"
              className="border border-white/10 hover:bg-white/5 px-5 py-2.5 rounded-xl text-sm transition">
              Post Another
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b14] text-white px-4 py-10">
      <div className="max-w-lg mx-auto">

        <a href="/explore"
          className="inline-flex items-center gap-1.5 text-gray-600 hover:text-white text-sm mb-7 transition">
          ← Back
        </a>

        <div className="mb-7">
          <h1 className="text-2xl font-black mb-1">Post an Ad</h1>
          <p className="text-gray-500 text-sm">Fill in the details. Your ad will be reviewed before going live.</p>
        </div>

        {error && (
          <div className="bg-red-500/[0.08] border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-5 flex gap-2">
            <span className="shrink-0">✕</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Basic Info Card */}
          <div className="bg-[#111120] border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Basic Info</p>

            {/* Title */}
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Ad Title *</label>
              <input name="title" placeholder="e.g. iPhone 15 Pro Max — 256GB"
                className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition" />
            </div>

            {/* Category */}
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Category *</label>
              <select name="category"
                className="w-full bg-[#0b0b14] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition appearance-none">
                <option value="">Select a category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price + Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Price (Rs.) *</label>
                <input name="price" type="number" min="0" placeholder="50000"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition" />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Location</label>
                <input name="location" placeholder="Lahore"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition" />
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-[#111120] border border-white/[0.06] rounded-2xl p-5">
            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-3">Description *</p>
            <textarea name="description" rows={5}
              placeholder="Describe your item — condition, features, why you're selling..."
              className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition resize-none" />
          </div>

          <button disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 rounded-xl font-bold text-sm transition shadow-lg shadow-violet-900/30">
            {loading ? "Submitting..." : "Post Ad →"}
          </button>

        </form>
      </div>
    </div>
  );
}