export default function AdCard({ ad }) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-5 hover:border-pink-400/30 hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300">

      {/* Category */}
      <span className="text-[10px] text-pink-400 font-semibold uppercase tracking-widest">
        {ad.category || "General"}
      </span>

      {/* Title */}
      <h2 className="font-bold text-base mt-1 mb-2 text-white">
        {ad.title}
      </h2>

      {/* Description */}
      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
        {ad.description}
      </p>

      {/* Bottom */}
      <div className="mt-4 flex items-center justify-between">

        {/* Price */}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-extrabold">
          ${ad.price}
        </span>

        {/* Button */}
        <button className="text-[11px] font-semibold border border-white/10 hover:border-pink-400/40 hover:bg-white/[0.05] px-3 py-1.5 rounded-lg transition text-gray-300 hover:text-white">
          View Ad →
        </button>

      </div>
    </div>
  );
}