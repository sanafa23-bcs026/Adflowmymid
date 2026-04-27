import { supabase } from "../../../lib/supabase";

async function updateRecord(entity, id, status) {
  const table = entity === "payment" ? "payments" : "ads";
  const { data, error } = await supabase
    .from(table)
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function GET() {
  const [adsResult, pendingAdsResult, paymentsResult, verifiedPaymentsResult] =
    await Promise.all([
      supabase.from("ads").select("id", { count: "exact", head: true }),
      supabase
        .from("ads")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("payments").select("id", { count: "exact", head: true }),
      supabase
        .from("payments")
        .select("id", { count: "exact", head: true })
        .eq("status", "verified"),
    ]);

  const firstError =
    adsResult.error ||
    pendingAdsResult.error ||
    paymentsResult.error ||
    verifiedPaymentsResult.error;

  if (firstError) {
    return Response.json(
      { success: false, error: firstError.message },
      { status: 500 }
    );
  }

  return Response.json({
    success: true,
    data: {
      totalAds: adsResult.count || 0,
      pendingReview: pendingAdsResult.count || 0,
      totalPayments: paymentsResult.count || 0,
      verifiedPayments: verifiedPaymentsResult.count || 0,
    },
  });
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const entity = String(body?.entity || "").toLowerCase();
    const id = body?.id;
    const status = String(body?.status || "").toLowerCase();

    if (!id || !status) {
      return Response.json(
        { success: false, error: "Missing id or status." },
        { status: 400 }
      );
    }

    if (entity !== "ad" && entity !== "payment") {
      return Response.json(
        { success: false, error: "Invalid entity." },
        { status: 400 }
      );
    }

    const updated = await updateRecord(entity, id, status);

    return Response.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message || "Failed to update record." },
      { status: 500 }
    );
  }
}
