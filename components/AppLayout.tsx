'use client';

import { useAuth } from '@/lib/providers';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, FolderKanban, Server, Network, KeyRound, Share2, LogOut, Menu, Languages, Search, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';

import { Paywall } from './Paywall';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isPaywall, login, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--neu-bg)]" />;
  }

  // If loading auth state
  if (loading) {
    return (
      <div className="flex bg-[var(--neu-bg)] h-screen w-full items-center justify-center">
        <p className="text-[var(--neu-text-muted)] font-medium animate-pulse">{t('loading')}</p>
      </div>
    );
  }

  // If public route like /share/:token, we don't force login or show sidebar.
  // We'll let the individual page handle it, but wait, usually we apply AppLayout in an (app) group.
  // Actually, we can just check if pathname starts with /share/
  if (pathname.startsWith('/share/')) {
    return <main className="min-h-screen bg-[var(--neu-bg)]">{children}</main>;
  }

  // If not logged in
  if (!user) {
    return (
      <div className="flex bg-[var(--neu-bg)] text-[var(--neu-text)] h-screen w-full flex-col items-center justify-center p-6">
        <div className="neu-panel p-10 md:p-14 text-center rounded-3xl max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[var(--neu-accent)]" />
          <div className="neu-panel-inset mx-auto w-20 h-20 rounded-full flex flex-col justify-center items-center text-blue-400 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h1 className="text-3xl font-bold tracking-wide mb-3">IT-Box</h1>
          <p className="text-[var(--neu-text-muted)] font-medium mb-10 leading-relaxed text-sm lg:text-base">
            Единый сейф для вашей инфраструктуры. Серверы, сервисы, доступы AES-256-GCM.
          </p>
          <button onClick={login} className="neu-button font-bold text-base w-full py-4 bg-[var(--neu-accent)] text-white shadow-none hover:opacity-90 transition-opacity">
            Войти через Google
          </button>
        </div>
      </div>
    );
  }

  if (isPaywall) {
    return <Paywall />;
  }

  const navItems = [
    { href: '/', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/projects', icon: FolderKanban, label: t('projects') },
    { href: '/servers', icon: Server, label: t('servers') },
    { href: '/services', icon: Network, label: t('services') },
    { href: '/credentials', icon: KeyRound, label: t('credentials') },
    { href: '/share-links', icon: Share2, label: t('share_links') },
  ];

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--neu-bg)] text-[var(--neu-text)]">
      {/* Sidebar Desktop */}
      <aside className="hidden w-72 flex-col neu-panel m-4 mr-0 rounded-3xl md:flex shrink-0">
        <div className="flex h-20 items-center px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <div className="neu-panel-inset p-2 rounded-full text-blue-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
               <span className="text-xl font-bold tracking-wide">IT-Box</span>
               <span className="block text-[10px] text-[var(--neu-text-muted)] font-normal tracking-wide mt-0.5 capitalize-first">Сейф для инфраструктуры</span>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
          <nav className="grid gap-2 items-start font-medium text-[15px]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300",
                  isActive ? "neu-panel text-[var(--neu-accent)] border-l-4 border-[var(--neu-accent)]" : "hover:text-[var(--neu-accent)] text-[var(--neu-text)] opacity-80 hover:opacity-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )})}
            
            <div className="my-4 h-px neu-panel-inset opacity-50" />
            
            <Link href="/about" className={cn("flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300", pathname === "/about" ? "neu-panel text-[var(--neu-accent)] border-l-4 border-[var(--neu-accent)]" : "text-[var(--neu-text)] opacity-60 hover:opacity-100")}>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-2.5z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
               О продукте
            </Link>
            <Link href="/faq" className={cn("flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300", pathname === "/faq" ? "neu-panel text-[var(--neu-accent)] border-l-4 border-[var(--neu-accent)]" : "text-[var(--neu-text)] opacity-60 hover:opacity-100")}>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
               FAQ
            </Link>
          </nav>
        </div>
        
        <div className="p-6 text-xs text-[var(--neu-text-muted)] opacity-70">
           <p className="font-semibold text-[13px] mb-1">Менеджер IT-активов</p>
           <p>v1.0.0</p>
           <p className="mt-4 mb-2">© 2026 IT-Box<br/>
           <a href="mailto:info@premiumwebsite.ru" className="hover:text-[var(--neu-accent)] transition-colors inline-block mt-1">info@premiumwebsite.ru</a></p>
           <p className="mt-2"><a href="#" className="hover:text-[var(--neu-accent)] transition-colors">Политика конфиденциальности</a></p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 lg:h-20 items-center justify-between px-6 lg:px-12 mt-2 lg:mt-4">
          <div className="flex items-center gap-4 md:hidden">
            <Button variant="outline" size="icon" className="neu-button h-10 w-10 border-0 bg-transparent shrink-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="neu-panel-inset p-1.5 rounded-full text-blue-400">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <span className="text-lg font-bold tracking-wide">IT-Box</span>
            </Link>
          </div>
          
          <div className="flex-1 md:hidden"></div>
          
          <div className="flex md:hidden gap-3 ml-auto items-center">
             <div className="neu-button h-10 w-10 flex items-center justify-center cursor-pointer" onClick={toggleTheme}>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
             </div>
             <div className="neu-button h-10 w-10 flex items-center justify-center cursor-pointer text-red-500" onClick={logout}>
                <LogOut className="h-4 w-4" />
             </div>
          </div>

          <div className="hidden md:flex gap-4 ml-auto items-center">
             <div className="neu-button h-12 w-12 flex items-center justify-center cursor-pointer" onClick={toggleTheme}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
             </div>
             <div className="neu-button h-12 w-12 flex items-center justify-center cursor-pointer">
                <Search className="h-5 w-5" />
             </div>
             <div className="neu-button h-12 w-12 flex items-center justify-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
             </div>
             
             <div className="neu-panel-inset flex items-center p-1 rounded-full ml-4">
               <div className={`h-10 px-5 flex items-center justify-center text-sm cursor-pointer rounded-full font-bold ${i18n.language === 'ru' ? 'neu-button bg-[var(--neu-accent)] text-white shadow-none' : 'opacity-60 hover:opacity-100'}`} onClick={() => i18n.changeLanguage('ru')}>RU</div>
               <div className={`h-10 px-5 flex items-center justify-center text-sm cursor-pointer rounded-full font-bold ${i18n.language === 'en' ? 'neu-button bg-[var(--neu-accent)] text-white shadow-none' : 'opacity-60 hover:opacity-100'}`} onClick={() => i18n.changeLanguage('en')}>EN</div>
             </div>
             
             <div className="neu-button h-12 w-12 flex items-center justify-center cursor-pointer ml-4 text-red-500" onClick={logout}>
                <LogOut className="h-5 w-5" />
             </div>
          </div>
        </header>

        {/* Mobile Navigation overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <aside className="relative flex w-72 flex-col neu-panel m-4 rounded-3xl h-[calc(100vh-2rem)]">
               <div className="flex h-20 items-center px-8 border-b border-white/5">
                 <span className="text-xl font-bold tracking-wide">IT-Box</span>
               </div>
               <nav className="flex-1 p-4 text-sm font-medium gap-2 overflow-y-auto flex flex-col">
                 {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all text-[15px]",
                        pathname === item.href ? "neu-panel text-[var(--neu-accent)] border-l-4 border-[var(--neu-accent)]" : "hover:text-[var(--neu-accent)] opacity-80"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="my-2 h-px neu-panel-inset opacity-50" />
                  
                  <Link href="/about" onClick={() => setSidebarOpen(false)} className={cn("flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all text-[15px]", pathname === "/about" ? "neu-panel text-[var(--neu-accent)] border-l-4 border-[var(--neu-accent)]" : "hover:text-[var(--neu-accent)] opacity-80")}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-2.5z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                     О продукте
                  </Link>
                  <Link href="/faq" onClick={() => setSidebarOpen(false)} className={cn("flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all text-[15px]", pathname === "/faq" ? "neu-panel text-[var(--neu-accent)] border-l-4 border-[var(--neu-accent)]" : "hover:text-[var(--neu-accent)] opacity-80")}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                     FAQ
                  </Link>
               </nav>
               <div className="p-6 text-xs text-[var(--neu-text-muted)] opacity-70 border-t border-[var(--neu-border)]/5">
                 <p className="font-semibold text-[13px] mb-1">Менеджер IT-активов</p>
                 <p>v1.0.0</p>
                 <p className="mt-4 mb-2">© 2026 IT-Box<br/>
                 <a href="mailto:info@premiumwebsite.ru" className="hover:text-[var(--neu-accent)] transition-colors inline-block mt-1">info@premiumwebsite.ru</a></p>
                 <p className="mt-2"><a href="#" className="hover:text-[var(--neu-accent)] transition-colors">Политика конфиденциальности</a></p>
              </div>
            </aside>
          </div>
        )}

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 pt-4 md:p-8 lg:p-12 pb-24">
          {children}
        </main>
      </div>
    </div>
  );
}
