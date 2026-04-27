'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function CartPage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() => {
    async function loadCart() {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const userId = sessionData?.session?.user?.id
        if (!userId) {
          window.location.href = '/auth/login'
          return
        }

        const { data } = await supabase
          .from('cart')
          .select('id, ad_id, ads(title, price, image_url, location, category)')
          .eq('user_id', userId)

        setItems(data || [])
      } catch (error) {
        console.error('Failed to load cart:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

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
          <div className="rounded-3xl bg-[#111120] border border-white/10 p-8 text-center text-gray-400">Loading saved ads...</div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-[#111120] border border-white/10 p-10 text-center text-gray-400">
            <p className="text-xl font-semibold text-white mb-3">Koi saved ad nahi hai</p>
            <p className="text-sm text-gray-400 mb-6">Jaldi se ads dekhein aur apni favourite items save karein.</p>
            <Link href="/ads" className="inline-flex rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500">
              Browse Ads
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 bg-[#111120] p-5 flex flex-col gap-4 md:flex-row md:items-center">
                <div className="h-32 w-full overflow-hidden rounded-3xl bg-white/5 md:h-28 md:w-32">
                  <img src={item.ads?.image_url || '/placeholder.png'} alt={item.ads?.title || 'Saved ad'} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-300">{item.ads?.category || 'Ad'}</p>
                  <h2 className="text-lg font-bold text-white">{item.ads?.title || 'Untitled Ad'}</h2>
                  <p className="text-sm text-gray-400">{item.ads?.location || 'Unknown location'}</p>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-lg font-black text-emerald-400">Rs. {Number(item.ads?.price || 0).toLocaleString('en-PK')}</p>
                  <Link href={`/ads/${item.ad_id}`} className="inline-flex rounded-full bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                    View Ad
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
