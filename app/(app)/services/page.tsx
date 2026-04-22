'use client';

import { useTranslation } from "react-i18next";
import { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { db, useAuth } from "@/lib/providers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, ExternalLink, Share2, Network, Globe } from "lucide-react";
import { toast } from "sonner";

export default function ServicesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [port, setPort] = useState("");
  const [serverId, setServerId] = useState("");
  const [notes, setNotes] = useState("");

  const loadData = useCallback(async () => {
    if(!user) return;
    try {
      const q = query(collection(db, "services"), where("ownerId", "==", user.uid));
      const sq = query(collection(db, "servers"), where("ownerId", "==", user.uid));
      
      const [sSnap, srvSnap] = await Promise.all([getDocs(q), getDocs(sq)]);
      
      setServices(sSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setServers(srvSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "services"), {
        name, url, port, serverId, notes,
        ownerId: user!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success("Service created");
      setOpen(false);
      setName(""); setUrl(""); setPort(""); setServerId(""); setNotes("");
      loadData();
    } catch (error) {
      toast.error("Failed to create service");
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, "services", id));
      toast.success("Service deleted");
      loadData();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight mb-2">{t('services')}</h1>
           <p className="text-[var(--neu-text-muted)]">Управление сервисами, сайтами и приложениями</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="neu-button neu-button-accent px-6 py-3 shrink-0">
               <Plus className="w-4 h-4 mr-2"/> Добавить сервис
            </button>
          </DialogTrigger>
          <DialogContent className="border-0 sm:rounded-3xl p-8 max-w-2xl" style={{ background: 'var(--neu-bg)', boxShadow: 'var(--neu-shadow)', color: 'var(--neu-text)' }}>
            <DialogHeader><DialogTitle className="text-2xl font-bold">Добавить сервис</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-6 pt-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-semibold tracking-wide ml-2 uppercase text-[var(--neu-text-muted)]">Название</label>
                   <input required value={name} onChange={e=>setName(e.target.value)} className="neu-input w-full" placeholder="API Gateway" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-semibold tracking-wide ml-2 uppercase text-[var(--neu-text-muted)]">Порт</label>
                   <input value={port} onChange={e=>setPort(e.target.value)} className="neu-input w-full font-mono text-sm" placeholder="443" />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-semibold tracking-wide ml-2 uppercase text-[var(--neu-text-muted)]">URL / Домен</label>
                 <input value={url} onChange={e=>setUrl(e.target.value)} className="neu-input w-full" placeholder="https://api.example.com" />
               </div>
               
               <div className="space-y-2">
                 <label className="text-sm font-semibold tracking-wide ml-2 uppercase text-[var(--neu-text-muted)]">Привязанный сервер</label>
                 <select 
                    value={serverId} 
                    onChange={(e) => setServerId(e.target.value)}
                    className="neu-input w-full appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[var(--neu-bg)]">Без сервера</option>
                    {servers.map(s => <option key={s.id} value={s.id} className="bg-[var(--neu-bg)]">{s.name} ({s.ipAddress})</option>)}
                 </select>
               </div>
               
               <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wide ml-2 uppercase text-[var(--neu-text-muted)]">Заметки</label>
                  <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="neu-input w-full min-h-[100px] resize-none" placeholder="Дополнительная информация о сервисе..." />
               </div>

              <div className="flex justify-end pt-4"><button type="submit" className="neu-button neu-button-accent px-8 py-3">Сохранить</button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <p className="opacity-50">{t('loading')}</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {services.length === 0 && (
              <div className="neu-panel p-12 text-center text-[var(--neu-text-muted)] col-span-full">
                 <Network className="w-12 h-12 mx-auto mb-4 opacity-20" />
                 <p>У вас еще нет добавленных сервисов</p>
              </div>
           )}
           {services.map((s) => {
              const server = servers.find(srv => srv.id === s.serverId);
              return (
              <div key={s.id} className="neu-panel p-6 flex flex-col h-full group relative transition-all duration-300 hover:scale-[1.02]">
                 <div className="flex justify-between items-start mb-6">
                    <div className="neu-panel-inset p-3 rounded-full text-amber-500">
                       <Network className="w-6 h-6" />
                    </div>
                    
                    <div className="flex gap-2">
                       <button className="neu-button h-8 w-8 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Поделиться">
                          <Share2 className="w-4 h-4" />
                       </button>
                       <button className="neu-button h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(s.id)}>
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
                 
                 <h3 className="text-xl font-bold mb-4 pr-8">{s.name}</h3>
                 
                 {s.url && (
                    <div className="flex items-center gap-2 text-sm text-[var(--neu-accent)] mb-4 bg-[var(--neu-accent)]/10 px-3 py-2 rounded-lg truncate">
                       <Globe className="w-4 h-4 shrink-0" />
                       <a href={s.url.startsWith('http') ? s.url : `http://${s.url}`} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                          {s.url}
                       </a>
                       <ExternalLink className="ml-auto w-3 h-3 shrink-0 opacity-50" />
                    </div>
                 )}
                 
                 <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
                    {s.port && (
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--neu-text-muted)]">Порт:</span>
                          <span className="font-mono bg-[var(--neu-bg)] px-2 py-0.5 rounded shadow-[var(--neu-shadow-inset)]">{s.port}</span>
                       </div>
                    )}
                    {server && (
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--neu-text-muted)]">Сервер:</span>
                          <span className="opacity-90 max-w-[150px] truncate" title={server.name}>{server.name}</span>
                       </div>
                    )}
                 </div>
              </div>
           )})}
        </div>
      )}
    </div>
  );
}
