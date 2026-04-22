'use client';

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { collection, query, where, getCountFromServer, getDocs, orderBy, limit } from "firebase/firestore";
import { db, useAuth } from "@/lib/providers";
import { FolderKanban, Server, Network, KeyRound, Lock, MousePointer2, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({ projects: 0, servers: 0, services: 0, credentials: 0 });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentServers, setRecentServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadDashboard() {
      try {
        const pQuery = query(collection(db, "projects"), where("ownerId", "==", user!.uid), where("status", "==", "active"));
        const srvQuery = query(collection(db, "servers"), where("ownerId", "==", user!.uid));
        const svcQuery = query(collection(db, "services"), where("ownerId", "==", user!.uid));
        const cQuery = query(collection(db, "credentials"), where("ownerId", "==", user!.uid));

        const [pSnap, srvSnap, svcSnap, cSnap] = await Promise.all([
          getCountFromServer(pQuery),
          getCountFromServer(srvQuery),
          getCountFromServer(svcQuery),
          getCountFromServer(cQuery)
        ]);

        setStats({
          projects: pSnap.data().count,
          servers: srvSnap.data().count,
          services: svcSnap.data().count,
          credentials: cSnap.data().count
        });

        const pRecentQ = query(collection(db, "projects"), where("ownerId", "==", user!.uid), orderBy("createdAt", "desc"), limit(5));
        const sRecentQ = query(collection(db, "servers"), where("ownerId", "==", user!.uid), orderBy("createdAt", "desc"), limit(5));

        const [pRec, sRec] = await Promise.all([getDocs(pRecentQ), getDocs(sRecentQ)]);
        
        setRecentProjects(pRec.docs.map(d => ({ id: d.id, ...d.data() })));
        setRecentServers(sRec.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch(err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  if (loading) return <div className="p-4 opacity-50">{t('loading')}</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Дашборд</h1>
        <p className="text-[var(--neu-text-muted)]">Обзор IT-инфраструктуры</p>
      </div>

      {/* Hero Banner */}
      <div className="neu-panel relative overflow-hidden pl-6 pr-8 py-8 lg:p-10">
        <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-[var(--neu-accent)]"></div>
        <h2 className="text-xl lg:text-2xl font-bold mb-6">
          IT-Box — Единый сейф для всей вашей инфраструктуры
        </h2>
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="neu-panel-inset p-2 rounded-full text-[var(--neu-accent)] shrink-0">
               <Lock className="w-5 h-5" />
            </div>
            <p className="text-[var(--neu-text-muted)] pt-1 lg:text-lg">Прекратите искать доступы в чатах и таблицах.</p>
          </div>
          <div className="flex items-start gap-4">
            <div className="neu-panel-inset p-2 rounded-full text-[var(--neu-accent)] shrink-0">
               <MousePointer2 className="w-5 h-5" />
            </div>
            <p className="text-[var(--neu-text-muted)] pt-1 lg:text-lg">Контролируйте, кто и к чему имеет доступ, в один клик.</p>
          </div>
          <div className="flex items-start gap-4">
            <div className="neu-panel-inset p-2 rounded-full text-[var(--neu-accent)] shrink-0">
               <Users className="w-5 h-5" />
            </div>
            <p className="text-[var(--neu-text-muted)] pt-1 lg:text-lg">От фрилансера до корпорации.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        <div className="neu-panel p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 group cursor-pointer transition-all hover:scale-[1.02]">
           <div className="flex justify-between items-start">
             <span className="text-xs md:text-sm font-semibold tracking-wider text-[var(--neu-text-muted)] uppercase w-2/3">АКТИВНЫХ ПРОЕКТОВ</span>
             <div className="neu-panel-inset p-2.5 rounded-full text-blue-400">
               <FolderKanban className="w-5 h-5" />
             </div>
           </div>
           <div>
             <div className="text-5xl font-bold mb-4">{stats.projects}</div>
             <Link href="/projects" className="text-blue-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Все <ArrowRight className="w-4 h-4" /></Link>
           </div>
        </div>

        <div className="neu-panel p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 group cursor-pointer transition-all hover:scale-[1.02]">
           <div className="flex justify-between items-start">
             <span className="text-xs md:text-sm font-semibold tracking-wider text-[var(--neu-text-muted)] uppercase">СЕРВЕРЫ</span>
             <div className="neu-panel-inset p-2.5 rounded-full text-purple-400">
               <Server className="w-5 h-5" />
             </div>
           </div>
           <div>
             <div className="text-5xl font-bold mb-4">{stats.servers}</div>
             <Link href="/servers" className="text-purple-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Все <ArrowRight className="w-4 h-4" /></Link>
           </div>
        </div>

        <div className="neu-panel p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 group cursor-pointer transition-all hover:scale-[1.02]">
           <div className="flex justify-between items-start">
             <span className="text-xs md:text-sm font-semibold tracking-wider text-[var(--neu-text-muted)] uppercase">СЕРВИСЫ</span>
             <div className="neu-panel-inset p-2.5 rounded-full text-amber-500">
               <Network className="w-5 h-5" />
             </div>
           </div>
           <div>
             <div className="text-5xl font-bold mb-4">{stats.services}</div>
             <Link href="/services" className="text-amber-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Все <ArrowRight className="w-4 h-4" /></Link>
           </div>
        </div>

        <div className="neu-panel p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 group cursor-pointer transition-all hover:scale-[1.02]">
           <div className="flex justify-between items-start">
             <span className="text-xs md:text-sm font-semibold tracking-wider text-[var(--neu-text-muted)] uppercase">ДОСТУПЫ</span>
             <div className="neu-panel-inset p-2.5 rounded-full text-rose-500">
               <KeyRound className="w-5 h-5" />
             </div>
           </div>
           <div>
             <div className="text-5xl font-bold mb-4">{stats.credentials}</div>
             <Link href="/credentials" className="text-rose-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Все <ArrowRight className="w-4 h-4" /></Link>
           </div>
        </div>
      </div>

      {/* Recents */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="neu-panel p-6 md:p-8">
           <h3 className="text-xl font-bold mb-6">Последние проекты</h3>
           <div className="space-y-6">
             {recentProjects.length === 0 ? <p className="text-sm opacity-50">Нет данных</p> : null}
             {recentProjects.map((p) => (
               <div key={p.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <Link href={"/projects"} className="text-lg font-medium hover:text-[var(--neu-accent)] transition-colors">{p.name}</Link>
                  <p className="text-[var(--neu-text-muted)] text-sm mt-1 truncate">{p.description || "Без описания"}</p>
               </div>
             ))}
           </div>
        </div>

        <div className="neu-panel p-6 md:p-8">
           <h3 className="text-xl font-bold mb-6">Последние серверы</h3>
           <div className="space-y-6">
             {recentServers.length === 0 ? <p className="text-sm opacity-50">Нет данных</p> : null}
             {recentServers.map((s) => (
               <div key={s.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <Link href={"/servers"} className="text-lg font-medium hover:text-[var(--neu-accent)] transition-colors">{s.name}</Link>
                  <p className="text-[var(--neu-text-muted)] font-mono text-sm mt-1">{s.ipAddress}</p>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
