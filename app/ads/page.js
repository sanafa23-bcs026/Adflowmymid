'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import AdCard from '../../components/AdCard'
import { preparePublicAds } from '../../lib/adHelpers'
import { addAdToCart, isAdInCart, toggleCartItem } from '../../lib/cartService'

const CATEGORIES = [
  'All', 'Electronics', 'Vehicles', 'Real Estate', 'Services',
  'Jobs', 'Fashion', 'Home & Garden', 'Pets', 'Accessories', 'Other'
]
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Used']

function matchesSearch(ad, query) {
  if (!query) return true
  const haystack = [
    ad.title,
    ad.description,
    ad.category,
    ad.location,
    ad.condition,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(query.toLowerCase())
}

function matchesFilters(ad, filters) {
  if (filters.category !== 'All' && ad.category !== filters.category) return false

  if (filters.location) {
    const locationMatch = String(ad.location || '').toLowerCase().includes(filters.location.toLowerCase())
    if (!locationMatch) return false
  }

  if (filters.conditions.length > 0 && !filters.conditions.includes(ad.condition)) return false

  const price = Number(ad.price || 0)
  if (filters.priceMin && price < Number(filters.priceMin)) return false
  if (filters.priceMax && price > Number(filters.priceMax)) return false

  return true
}

export default function BrowsePage() {
  const router = useRouter()
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [conditions, setConditions] = useState([])
  const [location, setLocation] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [cartIds, setCartIds] = useState([])
  const [cartBusyId, setCartBusyId] = useState(null)

  const filterState = useMemo(() => ({
    category,
    conditions,
    location,
    priceMin,
    priceMax,
  }), [category, conditions, location, priceMin, priceMax])

  const fetchCurrentUser = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    const user = data?.session?.user || null
    setCurrentUser(user)
    return user
  }, [])

  const fetchCartIds = useCallback(async (userId) => {
    if (!userId) {
      setCartIds([])
      return
    }

    const { data, error } = await supabase
      .from('cart')
      .select('ad_id')
      .eq('user_id', userId)

    if (error) {
      console.error('Cart fetch failed:', error)
      setCartIds([])
      return
    }

    setCartIds((data || []).map((item) => item.ad_id))
  }, [])

  const fetchAds = useCallback(async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .limit(500)

    if (error) {
      console.error('Error fetching ads:', error)
      setAds([])
      setLoading(false)
      return
    }

    const publicAds = preparePublicAds(data || [], sortBy)
    setAds(publicAds)
    setLoading(false)
  }, [sortBy])

  useEffect(() => {
    fetchAds()
  }, [fetchAds])

  useEffect(() => {
    fetchCurrentUser().then((user) => fetchCartIds(user?.id))
  }, [fetchCartIds, fetchCurrentUser])

  useEffect(() => {
    const handleCartUpdate = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data?.session?.user || null
      setCurrentUser(user)
      await fetchCartIds(user?.id)
    }

    window.addEventListener('cart:updated', handleCartUpdate)
    return () => window.removeEventListener('cart:updated', handleCartUpdate)
  }, [fetchCartIds])

  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
    setSearch(params.get('q') || '')
    setCategory(params.get('category') || params.get('cat') || 'All')
  }, [])

  const toggleCondition = (c) => {
    setConditions((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  const resetFilters = () => {
    setCategory('All')
    setConditions([])
    setLocation('')
    setPriceMin('')
    setPriceMax('')
    setSortBy('newest')
    setSearch('')
  }

  const filteredAds = useMemo(() => {
    const visibleAds = preparePublicAds(ads, sortBy)
    return visibleAds.filter((ad) => matchesSearch(ad, search) && matchesFilters(ad, filterState))
  }, [ads, filterState, search, sortBy])

  const handleViewAd = (ad) => {
    router.push(`/ads/${ad.id}`)
  }

  const handleToggleCart = async (ad) => {
    if (!ad?.id) return

    if (!currentUser?.id) {
      router.push('/auth/login')
      return
    }

    setCartBusyId(ad.id)
    try {
      await toggleCartItem(currentUser.id, ad.id)
      const inCart = await isAdInCart(currentUser.id, ad.id)
      setCartIds((prev) => {
        const next = new Set(prev)
        if (inCart) next.add(ad.id)
        else next.delete(ad.id)
        return Array.from(next)
      })
      window.dispatchEvent(new Event('cart:updated'))
    } catch (error) {
      console.error('Cart update failed:', error)
    } finally {
      setCartBusyId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b14] text-white">
      <div className="bg-[#0f0f1e] border-b border-white/[0.06] px-4 py-4">
        <div className="max-w-6xl mx-auto flex gap-3 items-center">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white px-3 py-2 rounded-xl hover:bg-white/[0.05] transition text-sm shrink-0"
          >
            ← Back
          </button>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchAds()}
              placeholder="Search iPhone, BMW, Laptop..."
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition"
            />
          </div>
          <button
            onClick={fetchAds}
            className="bg-purple-600 hover:bg-purple-500 px-5 py-2.5 rounded-xl text-sm font-semibold transition shrink-0"
          >
            Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition shrink-0 ${
              showFilters
                ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                : 'border-white/[0.08] text-gray-400 hover:text-white'
            }`}
          >
            ⚙ Filters
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <aside className={`shrink-0 w-64 transition-all ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-[#111120] border border-white/[0.06] rounded-2xl p-5 sticky top-4 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Filters</p>
              <button onClick={resetFilters} className="text-xs text-purple-400 hover:text-purple-300 transition">
                Reset
              </button>
            </div>

            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Category</p>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${
                      category === c ? 'bg-purple-600/20 text-purple-300' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Condition</p>
              <div className="space-y-1.5">
                {CONDITIONS.map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer group">
                    <div
                      onClick={() => toggleCondition(c)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                        conditions.includes(c)
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-white/20 group-hover:border-purple-500/50'
                      }`}
                    >
                      {conditions.includes(c) && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-white transition">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Price (Rs.)</p>
              <div className="flex gap-2">
                <input
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Min"
                  type="number"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 text-sm placeholder-gray-700 focus:outline-none focus:border-purple-500/50"
                />
                <input
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Max"
                  type="number"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 text-sm placeholder-gray-700 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Location</p>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or region"
                className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-2 text-sm placeholder-gray-700 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <button
              onClick={fetchAds}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-semibold transition"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              {loading ? 'Searching...' : `${filteredAds.length} ads found`}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#111120] border border-white/[0.08] rounded-xl px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#111120] rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-white/[0.04]" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-white/[0.06] rounded w-3/4" />
                    <div className="h-4 bg-white/[0.06] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-400">No ads found. Try different filters.</p>
              <button
                onClick={resetFilters}
                className="mt-4 text-purple-400 hover:text-purple-300 text-sm transition"
              >
                Clear filters →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredAds.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  inCart={cartIds.includes(ad.id)}
                  loading={cartBusyId === ad.id}
                  onView={handleViewAd}
                  onToggleCart={handleToggleCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
