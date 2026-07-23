import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, CheckCircle2, Video, Calendar, Tag, Star } from 'lucide-react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { supabase } from '@/lib/supabase';
import { useSEO } from '@/lib/seo';
import { getYouTubeEmbed, sanitizeUrl } from '@/lib/sanitize';
import type { Project, Profile } from '@/lib/types';

export default function ProjectDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useSEO({
    title: project?.title,
    description: project?.short_description,
    image: project?.cover_image_url ?? undefined,
    type: 'article',
    url: window.location.href,
    jsonLd: project
      ? {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.short_description,
          image: project.cover_image_url ?? undefined,
          datePublished: project.completion_date ?? undefined,
        }
      : undefined,
  });

  useEffect(() => {
    (async () => {
      if (!slug) return;
      const [pr, pf] = await Promise.all([
        supabase.from('projects').select('*').eq('slug', slug).eq('published', true).maybeSingle(),
        supabase.from('profile').select('*').limit(1).maybeSingle(),
      ]);
      setProject(pr.data as Project | null);
      setProfile(pf.data as Profile | null);
      setLoading(false);
      // Track view
      if (pr.data) {
        await supabase.from('project_views').insert({ project_id: (pr.data as Project).id });
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold">Project not found</p>
        <Link to="/" className="btn-outline">Back to Home</Link>
      </div>
    );
  }

  const gallery = [project.cover_image_url, ...project.gallery_urls].filter(Boolean) as string[];
  const embedUrl = getYouTubeEmbed(project.video_url);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Navbar />
      <main className="pt-28">
        <div className="container-px">
          <Link to="/#projects" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400">
            <ArrowLeft size={16} /> Back to Projects
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {project.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  <Star size={12} /> Featured
                </span>
              )}
              {project.category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Tag size={12} /> {project.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {project.status}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{project.title}</h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400">{project.short_description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              {project.completion_date && (
                <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Calendar size={15} /> {new Date(project.completion_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {project.live_demo_url && (
                <a href={sanitizeUrl(project.live_demo_url) ?? '#'} target="_blank" rel="noreferrer noopener" className="btn-primary">
                  <ExternalLink size={18} /> Live Demo
                </a>
              )}
              {project.github_url && (
                <a href={sanitizeUrl(project.github_url) ?? '#'} target="_blank" rel="noreferrer noopener" className="btn-outline">
                  <Github size={18} /> GitHub
                </a>
              )}
            </div>
          </motion.div>

          {/* Gallery */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-10">
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <img src={gallery[activeImage]} alt={project.title} className="aspect-[16/9] w-full object-cover" />
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`overflow-hidden rounded-lg border-2 transition-all ${i === activeImage ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Screenshot ${i + 1}`} className="h-16 w-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Video */}
          {embedUrl && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><Video size={20} className="text-primary" /> Video Preview</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                <iframe src={embedUrl} title="Video preview" className="aspect-video w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            </motion.div>
          )}

          {/* Content grid */}
          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="mb-4 text-xl font-semibold">Overview</h2>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">{project.long_description}</p>
              </section>

              {project.challenges_solved && (
                <section>
                  <h2 className="mb-4 text-xl font-semibold">Challenges Solved</h2>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-300">{project.challenges_solved}</p>
                </section>
              )}

              {project.features.length > 0 && (
                <section>
                  <h2 className="mb-4 text-xl font-semibold">Key Features</h2>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <div className="space-y-6">
              <div className="card p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span key={t} className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">{t}</span>
                  ))}
                </div>
              </div>
              <div className="card p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Project Info</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-slate-500">Category</dt><dd className="font-medium">{project.category ?? '—'}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Status</dt><dd className="font-medium capitalize">{project.status}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Completed</dt><dd className="font-medium">{project.completion_date ? new Date(project.completion_date).toLocaleDateString() : '—'}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Views</dt><dd className="font-medium">{project.views}</dd></div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer profile={profile} />
    </motion.div>
  );
}
