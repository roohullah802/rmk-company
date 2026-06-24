import Link from 'next/link';
import { Mail, Phone, MapPin, HardHat, ArrowUpRight } from 'lucide-react';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-brand-amber to-brand-orange rounded-lg">
                <HardHat className="h-5 w-5 text-zinc-950" />
              </div>
              <span className="text-xl font-black tracking-wider text-white">
                RMK<span className="text-brand-amber">.</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Powering heavy excavation & large-scale construction infrastructure projects across Pakistan since 2014.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-brand-amber hover:border-brand-amber transition-colors duration-200" aria-label="Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-brand-amber hover:border-brand-amber transition-colors duration-200" aria-label="Twitter">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-brand-amber hover:border-brand-amber transition-colors duration-200" aria-label="LinkedIn">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-amber pl-3">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-white text-sm transition-colors duration-150 flex items-center gap-1 group">
                  Home <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-white text-sm transition-colors duration-150 flex items-center gap-1 group">
                  About Fleet <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-zinc-400 hover:text-white text-sm transition-colors duration-150 flex items-center gap-1 group">
                  Our Projects <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-white text-sm transition-colors duration-150 flex items-center gap-1 group">
                  Contact Us <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-amber pl-3">
              Get In Touch
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-zinc-400">
                <Phone className="h-5 w-5 text-brand-amber flex-shrink-0 mt-0.5" />
                <span>+92 300 0000000</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-400">
                <Mail className="h-5 w-5 text-brand-amber flex-shrink-0 mt-0.5" />
                <span>info@rmk.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-400">
                <MapPin className="h-5 w-5 text-brand-amber flex-shrink-0 mt-0.5" />
                <span>12-B Industrial Area, Gulberg III, Lahore, Pakistan</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-amber pl-3">
              Operations
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">
              Machinery mobilization & operations run 24/7 for active contract sites.
            </p>
            <p className="text-sm text-zinc-500">
              Office Hours: Mon - Sat (9:00 AM - 6:00 PM)
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500">
            © {currentYear} RMK Heavy Machinery. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-zinc-500">
            <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
