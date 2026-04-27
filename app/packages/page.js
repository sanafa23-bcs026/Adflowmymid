"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    color: 'border-white/10',
    badge: null,
    features: [
      '1 Free Ad',
      'Standard listing',
      '30 days active',
      'Basic support',
    ],
    cta: 'Get Started Free',
    ctaStyle: 'bg-white/[0.06] hover:bg-white/[0.1] border border-white/10',
  },
  {
    id: 'featured',
    name: 'Featured',
    price: 999,
    color: 'border-purple-500/50',
    badge: 'Most Popular',
    features: [
      '5 Featured Ads',
      'Top of search results',
      '60 days active',
      'Priority support',
      'View counter',
    ],
    cta: 'Get Featured',
    ctaStyle: 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-900/30',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2499,
    color: 'border-amber-500/40',
    badge: 'Best Value',
    features: [
      'Unlimited Ads',
      'Homepage featured slot',
      '90 days active',
      'Dedicated support',
      'Analytics dashboard',
      'Verified seller badge',
    ],
    cta: 'Go Premium',
    ctaStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-900/30',
  },
]

const PAYMENT_METHODS = [
  { id: 'jazzcash', name: 'JazzCash', icon: '📱', number: '0301-1234567', color: 'bg-red-500/10 border-red-500/20' },
  { id: 'easypaisa', name: 'EasyPaisa', icon: '💚', number: '0300-7654321', color: 'bg-green-500/10 border-green-500/20' },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', number: 'HBL • 1234-5678-9012', color: 'bg-blue-500/10 border-blue-500/20' },
]

export default function PackagesPage() {
  const router = useRouter()
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState(1)
  const [payMethod, setPayMethod] = useState(null)
  const [txId, setTxId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handlePaymentSubmit() {
    if (selected?.price > 0 && !txId.trim()) {
      setError('Transaction ID required');
      return
    }
    if (selected?.price > 0 && !payMethod) {
      setError('Please select a payment method');
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const paymentBase = {
        user_id: user?.id || null,
        amount: selected.price,
        payment_method: selected.price > 0 ? payMethod : null,
        transaction_id: selected.price > 0 ? txId.trim() : null,
        status: 'pending',
      }

      const packageFields = ['package_name', 'package', 'plan_name', 'subscription_plan', 'name']
      let saved = false
      let lastError = null

      for (const field of packageFields) {
        const paymentRow = { ...paymentBase, [field]: selected.name }
        const { error: dbErr } = await supabase.from('payments').insert([paymentRow])
        if (!dbErr) {
          saved = true
          break
        }

        lastError = dbErr
        const lowerMessage = dbErr.message?.toLowerCase() || ''
        if (
          lowerMessage.includes(`column '${field}'`) ||
          lowerMessage.includes(`column "${field}"`) ||
          lowerMessage.includes(`column ${field}`) ||
          lowerMessage.includes(`could not find the '${field}' column`) ||
          lowerMessage.includes(`could not find the "${field}" column`)
        ) {
          continue
        }
        break
      }

      if (!saved) {
        setError(lastError?.message || 'Unable to save payment. Please contact support.')
        setSubmitting(false)
        return
      }

      setDone(true)
    } catch (e) {
      setError('Unexpected error. Please try again.')
    }
    setSubmitting(false)
  }

  if (done) return (
    <div className="min-h-screen bg-[#0b0b14] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-5">🎉</div>
        <h2 className="text-2xl font-black mb-2 text-white">Payment Submitted!</h2>
        <p className="text-gray-400 text-sm mb-2">
          Your <span className="text-purple-400 font-semibold">{selected?.name}</span> package request has been received.
        </p>
        <p className="text-gray-500 text-xs mb-8">Our team will verify your payment and activate your package within 24 hours.</p>
        <button onClick={() => router.push('/')}
          className="bg-purple-600 hover:bg-purple-500 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition">
          Back to Home →
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0b0b14] text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">

        <button onClick={() => step === 1 ? router.back() : setStep(1)}
          className="text-gray-400 hover:text-white text-sm mb-8 flex items-center gap-1.5 transition">
          ← Back
        </button>

        {/* Step 1 — Choose Package */}
        {step === 1 && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black mb-2">Choose a Package</h1>
              <p className="text-gray-500 text-sm">Boost your ads and reach more buyers across Pakistan</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {PACKAGES.map((pkg) => (
                <div key={pkg.id}
                  onClick={() => setSelected(pkg)}
                  className={`relative bg-[#111120] border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02]
                    ${selected?.id === pkg.id ? 'border-purple-500 ring-2 ring-purple-500/20' : pkg.color}`}>

                  {pkg.badge && (
                    <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap
                      ${pkg.id === 'featured' ? 'bg-purple-600 text-white' : 'bg-amber-500 text-black'}`}>
                      {pkg.badge}
                    </span>
                  )}

                  <h3 className="text-lg font-black mb-1">{pkg.name}</h3>
                  <div className="mb-5">
                    {pkg.price === 0
                      ? <span className="text-3xl font-black text-green-400">Free</span>
                      : <><span className="text-3xl font-black">Rs. {pkg.price.toLocaleString()}</span>
                        <span className="text-gray-500 text-sm"> /month</span></>
                    }
                  </div>

                  <ul className="space-y-2 mb-6">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-green-400 text-xs">✓</span> {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => { setSelected(pkg); setStep(2) }}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold text-white transition ${pkg.ctaStyle}`}>
                    {pkg.cta}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 2 — Payment Method */}
        {step === 2 && selected && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black mb-1">Complete Payment</h1>
              <p className="text-gray-500 text-sm">
                {selected.name} Package — <span className="text-white font-semibold">Rs. {selected.price.toLocaleString()}</span>
              </p>
            </div>

            {selected.price > 0 ? (
              <>
                {/* Choose method */}
                <div className="space-y-3 mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Select Payment Method</p>
                  {PAYMENT_METHODS.map(m => (
                    <div key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${payMethod === m.id ? 'border-purple-500 bg-purple-500/10' : `${m.color} hover:border-white/20`}`}>
                      <span className="text-2xl">{m.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.number}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${payMethod === m.id ? 'border-purple-500 bg-purple-500' : 'border-white/20'}`}>
                        {payMethod === m.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                {payMethod && (
                  <div className="bg-amber-500/[0.07] border border-amber-500/20 rounded-xl p-4 mb-5">
                    <p className="text-amber-400 text-xs font-semibold mb-2">📋 Instructions</p>
                    <ol className="text-amber-300/70 text-xs space-y-1 leading-relaxed list-decimal list-inside">
                      <li>Send <strong className="text-amber-300">Rs. {selected.price.toLocaleString()}</strong> to the number above</li>
                      <li>Note the Transaction ID / Reference number</li>
                      <li>Enter it below and submit</li>
                      <li>We'll activate your package within 24 hours</li>
                    </ol>
                  </div>
                )}

                {/* Transaction ID */}
                <div className="mb-4">
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                    Transaction ID / Reference No. *
                  </label>
                  <input
                    value={txId}
                    onChange={e => setTxId(e.target.value)}
                    placeholder="e.g. TXN123456789"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
              </>
            ) : (
              <div className="bg-emerald-500/[0.07] border border-emerald-500/20 rounded-xl p-4 mb-5">
                <p className="text-emerald-300 text-sm">
                  The Basic package is free. Click submit to activate it immediately.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2.5 rounded-xl mb-4">
                ✕ {error}
              </div>
            )}

            <button
              onClick={handlePaymentSubmit}
              disabled={(selected.price > 0 && (!payMethod || !txId.trim())) || submitting}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold text-sm transition shadow-lg shadow-purple-900/30">
              {submitting ? 'Submitting...' : (selected.price > 0 ? 'Submit Payment →' : 'Activate Free Package')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}