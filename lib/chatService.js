import { supabase } from './supabase'

export async function startBuyerSellerChat(adId, buyerId, sellerId) {
  const { data: existing, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('ad_id', adId)
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .maybeSingle()

  if (error) throw error
  if (existing) return existing

  const { data, error: insertError } = await supabase
    .from('conversations')
    .insert({ type: 'buyer_seller', ad_id: adId, buyer_id: buyerId, seller_id: sellerId })
    .select()
    .single()

  if (insertError) throw insertError
  return data
}

export async function startAdminChat(customerId) {
  const { data: existing, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('type', 'admin_customer')
    .eq('customer_id', customerId)
    .eq('status', 'active')
    .maybeSingle()

  if (error) throw error
  if (existing) return existing

  const { data, error: insertError } = await supabase
    .from('conversations')
    .insert({ type: 'admin_customer', customer_id: customerId })
    .select()
    .single()

  if (insertError) throw insertError
  return data
}

export async function getMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function sendMessage(conversationId, senderId, senderRole, content) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      sender_role: senderRole,
      content
    })
    .select()
    .single()
  if (error) throw error

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)
  return data
}

export async function getUserConversations(userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`customer_id.eq.${userId},buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export function subscribeToMessages(conversationId, callback) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    }, callback)
    .subscribe()
}