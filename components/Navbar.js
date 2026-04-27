'use client'

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCartCount } from "@/lib/cartService";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const syncCartCount = useCallback(async (userId) => {
    if (!userId) {
      setCartCount(0);
      return;
    }

    const count = await getCartCount(userId).catch(() => 0);
    setCartCount(count);
  }, []);

  const syncSession = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      setRole(currentUser?.user_metadata?.role || null);
      await syncCartCount(currentUser?.id);
    } catch {
      setUser(null);
      setRole(null);
      setCartCount(0);
    }
  }, [syncCartCount]);

  useEffect(() => {
    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      setRole(currentUser?.user_metadata?.role || null);
      syncCartCount(currentUser?.id);
    });

    return () => subscription.unsubscribe();
  }, [syncCartCount, syncSession]);

  useEffect(() => {
    if (!user?.id) return;

    const handleCartUpdate = () => {
      syncCartCount(user.id);
    };

    window.addEventListener("cart:updated", handleCartUpdate);
    return () => window.removeEventListener("cart:updated", handleCartUpdate);
  }, [syncCartCount, user?.id]);

  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "moderator"
      ? "/dashboard/moderator"
      : "/dashboard";

  const navLinks = [
    { href: "/ads", label: "Explore" },
    { href: "/categories", label: "Categories" },
    { href: "/packages", label: "Packages" },
    { href: "/cart", label: "Cart", badge: cartCount },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#05060f]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-white">
        <a href="/" className="flex items-center gap-3 text-lg font-black tracking-tight text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 text-sm shadow-xl shadow-purple-500/20">
            A
          </span>
          AdFlow Pro
        </a>

        <nav className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="relative text-sm text-slate-300 transition hover:text-white">
              {link.label}
              {link.label
               === "Cart" && link.badge > 0 && (
                <span className="absolute -right-4 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-fuchsia-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <a
                href={dashboardHref}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Dashboard
              </a>

              {role && (
                <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gray-300 md:inline-flex">
                  {role}
                </span>
              )}

              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setCartCount(0);
                  setUser(null);
                  setRole(null);
                  router.push("/");
                }}
                className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-90"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/auth/login"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Login
              </a>
              <a
                href="/auth/register"
                className="rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-90"
              >
                Sign up
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
