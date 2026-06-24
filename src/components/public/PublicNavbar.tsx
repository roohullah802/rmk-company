'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, HardHat } from 'lucide-react';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 shadow-lg'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-br from-brand-amber to-brand-orange rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-200">
                <HardHat className="h-6 w-6 text-zinc-950" />
              </div>
              <span className="text-2xl font-black tracking-wider text-white">
                RMK<span className="text-brand-amber">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 relative py-1 ${
                      isActive ? 'text-brand-amber' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-amber to-brand-orange rounded-full animate-fade-in" />
                    )}
                  </Link>
                );
              })}
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 border border-brand-amber/40 hover:border-brand-amber rounded-lg text-sm font-semibold text-brand-amber bg-brand-amber/5 hover:bg-brand-amber/10 transition-all duration-200"
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-b border-zinc-800 animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-amber/10 text-brand-amber border-l-4 border-brand-amber'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 pb-2 px-3">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full flex justify-center px-4 py-3 border border-brand-amber/40 hover:border-brand-amber rounded-lg text-base font-bold text-brand-amber bg-brand-amber/5 hover:bg-brand-amber/10 transition-all duration-200"
              >
                Dashboard Access
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
