'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { startBuyerSellerChat } from '@/lib/chatService'
import { isAdInCart, toggleCartItem } from '@/lib/cartService'
import { formatAdPrice, isPublicAdVisible, preparePublicAds } from '@/lib/adHelpers'

const timeAgo = (date) => {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function AdDetailPage({ params }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [ad, setAd] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [inCart, setInCart] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)

  useEffect(() => {
    if (!id) return

    const initialize = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data?.user || null
      setCurrentUser(user)

      await fetchAd()

      if (user?.id) {
        const cartState = await isAdInCart(user.id, id).catch(() => false)
        setInCart(cartState)
      }
    }

    initialize()
  }, [id])

  async function fetchAd() {
    const { data, error } = await supabase.from('ads').select('*').eq('id', id).maybeSingle()

    if (error) {
      console.error('Ad fetch failed:', error)
      setAd(null)
      setLoading(false)
      return
    }

    if (!data || !isPublicAdVisible(data)) {
      setAd(null)
      setLoading(false)
      return
    }

    setAd(data)
    fetchRelated(data.category, data.id)
    setLoading(false)
  }

  async function fetchRelated(category, excludeId) {
    const { data, error } = await supabase.from('ads').select('*').eq('category', category).limit(25)

    if (error) {
      console.error('Related ads fetch failed:', error)
      setRelated([])
      return
    }

    const visibleRelated = preparePublicAds((data || []).filter((item) => item.id !== excludeId))
      .slice(0, 3)

    setRelated(visibleRelated)
  }

  async function handleChat() {
    setChatError('')
    if (!currentUser) {
      router.push('/auth/login')
      return
    }
    if (!ad?.user_id) {
      setChatError('Seller information is not available for this ad.')
      return
    }
    setChatLoading(true)
    try {
      const conv = await startBuyerSellerChat(ad.id, currentUser.id, ad.user_id)
      router.push(`/chat/${conv.id}`)
    } catch (e) {
      console.error('Chat start failed:', e)
      setChatError('Unable to start chat. Please try again later.')
    }
    setChatLoading(false)
  }

  async function handleCartToggle() {
    if (!currentUser?.id) {
      router.push('/auth/login')
      return
    }

    setCartLoading(true)
    try {
      const result = await toggleCartItem(currentUser.id, ad.id)
      setInCart(Boolean(result?.inCart))
      window.dispatchEvent(new Event('cart:updated'))
    } catch (error) {
      console.error('Cart toggle failed:', error)
    } finally {
      setCartLoading(false)
    }
  }

  function handleCall() {
    if (ad?.phone) window.open(`tel:${ad.phone}`)
    else alert('Phone number not available')
  }

  const images = ad?.images || (ad?.image_url ? [ad.image_url] : [])
  const priceLabel = useMemo(() => formatAdPrice(ad?.price), [ad?.price])

  if (loading) return (
    <div className="min-h-screen bg-[#0b0b14] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
    </div>
  )

  if (!ad) return (
    <div className="min-h-screen bg-[#0b0b14] flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-4xl mb-4">😕</p>
        <p className="text-gray-400 mb-4">Ad not found</p>
        <button onClick={() => router.back()} className="text-purple-400 hover:text-purple-300">← Go back</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0b0b14] text-white pb-16">
      <div className="max-w-5xl mx-auto px-4 pt-5 pb-2">
        <button onClick={() => router.back()}
          className="text-gray-400 hover:text-white text-sm flex items-center gap-1.5 transition">
          ← Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-[1fr_340px] gap-8">
        <div>
          <div className="bg-[#111120] border border-white/[0.06] rounded-2xl overflow-hidden h-80 md:h-96 mb-3">
            {images.length > 0 ? (
              <img src={images[activeImg]} alt={ad.title}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-white/10">📷</div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mb-6">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition ${i === activeImg ? 'border-purple-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="bg-[#111120] border border-white/[0.06] rounded-2xl p-5 mb-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Description</h2>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {ad.description || 'No description provided.'}
            </p>
          </div>

          <div className="bg-[#111120] border border-white/[0.06] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Details</h2>
            <div className="space-y-2.5">
              {[
                ['Category', ad.category],
                ['Condition', ad.condition],
                ['Location', ad.location],
                ['Posted', timeAgo(ad.created_at)],
                ['Expires', ad.expire_at ? new Date(ad.expire_at).toLocaleDateString() : null],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="md:sticky md:top-4 space-y-4">
            <div className="bg-[#111120] border border-white/[0.06] rounded-2xl p-5">
              {ad.condition && (
                <span className="inline-block bg-purple-600/20 text-purple-300 text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
                  {ad.condition}
                </span>
              )}
              {ad.featured && (
                <span className="inline-block bg-amber-500/20 text-amber-300 text-[11px] font-semibold px-3 py-1 rounded-full mb-3 ml-2">
                  ★ Featured
                </span>
              )}
              <h1 className="text-xl font-black leading-snug mb-3">{ad.title}</h1>
              <p className="text-3xl font-black text-green-400 mb-2">{priceLabel}</p>
              {ad.location && (
                <p className="text-sm text-gray-500">📍 {ad.location}</p>
              )}
            </div>

            <div className="bg-[#111120] border border-white/[0.06] rounded-2xl p-4">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">Seller</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 font-bold text-sm">
                  {(ad.seller_name || 'A')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{ad.seller_name || 'Anonymous'}</p>
                  <p className="text-[11px] text-green-400">✓ Verified</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button onClick={handleChat} disabled={chatLoading}
                className="w-full py-3 bg-green-500 hover:bg-green-400 disabled:opacity-50 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
                {chatLoading ? '...' : '💬 Chat with Seller'}
              </button>
              {chatError && (
                <p className="text-xs text-red-400 mt-2">{chatError}</p>
              )}

              <button onClick={handleCall}
                className="w-full py-3 bg-[#111120] hover:bg-white/[0.05] border border-white/[0.1] rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
                📞 Call Seller
              </button>

              <button
                onClick={handleCartToggle}
                disabled={cartLoading}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 border ${inCart ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-[#111120] border-white/[0.1] hover:bg-white/[0.05]'}`}
              >
                {cartLoading ? 'Updating...' : inCart ? '✓ In Cart' : 'Add to Cart'}
              </button>

              <button onClick={() => setIsFav(!isFav)}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 border ${isFav ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-[#111120] border-white/[0.1] hover:bg-white/[0.05]'}`}>
                {isFav ? '❤️ Saved to Favorites' : '🤍 Add to Favorites'}
              </button>
            </div>

            <div className="bg-amber-500/[0.07] border border-amber-500/20 rounded-xl p-3">
              <p className="text-amber-400 text-xs font-semibold mb-1">⚠ Safety Tip</p>
              <p className="text-amber-300/70 text-xs leading-relaxed">
                Meet in a safe public place. Don't pay in advance without verifying the item.
              </p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 mt-10">
          <h2 className="text-lg font-black mb-4">Related Ads</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {related.map(r => (
              <div key={r.id} onClick={() => router.push(`/ads/${r.id}`)}
                className="bg-[#111120] border border-white/[0.05] rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/30 hover:scale-[1.02] transition-all duration-200">
                <div className="h-36 bg-white/[0.03] overflow-hidden">
                  {r.image_url
                    ? <img src={r.image_url} alt={r.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl text-white/10">📷</div>
                  }
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-white line-clamp-2 mb-1">{r.title}</p>
                  <p className="text-sm font-black text-green-400">
                    {formatAdPrice(r.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}