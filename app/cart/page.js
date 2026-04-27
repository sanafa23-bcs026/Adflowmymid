'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { getCartItems, removeAdFromCart } from '../../lib/cartService'
import { formatAdPrice } from '../../lib/adHelpers'

export default function CartPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [busyId, setBusyId] = useState(null)

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.ads?.price || 0), 0)
  }, [items])

  useEffect(() => {
    async function loadCart() {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const currentUser = sessionData?.session?.user || null

        if (!currentUser) {
          router.push('/auth/login')
          return
        }

        setUser(currentUser)

        const cartItems = await getCartItems(currentUser.id)
        setItems(cartItems)
      } catch (error) {
        console.error('Failed to load cart:', error)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [router])

  const handleRemove = async (adId) => {
    if (!user?.id) return

    setBusyId(adId)
    try {
      await removeAdFromCart(user.id, adId)
      setItems((prev) => prev.filter((item) => item.ad_id !== adId))
      window.dispatchEvent(new Event('cart:updated'))
    } catch (error) {
      console.error('Failed to remove cart item:', error)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b14] px-4 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">Saved Ads</p>
            <h1 className="text-3xl font-black">My Cart</h1>
          </div>
          <Link href="/ads" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
            Browse Ads
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-[#111120] border border-white/10 p-8 text-center text-gray-400">
            Loading saved ads...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-[#111120] border border-white/10 p-10 text-center text-gray-400">
            <p className="text-xl font-semibold text-white mb-3">Koi saved ad nahi hai</p>
            <p className="text-sm text-gray-400 mb-6">Jaldi se ads dekhein aur apni favourite items save karein.</p>
            <Link href="/ads" className="inline-flex rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500">
              Browse Ads
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#111120] p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-400">Cart total</p>
                <p className="text-2xl font-black text-emerald-400">{formatAdPrice(totalValue)}</p>
              </div>
              <p className="text-sm text-gray-500">
                {items.length} item{items.length === 1 ? '' : 's'} saved
              </p>
            </div>

            <div className="grid gap-4">
              {items.map((item) => {
                const ad = item.ads || {}

                return (
                  <div key={item.id} className="rounded-3xl border border-white/10 bg-[#111120] p-5 flex flex-col gap-4 md:flex-row md:items-center">
                    <button
                      type="button"
                      onClick={() => router.push(`/ads/${item.ad_id}`)}
                      className="h-32 w-full overflow-hidden rounded-3xl bg-white/5 md:h-28 md:w-32"
                    >
                      {ad.image_url ? (
                        <img
                          src={ad.image_url}
                          alt={ad.title || 'Saved ad'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl text-white/10">
                          📷
                        </div>
                      )}
                    </button>

                    <div className="flex-1 space-y-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-purple-300">
                        {ad.category || 'Ad'}
                      </p>
                      <h2 className="text-lg font-bold text-white">{ad.title || 'Untitled Ad'}</h2>
                      <p className="text-sm text-gray-400">{ad.location || 'Unknown location'}</p>
                      <p className="text-sm text-gray-500">
                        {ad.featured ? '★ Featured' : 'Standard listing'}
                      </p>
                    </div>

                    <div className="space-y-2 text-right">
                      <p className="text-lg font-black text-emerald-400">
                        {formatAdPrice(ad.price)}
                      </p>
                      <div className="flex flex-col gap-2 md:items-end">
                        <Link
                          href={`/ads/${item.ad_id}`}
                          className="inline-flex justify-center rounded-full bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                        >
                          View Ad
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.ad_id)}
                          disabled={busyId === item.ad_id}
                          className="inline-flex justify-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/15 disabled:opacity-50"
                        >
                          {busyId === item.ad_id ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
