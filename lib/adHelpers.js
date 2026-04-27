const PUBLIC_STATUSES = new Set(['approved', 'active', 'published', 'live'])

function toTimestamp(value) {
  if (!value) return 0
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

export function isAdExpired(ad, now = Date.now()) {
  if (!ad?.expire_at) return false
  const expireAt = toTimestamp(ad.expire_at)
  if (!expireAt) return false
  return expireAt <= now
}

export function isPublicAdVisible(ad, now = Date.now()) {
  if (!ad) return false

  if (isAdExpired(ad, now)) return false

  const status = String(ad.status || '').toLowerCase().trim()
  if (!status) return true

  return PUBLIC_STATUSES.has(status)
}

export function getAdRankScore(ad) {
  const rankScore = Number(ad?.rank_score)
  if (Number.isFinite(rankScore)) return rankScore

  return ad?.featured ? 1 : 0
}

export function sortAdsByPriority(ads = [], sortBy = 'newest') {
  const list = [...ads]

  const compareBySort = (a, b) => {
    if (sortBy === 'oldest') return toTimestamp(a.created_at) - toTimestamp(b.created_at)
    if (sortBy === 'price_low') return Number(a.price || 0) - Number(b.price || 0)
    if (sortBy === 'price_high') return Number(b.price || 0) - Number(a.price || 0)
    return toTimestamp(b.created_at) - toTimestamp(a.created_at)
  }

  return list.sort((a, b) => {
    const featuredA = a?.featured ? 1 : 0
    const featuredB = b?.featured ? 1 : 0

    if (featuredA !== featuredB) return featuredB - featuredA

    const rankA = getAdRankScore(a)
    const rankB = getAdRankScore(b)
    if (rankA !== rankB) return rankB - rankA

    return compareBySort(a, b)
  })
}

export function preparePublicAds(ads = [], sortBy = 'newest') {
  return sortAdsByPriority(ads.filter((ad) => isPublicAdVisible(ad)), sortBy)
}

export function formatAdPrice(price, fallback = 'Contact') {
  if (price === null || price === undefined || price === '') return fallback
  const numericPrice = Number(price)
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) return fallback
  return `Rs. ${numericPrice.toLocaleString('en-PK')}`
}
