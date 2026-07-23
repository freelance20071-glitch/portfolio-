import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Skills from '@/components/public/Skills';
import Projects from '@/components/public/Projects';
import Services from '@/components/public/Services';
import ExperienceTimeline from '@/components/public/ExperienceTimeline';
import Testimonials from '@/components/public/Testimonials';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';
import LoadingScreen from '@/components/public/LoadingScreen';
import { supabase } from '@/lib/supabase';
import { useSEO } from '@/lib/seo';
import type { Profile, Project, Skill, Service, Experience, Testimonial } from '@/lib/types';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useSEO({
    title: undefined,
    description:
      'Portfolio of Alex Morgan — senior full-stack engineer and UI designer crafting modern, performant web applications.',
    image: profile?.profile_image_url ?? undefined,
    url: window.location.href,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile?.name ?? 'Alex Morgan',
      jobTitle: profile?.title,
      email: profile?.email ?? undefined,
      url: window.location.href,
    },
  });

  useEffect(() => {
    (async () => {
      const [p, pr, sk, sv, ex, ts] = await Promise.all([
        supabase.from('profile').select('*').limit(1).maybeSingle(),
        supabase.from('projects').select('*').eq('published', true).order('featured', { ascending: false }).order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('display_order'),
        supabase.from('services').select('*').order('display_order'),
        supabase.from('experiences').select('*').order('display_order'),
        supabase.from('testimonials').select('*').order('display_order'),
      ]);
      setProfile(p.data as Profile | null);
      setProjects(pr.data as Project[] ?? []);
      setSkills(sk.data as Skill[] ?? []);
      setServices(sv.data as Service[] ?? []);
      setExperiences(ex.data as Experience[] ?? []);
      setTestimonials(ts.data as Testimonial[] ?? []);
      setTimeout(() => setLoading(false), 600);
    })();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Services services={services} />
        <Testimonials testimonials={testimonials} />
        <ExperienceTimeline experiences={experiences} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </motion.div>
  );
}
