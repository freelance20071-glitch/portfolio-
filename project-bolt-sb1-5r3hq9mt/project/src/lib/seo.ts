import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

const DEFAULT_TITLE = 'Alex Morgan — Senior Full-Stack Engineer & UI Designer';
const DEFAULT_DESC =
  'Portfolio of Alex Morgan, a senior full-stack engineer and UI designer crafting modern, performant web applications.';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSEO({ title, description, image, url, type = 'website', jsonLd }: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} — Alex Morgan` : DEFAULT_TITLE;
    document.title = fullTitle;
    setMeta('name', 'description', description ?? DEFAULT_DESC);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description ?? DEFAULT_DESC);
    setMeta('property', 'og:type', type);
    if (image) setMeta('property', 'og:image', image);
    if (url) setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description ?? DEFAULT_DESC);
    if (image) setMeta('name', 'twitter:image', image);

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      if (script) document.head.removeChild(script);
    };
  }, [title, description, image, url, type, jsonLd]);
}
