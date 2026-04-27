"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { formatAdPrice } from "../../lib/adHelpers";
import { getCartItems } from "../../lib/cartService";
import { getUserConversations } from "../../lib/chatService";

const TABS = [
  { id: "ads", label: "My Ads" },
  { id: "cart", label: "My Cart" },
  { id: "chats", label: "My Chats" },
  { id: "payments", label: "My Payments" },
];

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ads");
  const [user, setUser] = useState(null);
  const [myAds, setMyAds] = useState([]);
  const [myCart, setMyCart] = useState([]);
  const [myChats, setMyChats] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [error, setError] = useState("");

  const userName = useMemo(() => {
    return (
      user?.user_metadata?.full_name ||
      user?.email?.split("@")?.[0] ||
      "User"
    );
  }, [user]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const currentUser = data?.session?.user || null;

        if (!currentUser) {
          router.push("/auth/login");
          return;
        }

        setUser(currentUser);
        setError("");

        const [adsResult, cartResult, chatResult, paymentResult] =
          await Promise.allSettled([
            supabase
              .from("ads")
              .select("*")
              .eq("user_id", currentUser.id)
              .order("created_at", { ascending: false }),
            getCartItems(currentUser.id),
            getUserConversations(currentUser.id),
            supabase
              .from("payments")
              .select("*")
              .eq("user_id", currentUser.id)
              .order("created_at", { ascending: false }),
          ]);

        if (adsResult.status === "fulfilled") {
          const { data: ads, error: adsError } = adsResult.value;
          if (adsError) console.error("My ads fetch failed:", adsError);
          setMyAds(ads || []);
        } else {
          console.error("My ads fetch failed:", adsResult.reason);
          setMyAds([]);
        }

        if (cartResult.status === "fulfilled") {
          setMyCart(cartResult.value || []);
        } else {
          console.error("My cart fetch failed:", cartResult.reason);
          setMyCart([]);
        }

        if (chatResult.status === "fulfilled") {
          setMyChats(chatResult.value || []);
        } else {
          console.error("My chats fetch failed:", chatResult.reason);
          setMyChats([]);
        }

        if (paymentResult.status === "fulfilled") {
          const { data: payments, error: paymentError } = paymentResult.value;
          if (paymentError) console.error("My payments fetch failed:", paymentError);
          setMyPayments(payments || []);
        } else {
          console.error("My payments fetch failed:", paymentResult.reason);
          setMyPayments([]);
        }
      } catch (dashboardError) {
        console.error("Dashboard load failed:", dashboardError);
        setError("Unable to load your dashboard right now.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const stats = [
    { label: "Ads", value: myAds.length },
    { label: "Cart", value: myCart.length },
    { label: "Chats", value: myChats.length },
    { label: "Payments", value: myPayments.length },
  ];

  const renderAds = () => (
    <div className="space-y-4">
      {myAds.length === 0 ? (
        <EmptyState
          title="No ads yet"
          description="Post your first ad and start getting buyer interest."
          actionHref="/ads/new"
          actionLabel="Post an Ad"
        />
      ) : (
        myAds.map((ad) => (
          <DashboardCard
            key={ad.id}
            title={ad.title}
            subtitle={`${ad.category || "General"} • ${ad.location || "No location"}`}
            meta={[
              ad.status ? `Status: ${ad.status}` : null,
              ad.featured ? "★ Featured" : null,
              ad.expire_at ? `Expires: ${new Date(ad.expire_at).toLocaleDateString()}` : null,
            ].filter(Boolean)}
            value={formatAdPrice(ad.price)}
            href={`/ads/${ad.id}`}
          />
        ))
      )}
    </div>
  );

  const renderCart = () => (
    <div className="space-y-4">
      {myCart.length === 0 ? (
        <EmptyState
          title="Cart is empty"
          description="Save ads here while you compare options."
          actionHref="/ads"
          actionLabel="Browse Ads"
        />
      ) : (
        myCart.map((item) => {
          const ad = item.ads || {};
          return (
            <DashboardCard
              key={item.id}
              title={ad.title || "Untitled Ad"}
              subtitle={`${ad.category || "Ad"} • ${ad.location || "Unknown location"}`}
              meta={[ad.featured ? "★ Featured" : "Saved item"]}
              value={formatAdPrice(ad.price)}
              href={`/ads/${item.ad_id}`}
            />
          );
        })
      )}
    </div>
  );

  const renderChats = () => (
    <div className="space-y-4">
      {myChats.length === 0 ? (
        <EmptyState
          title="No chats yet"
          description="Open an ad or support conversation to start chatting."
          actionHref="/ads"
          actionLabel="Browse Ads"
        />
      ) : (
        myChats.map((chat) => (
          <DashboardCard
            key={chat.id}
            title={chat.type === "admin_customer" ? "Support chat" : "Buyer/Seller chat"}
            subtitle={`Updated: ${chat.updated_at ? new Date(chat.updated_at).toLocaleString() : "Recently"}`}
            meta={[
              chat.status ? `Status: ${chat.status}` : null,
              chat.type ? `Type: ${chat.type}` : null,
            ].filter(Boolean)}
            value={chat.id}
            href={`/chat/${chat.id}`}
          />
        ))
      )}
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-4">
      {myPayments.length === 0 ? (
        <EmptyState
          title="No payments found"
          description="Your package and verification payments will show up here."
          actionHref="/packages"
          actionLabel="View Packages"
        />
      ) : (
        myPayments.map((payment) => (
          <DashboardCard
            key={payment.id}
            title={payment.package_name || payment.package || payment.plan_name || payment.name || "Payment"}
            subtitle={`Method: ${payment.payment_method || "N/A"}`}
            meta={[
              payment.status ? `Status: ${payment.status}` : null,
              payment.transaction_id ? `Txn: ${payment.transaction_id}` : null,
            ].filter(Boolean)}
            value={formatAdPrice(payment.amount)}
            href="/packages"
          />
        ))
      )}
    </div>
  );

  const renderActiveTab = () => {
    if (activeTab === "cart") return renderCart();
    if (activeTab === "chats") return renderChats();
    if (activeTab === "payments") return renderPayments();
    return renderAds();
  };

  return (
    <div className="min-h-screen bg-[#0b0b14] px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#111120] p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-400">Welcome back</p>
            <h1 className="text-3xl font-black">{userName}</h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage ads, saved items, conversations, and payments in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/ads/new"
              className="rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
            >
              Post Ad
            </Link>
            <Link
              href="/cart"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white transition hover:bg-white/10"
            >
              Open Cart
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#111120] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-gray-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#111120] p-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#111120] p-8 text-center text-gray-400">
            Loading dashboard...
          </div>
        ) : (
          <div>{renderActiveTab()}</div>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ title, subtitle, meta = [], value, href }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#111120] p-5 transition hover:border-purple-500/30 hover:bg-white/[0.03] md:flex-row md:items-center md:justify-between"
    >
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-sm text-gray-400">{subtitle}</p>
        {meta.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {meta.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-gray-300">
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="text-right">
        <p className="text-base font-black text-emerald-400">{value}</p>
        <p className="text-xs text-gray-500">Open details →</p>
      </div>
    </Link>
  );
}

function EmptyState({ title, description, actionHref, actionLabel }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111120] p-10 text-center">
      <p className="text-xl font-semibold text-white">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-gray-400">{description}</p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
