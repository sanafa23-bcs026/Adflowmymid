export async function GET() {
  return Response.json({
    success: true,
    message: "Admin dashboard API",
    data: { totalAds: 0, pendingReview: 0, activeUsers: 0 },
  });
}