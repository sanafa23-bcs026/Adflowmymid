export default function ModeratorDashboard() {
  const pending = [
    { id: 1, title: "Sell iPhone 15 Pro", user: "ali@email.com", status: "pending" },
    { id: 2, title: "Rent Office Space Lahore", user: "sara@email.com", status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-2">Moderator Panel</h1>
      <p className="text-gray-400 text-sm mb-10">Review and approve or reject ads</p>

      <div className="space-y-4">
        {pending.map((ad) => (
          <div key={ad.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold">{ad.title}</p>
              <p className="text-gray-400 text-sm">{ad.user}</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-semibold transition">Approve</button>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-semibold transition">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}