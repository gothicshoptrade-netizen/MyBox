'use client';

import { useTranslation } from "react-i18next";
import { useEffect, useState, useCallback, useMemo } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, useAuth } from "@/lib/providers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, FolderKanban, Globe, Code2 } from "lucide-react";
import { toast } from "sonner";

export default function ProjectsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [stack, setStack] = useState("");
  const [status, setStatus] = useState("active");

  const loadProjects = useCallback(async () => {
    if(!user) return;
    try {
      const q = query(collection(db, "projects"), where("ownerId", "==", user.uid));
      const snap = await getDocs(q);
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "projects"), {
        name,
        description: desc,
        url,
        techStack: stack,
        status,
        ownerId: user!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success("Project created");
      setOpen(false);
      setName(""); setDesc(""); setUrl(""); setStack(""); setStatus("active");
      loadProjects();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project");
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      toast.success("Project deleted");
      loadProjects();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t('projects')}</h1>
          <p className="text-[var(--neu-text-muted)]">Управление активными и архивными проектами</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="neu-button neu-button-accent px-6 py-3 shrink-0">
               <Plus className="w-4 h-4 mr-2"/> {t('create_project')}
            </button>
          </DialogTrigger>
          <DialogContent className="border-0 sm:rounded-3xl p-8" style={{ background: 'var(--neu-bg)', boxShadow: 'var(--neu-shadow)', color: 'var(--neu-text)' }}>
            <DialogHeader><DialogTitle className="text-2xl font-bold">{t('create_project')}</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide ml-2 uppercase text-[var(--neu-text-muted)]">Название</label>
                <input required value={name} onChange={e=>setName(e.target.value)} className="neu-input w-full" placeholder="Например: IT-Box" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide ml-2 uppercase text-[var(--neu-text-muted)]">Описание</label>
                <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="neu-input w-full min-h-[100px] resize-none" placeholder="Краткое описание..." />
              </div>
              
              <div className="space-y-2">
                 <label className="text-sm font-semibold tracking-wide ml-2 uppercase text-[var(--neu-text-muted)]">URL</label>
                 <input value={url} onChange={e=>setUrl(e.target.value)} className="neu-input w-full" placeholder="https://" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide ml-2 uppercase text-[var(--neu-text-muted)]">Технологии (через запятую)</label>
                <input value={stack} onChange={e=>setStack(e.target.value)} className="neu-input w-full" placeholder="React, Node.js..." />
              </div>
              <div className="flex justify-end pt-4"><button type="submit" className="neu-button neu-button-accent px-8 py-3">Сохранить</button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <p className="opacity-50">{t('loading')}</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <div key={p.id} className="neu-panel p-6 flex flex-col h-full group relative transition-all duration-300 hover:scale-[1.02]">
              <div className="flex justify-between items-start mb-6">
                <div className="neu-panel-inset p-3 rounded-full text-blue-400">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <div className={p.status === 'active' ? "text-xs font-bold px-3 py-1 bg-green-500/10 text-green-500 rounded-full" : "text-xs font-bold px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full"}>
                  {p.status === 'active' ? 'АКТИВЕН' : 'АРХИВ'}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2 pr-8">{p.name}</h3>
              <p className="text-[var(--neu-text-muted)] text-sm mb-6 line-clamp-3 flex-1">{p.description || "Нет описания."}</p>
              
              {p.url && (
                <div className="flex items-center gap-2 text-sm text-blue-400 mb-4 opacity-80 hover:opacity-100">
                  <Globe className="w-4 h-4" />
                  <a href={p.url.startsWith('http') ? p.url : `https://${p.url}`} target="_blank" rel="noreferrer" className="truncate">{p.url}</a>
                </div>
              )}
              
              {p.techStack && (
                <div className="mt-auto pt-4 border-t border-[var(--neu-text-muted)]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-4 h-4 text-[var(--neu-text-muted)]" />
                    <span className="text-xs font-semibold text-[var(--neu-text-muted)] uppercase tracking-wider">Стек</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.techStack.split(',').map((t: string) => t.trim()).filter(Boolean).map((tech: string, i: number) => (
                      <span key={i} className="text-xs px-2.5 py-1 neu-panel-inset rounded-full opacity-80">{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(p.id)} className="neu-button h-8 w-8 text-red-500"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
