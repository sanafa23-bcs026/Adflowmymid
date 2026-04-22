import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "AdFlow Pro",
  description: "Premium Classifieds Marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0b14] text-white min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>

        <footer className="mt-20 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center font-black text-sm">A</div>
                <span className="font-bold text-white">AdFlow Pro</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                The most curated marketplace for premium classified ads. Spam-free, verified, and built for serious buyers and sellers.
              </p>
              <div className="flex gap-2 pt-1">
                {[
                  { label: "𝕏", href: "#" },
                  { label: "f", href: "#" },
                  { label: "in", href: "#" },
                ].map((s) => (
                  <a key={s.label} href={s.href}
                    className="w-8 h-8 rounded-lg border border-white/[0.08] text-gray-500 hover:text-white hover:border-white/20 text-xs flex items-center justify-center transition">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Marketplace",
                links: [
                  { label: "Explore Ads", href: "/explore" },
                  { label: "Categories", href: "/categories" },
                  { label: "Cities", href: "#" },
                  { label: "Packages", href: "/packages" },
                ],
              },
              {
                title: "Account",
                links: [
                  { label: "Sign In", href: "/auth/login" },
                  { label: "Register", href: "/auth/register" },
                  { label: "My Dashboard", href: "/dashboard" },
                  { label: "Post an Ad", href: "/ads/new" },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "About Us", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Careers", href: "#" },
                  { label: "Press", href: "#" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-gray-500 hover:text-gray-200 text-sm transition">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.04] px-6 py-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-gray-700 text-xs">© 2026 AdFlow Pro. All rights reserved.</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-gray-700 text-xs">All systems operational</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}