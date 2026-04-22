"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [ads, setAds] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user;

      if (!u) {
        window.location.href = "/login";
        return;
      }

      setUser(u);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.id)
        .single();

      const { data: myAds } = await supabase
        .from("ads")
        .select("*")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false });

      setAds(myAds || []);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1>Welcome {user?.email}</h1>

      <h2 className="mt-4">My Ads</h2>

      {loading ? (
        <p>Loading...</p>
      ) : ads.length === 0 ? (
        <p>No ads yet</p>
      ) : (
        ads.map((ad) => (
          <div key={ad.id} className="p-2 border mt-2">
            {ad.title}
          </div>
        ))
      )}
    </div>
  );
}