import { supabase } from "../../../lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("ads")
    .select("*");

  if (error) {
    return Response.json({ error: error.message });
  }

  return Response.json(data);
}