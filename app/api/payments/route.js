import { submitPayment } from "../../../server/controllers/paymentController";
import { supabase } from "../../../lib/supabase";

export async function POST(req) {
  const body = await req.json();
  const data = submitPayment(body);
  return Response.json(data);
}