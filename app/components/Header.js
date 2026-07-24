'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import Image from 'next/image';
import {
  Search,
  Menu,
  X,
  User,
  LayoutDashboard,
  Shield,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

const NAV_ITEMS = [
  { href: '/catalog', label: 'קטלוג' },
  { href: '/terms', label: 'תקנון' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const profileRef = useRef(null);

  const isAdmin = user?.publicMetadata?.role === 'admin' ||
    user?.emailAddresses?.[0]?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        isTransparent
          ? 'bg-transparent text-white border-b border-white/10'
          : 'bg-white/95 backdrop-blur-sm shadow-header text-surface-900'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 relative">
          
          {/* Desktop Navigation (Right Side in RTL) */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? (isTransparent ? 'bg-white/20 text-white' : 'bg-surface-100 text-surface-900')
                    : (isTransparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900')
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Center Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group z-10"
          >
            <div className="relative size-10">
              <Image 
                src="/FM.png" 
                alt="Fragrance Marketplace" 
                fill 
                className={cn("object-contain transition-all", isTransparent && "brightness-0 invert")} 
                priority 
              />
            </div>
            <span className={cn("text-lg font-bold transition-colors hidden sm:block", isTransparent ? "text-white" : "text-surface-900 group-hover:text-blue-500")}>
              Fragrance
              <span className={isTransparent ? "text-white" : "text-blue-500"}> Marketplace</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className={cn(
              'hidden md:flex items-center transition-all duration-300',
              isSearchFocused ? 'w-80' : 'w-64'
            )}
          >
          {/* Left Side: Auth & Search */}
          <div className="flex items-center justify-end gap-3 flex-1">
            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className={cn(
                'hidden lg:flex items-center transition-all duration-300',
                isSearchFocused ? 'w-64' : 'w-48'
              )}
            >
              <div className="relative w-full">
                <Search className={cn("absolute right-3 top-1/2 -translate-y-1/2 size-4", isTransparent ? "text-white/60" : "text-surface-400")} />
                <input
                  type="text"
                  placeholder="חיפוש בשמים..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={cn(
                    "w-full pr-9 pl-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 transition-all",
                    isTransparent 
                      ? "bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-white/30 focus:border-white/50" 
                      : "bg-surface-50 border-surface-200 text-surface-900 placeholder:text-surface-400 focus:ring-blue-400/30 focus:border-blue-400"
                  )}
                />
              </div>
            </form>

            {isLoaded && !user ? (
              <>
                <Link
                  href="/sign-in"
                  className={cn("hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors", 
                    isTransparent ? "text-white hover:bg-white/10" : "text-surface-700 hover:text-surface-900 hover:bg-surface-50")}
                >
                  התחברות
                </Link>
                <Link
                  href="/sign-up"
                  className={cn("inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-colors",
                    isTransparent ? "bg-white text-black hover:bg-white/90" : "bg-[#1a1a1a] text-white hover:bg-[#333]")}
                >
                  הרשמה
                </Link>
              </>
            ) : null}

            {isLoaded && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-50 transition-colors"
                >
                  <div className="size-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      user?.firstName?.[0] || '?'
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      'size-4 text-surface-400 transition-transform',
                      isProfileOpen && 'rotate-180'
                    )}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-dropdown border border-surface-200 py-2 animate-scale-in origin-top-left">
                    <div className="px-4 py-2 border-b border-surface-100">
                      <p className="text-sm font-medium text-surface-900 truncate">
                        {user?.fullName || user?.firstName || 'משתמש'}
                      </p>
                      <p className="text-xs text-surface-500 truncate">
                        {user?.emailAddresses?.[0]?.emailAddress}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard className="size-4" />
                      לוח בקרה
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Shield className="size-4" />
                        ניהול
                      </Link>
                    )}

                    <div className="border-t border-surface-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="size-4" />
                        התנתקות
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn("md:hidden p-2 rounded-lg transition-colors", isTransparent ? "text-white hover:bg-white/10" : "text-surface-700 hover:bg-surface-50")}
            >
              {isMobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-surface-200 animate-fade-in">
          <div className="px-4 py-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="חיפוש בשמים..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
                />
              </div>
            </form>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-surface-100 text-surface-900'
                      : 'text-surface-600 hover:bg-surface-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
