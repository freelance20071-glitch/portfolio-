export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  profile_image_url: string | null;
  resume_url: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  fiverr_url: string | null;
  contra_url: string | null;
  years_experience: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  technologies: string[];
  features: string[];
  challenges_solved: string | null;
  category: string | null;
  status: string;
  cover_image_url: string | null;
  gallery_urls: string[];
  video_url: string | null;
  live_demo_url: string | null;
  github_url: string | null;
  completion_date: string | null;
  featured: boolean;
  published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  icon: string | null;
  percentage: number;
  category: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  icon: string | null;
  title: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  source_service: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string | null;
  client_company: string | null;
  avatar_url: string | null;
  rating: number;
  review_text: string;
  display_order: number;
  created_at: string;
}

export interface Settings {
  id: string;
  theme: string;
  primary_color: string;
  accent_color: string;
  font: string;
  created_at: string;
  updated_at: string;
}

export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'views'>;
