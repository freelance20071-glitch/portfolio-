import { Linkedin, Github, Briefcase, Mail, ExternalLink } from 'lucide-react';
import type { Profile } from '@/lib/types';

export default function Footer({ profile }: { profile: Profile | null }) {
  const year = new Date().getFullYear();
  const name = profile?.name ?? 'Alex Morgan';

  return (
    <footer className="border-t border-slate-200 py-10 dark:border-slate-800">
      <div className="container-px flex flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {year} {name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noreferrer noopener" className="text-slate-400 transition-colors hover:text-primary" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          )}
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noreferrer noopener" className="text-slate-400 transition-colors hover:text-primary" aria-label="GitHub">
              <Github size={18} />
            </a>
          )}
          {profile?.fiverr_url && (
            <a href={profile.fiverr_url} target="_blank" rel="noreferrer noopener" className="text-slate-400 transition-colors hover:text-primary" aria-label="Fiverr">
              <Briefcase size={18} />
            </a>
          )}
          {profile?.contra_url && (
            <a href={profile.contra_url} target="_blank" rel="noreferrer noopener" className="text-slate-400 transition-colors hover:text-primary" aria-label="Contra">
              <ExternalLink size={18} />
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="text-slate-400 transition-colors hover:text-primary" aria-label="Email">
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
