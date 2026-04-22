"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
    return () => subscription.unsubscribe();
  }, []);

  const NAV = [
    { href: "/ads", label: "Explore" },
    { href: "/packages", label: "Packages" },
    { href: "/categories", label: "Categories" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#070710]/90 backdrop-blur-xl border-b border-white/[0.06]">

      <div className="max-w-7xl mx-auto px-5 h-[56px] flex items-center gap-6">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0 mr-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-lg shadow-purple-900/40">
            A
          </div>
          <span className="font-semibold text-white text-[14px] tracking-wide">
            AdFlow <span className="text-purple-400">Pro</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {NAV.map((l) => (
            <a key={l.href} href={l.href}
              className="text-[13px] text-gray-400 hover:text-white px-3.5 py-1.5 rounded-lg transition-all hover:bg-white/[0.05] hover:shadow-sm">
              {l.label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {user ? (
            <>
              <a href="/dashboard"
                className="text-[13px] text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition">
                Dashboard
              </a>

              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
                className="text-[13px] text-gray-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition">
                Logout
              </button>
            </>
          ) : (
            <a href="/auth/login"
              className="text-[13px] text-gray-400 hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-white/[0.05] transition">
              Sign In
            </a>
          )}

          {/* CTA Button */}
          <a href="/ads/new"
            className="text-[13px] font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 text-white px-4 py-1.5 rounded-lg transition shadow-md shadow-purple-900/30">
            Post an Ad
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden ml-auto p-2 rounded-lg hover:bg-white/[0.05] transition">
          <div className="w-[18px] flex flex-col gap-[5px]">
            <span className={`block h-px bg-white/80 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block h-px bg-white/80 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-white/80 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </div>
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.05] bg-[#090912] px-4 py-3 space-y-1">

          {NAV.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block text-sm text-gray-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/[0.05] transition">
              {l.label}
            </a>
          ))}

          <div className="pt-2 mt-2 border-t border-white/[0.05] flex flex-col gap-2">

            <a href={user ? "/dashboard" : "/auth/login"} onClick={() => setMenuOpen(false)}
              className="block text-sm text-gray-300 px-3 py-2.5 rounded-lg hover:bg-white/[0.05]">
              {user ? "Dashboard" : "Sign In"}
            </a>

            <a href="/ads/new" onClick={() => setMenuOpen(false)}
              className="block text-sm font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-center py-2.5 rounded-lg">
              Post an Ad
            </a>

          </div>
        </div>
      )}
    </nav>
  );
}