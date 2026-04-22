"use client";
import { useState } from "react";

export default function CreateAd() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status: "approved",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("Ad Created Successfully 🔥");

      setTitle("");
      setDescription("");

    } catch (error) {
      alert("Error creating ad ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#040408] via-[#0b0b1f] to-[#020203] flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-xl">

        {/* Heading */}
        <h1 className="text-2xl font-extrabold mb-1 text-white">
          Create New Ad
        </h1>
        <p className="text-gray-400 text-sm mb-5">
          Fill the details below to publish your listing
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <input
            type="text"
            placeholder="Ad Title"
            className="w-full bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-500 p-3 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Description */}
          <textarea
            placeholder="Ad Description"
            rows={4}
            className="w-full bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-500 p-3 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-purple-900/30"
          >
            {loading ? "Submitting..." : "Post Ad 🚀"}
          </button>

        </form>

      </div>

    </div>
  );
}