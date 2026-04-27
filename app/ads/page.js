'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const CATEGORIES = [
  'All', 'Electronics', 'Vehicles', 'Real Estate', 'Services',
  'Jobs', 'Fashion', 'Home & Garden', 'Pets', 'Accessories', 'Other'
]
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Used']

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

  const fetchAds = useCallback(async () => {
    setLoading(true)

    const buildQuery = (includeStatus = true) => {
      let query = supabase.from('ads').select('*')

      if (includeStatus) {
        query = query.not('status', 'eq', 'rejected')
      }
      if (search) query = query.ilike('title', `%${search}%`)
      if (category !== 'All') query = query.eq('category', category)
      if (location) query = query.ilike('location', `%${location}%`)
      if (priceMin) query = query.gte('price', parseFloat(priceMin))
      if (priceMax) query = query.lte('price', parseFloat(priceMax))
      if (conditions.length > 0) query = query.in('condition', conditions)

      if (sortBy === 'newest') query = query.order('created_at', { ascending: false })
      else if (sortBy === 'oldest') query = query.order('created_at', { ascending: true })
      else if (sortBy === 'price_low') query = query.order('price', { ascending: true })
      else if (sortBy === 'price_high') query = query.order('price', { ascending: false })

      return query
    }

    const runQuery = async (query) => {
      const { data, error } = await query.limit(50)
      return { data, error }
    }

    let result = await runQuery(buildQuery())

    if (result.error) {
      const msg = (result.error.message || '').toLowerCase()
      console.error('Error fetching ads:', result.error)
      if (msg.includes('status') || msg.includes('column') || msg.includes('unknown')) {
        result = await runQuery(buildQuery(false))
      }
    }

    if (result.error) {
      console.error('Ads fetch failed after fallback:', result.error)
      setAds([])
    } else {
      setAds(result.data || [])
    }

    setLoading(false)
  }, [search, category, location, priceMin, priceMax, conditions, sortBy])

  useEffect(() => { fetchAds() }, [fetchAds])

  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
    setSearch(params.get('q') || '')
    setCategory(params.get('category') || 'All')
  }, [])

  const toggleCondition = (c) => {
    setConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  const resetFilters = () => {
    setCategory('All'); setConditions([]); setLocation('')
    setPriceMin(''); setPriceMax(''); setSortBy('newest')
  }

  const formatPrice = (p) => {
    if (!p) return 'Contact'
    return 'Rs. ' + Number(p).toLocaleString('en-PK')
  }

  return (
    <div className="min-h-screen bg-[#0b0b14] text-white">

      {/* Top Search Bar */}
      <div className="bg-[#0f0f1e] border-b border-white/[0.06] px-4 py-4">
        <div className="max-w-6xl mx-auto flex gap-3 items-center">
          <button onClick={() => router.back()}
            className="text-gray-400 hover:text-white px-3 py-2 rounded-xl hover:bg-white/[0.05] transition text-sm shrink-0">
            ← Back
          </button>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchAds()}
              placeholder="Search iPhone, BMW, Laptop..."
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition"
            />
          </div>
          <button onClick={fetchAds}
            className="bg-purple-600 hover:bg-purple-500 px-5 py-2.5 rounded-xl text-sm font-semibold transition shrink-0">
            Search
          </button>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition shrink-0 ${showFilters ? 'bg-purple-600/20 border-purple-500/40 text-purple-300' : 'border-white/[0.08] text-gray-400 hover:text-white'}`}>
            ⚙ Filters
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">

        {/* Sidebar Filters */}
        <aside className={`shrink-0 w-64 transition-all ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-[#111120] border border-white/[0.06] rounded-2xl p-5 sticky top-4 space-y-5">

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Filters</p>
              <button onClick={resetFilters}
                className="text-xs text-purple-400 hover:text-purple-300 transition">Reset</button>
            </div>

            {/* Category */}
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Category</p>
              <div className="space-y-1">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${category === c ? 'bg-purple-600/20 text-purple-300' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Condition</p>
              <div className="space-y-1.5">
                {CONDITIONS.map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer group">
                    <div onClick={() => toggleCondition(c)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition ${conditions.includes(c) ? 'bg-purple-600 border-purple-600' : 'border-white/20 group-hover:border-purple-500/50'}`}>
                      {conditions.includes(c) && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-white transition">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Price (Rs.)</p>
              <div className="flex gap-2">
                <input value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  placeholder="Min" type="number"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 text-sm placeholder-gray-700 focus:outline-none focus:border-purple-500/50" />
                <input value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  placeholder="Max" type="number"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 text-sm placeholder-gray-700 focus:outline-none focus:border-purple-500/50" />
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Location</p>
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="City or region"
                className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-2 text-sm placeholder-gray-700 focus:outline-none focus:border-purple-500/50" />
            </div>

            <button onClick={fetchAds}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-semibold transition">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">

          {/* Sort + Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              {loading ? 'Searching...' : `${ads.length} ads found`}
            </p>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="bg-[#111120] border border-white/[0.08] rounded-xl px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          {/* Ads Grid */}
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
          ) : ads.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-400">No ads found. Try different filters.</p>
              <button onClick={resetFilters}
                className="mt-4 text-purple-400 hover:text-purple-300 text-sm transition">
                Clear filters →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ads.map(ad => (
                <div key={ad.id}
                  onClick={() => router.push(`/ads/${ad.id}`)}
                  className="bg-[#111120] border border-white/[0.05] rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/30 hover:scale-[1.02] transition-all duration-200 group">

                  {/* Image */}
                  <div className="relative h-44 bg-white/[0.03] overflow-hidden">
                    {ad.image_url ? (
                      <img src={ad.image_url} alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-white/10">
                        📷
                      </div>
                    )}
                    {ad.condition && (
                      <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10">
                        {ad.condition}
                      </span>
                    )}
                    {ad.featured && (
                      <span className="absolute top-2 left-2 bg-purple-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-[11px] text-purple-400 mb-1 uppercase tracking-wider">{ad.category}</p>
                    <p className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-2">{ad.title}</p>
                    <p className="text-base font-black text-green-400">{formatPrice(ad.price)}</p>
                    {ad.location && (
                      <p className="text-[11px] text-gray-500 mt-1">📍 {ad.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}