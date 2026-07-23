import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Eye, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageHeader, StatCard } from '@/components/admin/AdminUI';
import { supabase } from '@/lib/supabase';
import { useCountUp } from '@/hooks/useCountUp';

interface Stats {
  totalProjects: number;
  publishedProjects: number;
  totalViews: number;
  messages: number;
  unreadMessages: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    publishedProjects: 0,
    totalViews: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<{ id: string; name: string; subject: string | null; created_at: string; is_read: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  const views = useCountUp(stats.totalViews, 1500, !loading);
  const projects = useCountUp(stats.totalProjects, 1500, !loading);
  const published = useCountUp(stats.publishedProjects, 1500, !loading);
  const messages = useCountUp(stats.messages, 1500, !loading);

  useEffect(() => {
    (async () => {
      const [pr, pv, msg] = await Promise.all([
        supabase.from('projects').select('id, published, views'),
        supabase.from('project_views').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id, name, subject, created_at, is_read').order('created_at', { ascending: false }).limit(5),
      ]);
      const projects = pr.data ?? [];
      const totalViews = (projects as { views: number }[]).reduce((sum, p) => sum + (p.views || 0), 0) + (pv.count ?? 0);
      setStats({
        totalProjects: projects.length,
        publishedProjects: (projects as { published: boolean }[]).filter((p) => p.published).length,
        totalViews,
        messages: msg.count ?? 0,
        unreadMessages: (msg.data ?? []).filter((m) => !m.is_read).length,
      });
      setRecentMessages((msg.data ?? []) as typeof recentMessages);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's an overview of your portfolio." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Projects" value={loading ? '...' : projects} icon={<FolderKanban size={24} />} />
        <StatCard label="Published" value={loading ? '...' : published} icon={<CheckCircle2 size={24} />} color="bg-green-600" />
        <StatCard label="Total Views" value={loading ? '...' : views} icon={<Eye size={24} />} color="bg-accent" />
        <StatCard label="Messages" value={loading ? '...' : messages} icon={<Mail size={24} />} color="bg-orange-600" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Messages</h2>
            <Link to="/admin/messages" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m) => (
                <Link
                  key={m.id}
                  to="/admin/messages"
                  className="flex items-center gap-3 rounded-lg border border-slate-800 p-3 transition-colors hover:border-slate-700"
                >
                  <div className={`h-2 w-2 shrink-0 rounded-full ${m.is_read ? 'bg-slate-600' : 'bg-primary'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{m.name}</p>
                    <p className="truncate text-xs text-slate-400">{m.subject || m.created_at}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-500">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/projects" className="flex flex-col items-center gap-2 rounded-xl border border-slate-800 p-4 transition-colors hover:border-primary hover:bg-primary/5">
              <FolderKanban size={22} className="text-primary" />
              <span className="text-sm font-medium text-white">New Project</span>
            </Link>
            <Link to="/admin/skills" className="flex flex-col items-center gap-2 rounded-xl border border-slate-800 p-4 transition-colors hover:border-primary hover:bg-primary/5">
              <FolderKanban size={22} className="text-primary" />
              <span className="text-sm font-medium text-white">Add Skill</span>
            </Link>
            <Link to="/admin/services" className="flex flex-col items-center gap-2 rounded-xl border border-slate-800 p-4 transition-colors hover:border-primary hover:bg-primary/5">
              <FolderKanban size={22} className="text-primary" />
              <span className="text-sm font-medium text-white">Add Service</span>
            </Link>
            <Link to="/admin/profile" className="flex flex-col items-center gap-2 rounded-xl border border-slate-800 p-4 transition-colors hover:border-primary hover:bg-primary/5">
              <FolderKanban size={22} className="text-primary" />
              <span className="text-sm font-medium text-white">Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
