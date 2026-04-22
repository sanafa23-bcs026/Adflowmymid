"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const PAYMENT_METHODS = [
  { type: "Mobile Wallet", name: "JazzCash", number: "0301-1234567", icon: "📱" },
  { type: "EasyPaisa", name: "EasyPaisa", number: "0311-7654321", icon: "💚" },
  { type: "Bank Transfer", name: "Bank Transfer (HBL)", account: "AdFlow Pro Pvt Ltd", iban: "PK36HABB0000123456789012", icon: "🏦" },
];

const FEATURES = {
  Basic: ["1 Ad listing", "7 days active", "Basic visibility", "Email support"],
  Standard: ["5 Ad listings", "30 days active", "Standard badge", "Priority support"],
  Premium: ["Unlimited listings", "90 days active", "Premium badge", "Dedicated support", "Analytics", "Verified badge"],
};

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [payMethod, setPayMethod] = useState(null);
  const [step, setStep] = useState(1);
  const router = useRouter();

  useEffect(() => {
    supabase.from("packages").select("*").order("price", { ascending: true })
      .then(({ data }) => { setPackages(data || []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white px-4 py-16 relative">

      {/* Payment Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#13131f] border border-white/10 rounded-2xl p-7 w-full max-w-md shadow-2xl">

            {step === 1 ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-black text-lg">Complete Purchase</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {selected.name} Plan —{" "}
                      <span className="text-violet-400 font-bold">Rs. {Number(selected.price).toLocaleString()}</span>
                    </p>
                  </div>
                  <button onClick={() => { setSelected(null); setStep(1); setPayMethod(null); }}
                    className="text-gray-500 hover:text-white w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition">
                    ✕
                  </button>
                </div>

                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Select your preferred payment method:</p>
                <div className="space-y-2 mb-5">
                  {PAYMENT_METHODS.map((m) => (
                    <button key={m.name} onClick={() => setPayMethod(m)}
                      className={`w-full text-left p-3.5 rounded-xl border transition ${
                        payMethod?.name === m.name
                          ? "border-violet-500/50 bg-violet-600/10"
                          : "border-white/10 hover:border-white/20 bg-white/5"
                      }`}>
                      <p className="font-semibold text-sm">
                        {m.icon} {m.type} — {m.name}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        AdFlow Pro: {m.number || m.iban}
                      </p>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => payMethod && setStep(2)}
                  disabled={!payMethod}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-40 rounded-xl font-bold text-sm transition">
                  Proceed to Confirm →
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-black text-lg">Complete Purchase</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {selected.name} Plan —{" "}
                      <span className="text-violet-400 font-bold">Rs. {Number(selected.price).toLocaleString()}</span>
                    </p>
                  </div>
                  <button onClick={() => { setSelected(null); setStep(1); setPayMethod(null); }}
                    className="text-gray-500 hover:text-white w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition">
                    ✕
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
                  <p className="font-bold text-sm mb-3">Payment Instructions</p>
                  <p className="text-gray-400 text-xs mb-4">Transfer and email proof to billing@adflow.com.</p>
                  <div className="space-y-2 text-sm">
                    {payMethod?.account && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Title</span>
                        <span className="font-semibold">{payMethod.account}</span>
                      </div>
                    )}
                    {payMethod?.iban && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">IBAN</span>
                        <span className="font-mono text-xs">{payMethod.iban}</span>
                      </div>
                    )}
                    {payMethod?.number && !payMethod?.iban && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Number</span>
                        <span className="font-semibold">{payMethod.number}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1 border-t border-white/10">
                      <span className="text-gray-500">Amount Due</span>
                      <span className="font-black text-violet-400">Rs. {Number(selected.price).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-2.5 border border-white/15 hover:bg-white/5 rounded-xl text-sm transition">
                    ← Back
                  </button>
                  <button onClick={() => { setSelected(null); setStep(1); router.push("/dashboard"); }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold transition">
                    ✓ Done — I've Paid
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-black mb-3">Choose Your Plan</h1>
          <p className="text-gray-400 text-base max-w-md mx-auto">
            Affordable packages to get your ads seen by thousands of buyers across Pakistan.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => {
              const isPopular = i === 1;
              const features = FEATURES[pkg.name] || ["Ad listing", `${pkg.duration} days active`];
              return (
                <div key={pkg.id}
                  className={`relative bg-[#13131f] border rounded-2xl p-6 flex flex-col transition hover:scale-[1.02] ${
                    isPopular ? "border-violet-500/60" : "border-white/10"
                  }`}>
                  {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h2 className="text-xl font-black mb-1">{pkg.name}</h2>
                  <p className="text-gray-400 text-sm mb-5">
                    {pkg.description || `Great for ${pkg.name?.toLowerCase()} sellers.`}
                  </p>
                  <div className="mb-5">
                    <span className="text-3xl font-black">Rs. {Number(pkg.price).toLocaleString()}</span>
                    <span className="text-gray-500 text-sm ml-1">/ {pkg.duration} days</span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-emerald-400 text-xs font-bold">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => { setSelected(pkg); setStep(1); setPayMethod(null); }}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                      isPopular
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                        : "border border-white/20 hover:bg-white/10"
                    }`}>
                    Get Started →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}