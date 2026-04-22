export async function POST(req) {
  return Response.json({ success: true })
}
await fetch('/api/client/ads', {
  method: 'POST',
  body: JSON.stringify(formData),
})