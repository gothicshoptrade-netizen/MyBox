'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, Info, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import { useNotifications, Notification } from '@/lib/notifications';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-rose-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const currentLocale = i18n.language === 'ru' ? ru : enUS;

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={cn(
          "neu-button h-10 w-10 md:h-12 md:w-12 flex items-center justify-center cursor-pointer transition-all relative",
          isOpen && "neu-panel-inset text-[var(--neu-accent)]"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4 md:h-5 md:w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 md:top-3 md:right-3 flex h-2 w-2 md:h-2.5 md:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-rose-500"></span>
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-4 w-80 md:w-96 neu-panel rounded-3xl overflow-hidden z-[100] shadow-2xl border border-white/5"
          >
            <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-[var(--neu-bg)]">
              <h3 className="font-bold text-base md:text-lg">{t('notifications')}</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-[var(--neu-accent)] hover:underline font-medium"
                >
                  {t('mark_all_read')}
                </button>
              )}
            </div>

            <div className="max-h-[70vh] overflow-y-auto bg-[var(--neu-bg)]">
              {loading ? (
                <div className="p-8 text-center opacity-50 text-sm whitespace-nowrap">{t('loading')}</div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center gap-3">
                   <div className="neu-panel-inset p-4 rounded-full opacity-30">
                      <Bell className="w-8 h-8" />
                   </div>
                   <p className="opacity-50 text-sm">{t('no_notifications')}</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        if (!n.isRead) markAsRead(n.id);
                        if (n.link) window.location.href = n.link;
                      }}
                      className={cn(
                        "p-4 md:p-5 transition-colors cursor-pointer flex gap-4 group",
                        !n.isRead ? "bg-[var(--neu-accent)]/5" : "hover:bg-white/[0.02]"
                      )}
                    >
                      <div className="shrink-0 mt-1">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={cn("text-sm font-bold truncate", !n.isRead && "text-[var(--neu-accent)]")}>{n.title}</h4>
                          <span className="text-[10px] opacity-40 whitespace-nowrap ml-2">
                             {n.createdAt && formatDistanceToNow(n.createdAt.toDate ? n.createdAt.toDate() : new Date(), { 
                               addSuffix: true,
                               locale: currentLocale
                             })}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--neu-text-muted)] line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                      {!n.isRead && (
                        <div className="shrink-0 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-[var(--neu-accent)]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
